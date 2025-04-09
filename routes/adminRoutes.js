import { Router } from "express";
import adminController from "../controllers/adminController.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/get-users", validateRequest, authorize('admin'), adminController.getUsers); // Get all users
router.get("/get-products", validateRequest, authorize('admin'), adminController.getProducts); // Get all products


router.use(protect); // Protect all routes after this middleware

export default router;