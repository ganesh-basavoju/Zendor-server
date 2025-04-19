import { Router } from "express";
import userController from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = Router();

router.get("/me", validateRequest, protect, userController.getMe);
router.post("/add-to-cart", validateRequest, userController.addProductToCart);
router.delete(
  "/remove-from-cart",
  validateRequest,
  userController.removeProductFromCart
);
router.post(
  "/add-to-wishlist",
  validateRequest,
  userController.addProductToWishlist
);
router.delete(
  "/remove-from-wishlist",
  validateRequest,
  userController.removeProductFromWishlist
);
router.get("/get-cart", validateRequest, userController.getCart);
router.get("/get-wishlist", validateRequest, userController.getWishlist);
router.get("/get-my-orders", validateRequest, protect, userController.getOrders);
router.patch("/update-me", validateRequest, protect, userController.updateMe);
router.delete("/delete-me", validateRequest, protect, userController.deleteMe);

// router.use(protect); // Protect all routes after this middleware

export default router;
