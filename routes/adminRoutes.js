import { Router } from "express";
import adminController from "../controllers/adminController.js";
import productController from "../controllers/productController.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/get-users", validateRequest, adminController.getUsers); // Get all users
// router.get("/get-products", validateRequest, adminController.getProducts);
router.get("/get-orders", validateRequest, adminController.getAllOrders); // Get all orders

// router.use(protect); // Protect all routes after this middleware

export default router;