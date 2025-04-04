import { Router } from "express";
import userController from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = Router();

router.get("/me", validateRequest, userController.getMe);
router.post("/add-to-cart", validateRequest, userController.addProductToCart);
router.post(
  "/remove-from-cart",
  validateRequest,
  userController.removeProductFromCart
);
router.post(
  "/add-to-wishlist",
  validateRequest,
  userController.addProductToWishlist
);
router.post(
  "/remove-from-wishlist",
  validateRequest,
  userController.removeProductFromWishlist
);
router.get("/get-cart", validateRequest, userController.getCart);
router.get("/get-wishlist", validateRequest, userController.getWishlist);
router.get("/get-orders", validateRequest, userController.getOrders);
router.patch("/updateMe", validateRequest, userController.updateMe);
router.delete("/deleteMe", validateRequest, userController.deleteMe);

router.use(protect); // Protect all routes after this middleware

export default router;
