import Product from '../models/productModel.js';

export const cheapestProduct = async (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratings,price';
  req.query.fields = 'title,price,ratings,description,images,brand,category,thumbnail';
  next();
};

//get all products
export const getProducts = async (req, res) => {
  console.log(req.query);
  //1-Filtering
  const queryObj = { ...req.query };
  const excludedFields = ['page', 'sort', 'limit', 'fields'];
  excludedFields.forEach((el) => delete queryObj[el]);

  //2-advanced filtering
  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

  let query = Product.find(JSON.parse(queryStr));

  //3-sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  //4-field limiting
  if (req.query.fields) {
    const fields = req.query.fields.split(',').join(' ');
    console.log(fields);
    query = query.select(fields);
  } else {
    query = query.select('-__v');
  }

  //5-pagination
  const page = req.query.page * 1 || 1;
  console.log(page);
  const limit = req.query.limit * 1 || 100;
  console.log(limit);
  const skip = (page - 1) * limit;
  console.log(skip);
  query = query.skip(skip).limit(limit);

  const products = await query();
  
  res.json({
    status: 'success',
    message: 'All Products fetched successfully',
    results: products.length,
    products,
  });
};

//create a product
export const createProduct = async (req, res) => {
  const product = await Product.create(req.body);
  if (!product) {
    res.status(400).json({ message: 'Invalid Data' });
  }

  res.status(201).json({
    status: 'success',
    message: 'Product created successfully',
    product,
  });
};

//get a product

export const getProductById = async (req, res) => {
  const { id: ProductID } = req.params;
  const product = await Product.findById({ _id: ProductID });
  if (product) {
    res.json({
      status: 'success',
      message: 'Product fetched successfully',
      product,
    });
  } else {
    res.status(404).json({ message: 'Product Not Found' });
  }
};

//update a product

export const updateProduct = async (req, res) => {
  const { id: ProductID } = req.params;
  const product = await Product.findByIdAndUpdate({ _id: ProductID }, req.body, { new: true, runValidators: true });
  if (product) {
    res.json({
      status: 'success',
      message: 'Product updated successfully',
    });
  } else {
    return new Error('Product Not Found');
  }
};

//delete a product

export const deleteProduct = async (req, res) => {
  const { id: ProductID } = req.params;
  const product = await Product.findByIdAndDelete({ _id: ProductID });
  if (product) {
    res.json({
      status: 'success',
      message: 'Product deleted successfully',
      product: null,
    });
  } else {
    res.status(404).json({ message: 'Product Not Found' });
  }
};
