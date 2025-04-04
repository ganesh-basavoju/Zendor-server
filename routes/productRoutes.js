import { Router } from 'express';
import { validateRequest } from '../middleware/validateRequest.js';
import productController from '../controllers/productController.js';

const router = Router();

router.get('/all-products',validateRequest, productController.getAllProducts); // Get all products
router.get('/product/:id', validateRequest, productController.getProductById); // Get product by ID
router.get('/category/:category', validateRequest, productController.getProductsByCategory); // Get products by category

export default router;