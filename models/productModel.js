import mongoose from 'mongoose';
import validator from 'validator';
const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [5, 'Title cannot be less than 5 characters'],
      maxlength: [150, 'Title cannot be more than 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      minlength: [5, 'Description cannot be less than 5 characters'],
      maxlength: [1000, 'Description cannot be more than 2000 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [1, 'Price cannot be less than 1'],
      max: [1000000, 'Price cannot be more than 1000000'],
    },
    discountPercentage: {
      type: Number,
      required: [true, 'Discount Percentage is required'],
      min: [0, 'Discount Percentage cannot be less than 0'],
      max: [100, 'Discount Percentage cannot be more than 100'],
 
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating cannot be less than 0'],
      max: [5, 'Rating cannot be more than 5'],
    },
    stock: {
      type: Number,
      required: [true, 'Stock is required'],
      min: [0, 'Stock cannot be less than 0'],
      max: [1000000, 'Stock cannot be more than 1000000'],
    },
    brand: {
      type: String,
      required: [true, 'Brand is required'],
      trim: true,
      minlength: [2, 'Brand cannot be less than 2 characters'],
      maxlength: [50, 'Brand cannot be more than 50 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      minlength: [2, 'Category cannot be less than 2 characters'],
      maxlength: [50, 'Category cannot be more than 50 characters'],
    },
    thumbnail: {
      type: String,
      required: [true, 'Thumbnail is required'],
      trim: true,
      validate: {
        validator: function (value) {
          return validator.isURL(value);
        },
      },
    },
    images: {
      type: [String],
      required: [true, 'Images are required'],
      validate: {
        validator: function (value) {
          return value.length >= 1;
        },
      },
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);

export default Product;
