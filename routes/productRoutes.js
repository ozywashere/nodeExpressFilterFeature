import express from 'express';

const router = express.Router();

import {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  cheapestProduct,
} from '../controllers/productController.js';

router.route('/cheapest').get(cheapestProduct, getProducts);
router.route('/').get(getProducts).post(createProduct);

router.route('/:id').get(getProductById).delete(deleteProduct).put(updateProduct);

export default router;
