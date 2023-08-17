import connectDB from '../config/connectDB.js';
import Product from '../models/productModel.js';
import colors from 'colors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const products = JSON.parse(fs.readFileSync(`${__dirname}/products.json`, 'utf-8'));



const importData = async () => {
  try {
    await Product.insertMany(products);
    console.log('Data Imported'.green.inverse);
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`.red.bold);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Product.deleteMany();
    console.log('Data Destroyed'.red.inverse);
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`.red.bold);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
}

if (process.argv[2] === '-i') {
  importData();
}

connectDB();

