import { Router } from 'express';
import { validateRequest } from '../middleware/validateRequest.js';
import productController from '../controllers/productController.js';

const router = Router();

router.get('/all-products',validateRequest, productController.getAllProducts); 
router.get('/product/:id', validateRequest, productController.getProductById); 
router.get('/category/:category', validateRequest, productController.getProductsByCategory); 

export default router;