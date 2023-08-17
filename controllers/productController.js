import Product from '../models/productModel.js';

export const cheapestProduct = async (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratings,price';
  req.query.fields = 'title,price,ratings,description,images,brand,category,thumbnail';
  next();
};

class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    //2-advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = Product.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      console.log(fields);
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    console.log(page);
    const limit = this.queryString.limit * 1 || 100;
    console.log(limit);
    const skip = (page - 1) * limit;
    console.log(skip);
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

export const getProducts = async (req, res) => {
  const features = new APIFeatures(Product.find(), req.query).filter().sort().limitFields().paginate();
  const products = await features.query;
  res.json({
    status: 'success',
    message: 'Products fetched successfully',
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
