import { Router } from 'express';
import { validateRequest } from '../middleware/validateRequest.js';
import productController from '../controllers/productController.js';

const router = Router();

// router.get('/get-all-products',validateRequest, productController.getAllProducts); // Get all products
router.get('/search/:category/:id', validateRequest, productController.getProductById); // Get product by ID
router.get('/search/category/:category', validateRequest, productController.getProductsByCategory); // Get products by category
router.get('/search/category/:category/:subcategory', validateRequest, productController.getProductsBySubCategory); // Get products by subcategory

export default router;