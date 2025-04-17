import { Router } from "express";
import adminController from "../controllers/adminController.js";
import productController from "../controllers/productController.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.post(
  "/add-product",
  validateRequest,
  setProductData,
  protect,
  productController.addProduct
); // Add a new product

router.put(
  "/update-product/:id",
  validateRequest,
  protect,
  productController.updateProduct
); // Update product by ID

router.delete(
  "/delete-product/:id",
  validateRequest,
  protect,
  productController.deleteProduct
); // Delete product by ID

router.get("/get-users", validateRequest, protect, adminController.getUsers); // Get all users
router.get("/get-orders", validateRequest, protect, adminController.getAllOrders); // Get all orders

export default router;
