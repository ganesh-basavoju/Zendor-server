import User from "../models/userModel.js";
import AppError from "../utils/appError.js";

class UserController {
  async getMe(req, res, next) {
    try {
      const user = await User.findById(req.user._id).select("-password");
      if (!user) {
        return next(new AppError("User not found", 404));
      }
      res.status(200).json(user);
    } catch (error) {
      return next(
        new AppError("Error occured while retrieving user details", 500)
      );
    }
  }

  async updateMe(req, res, next) {
    try {
      const filteredBody = { ...req.body };
      delete filteredBody.password;
      delete filteredBody.role;

      const user = await User.findByIdAndUpdate(req.user._id, filteredBody, {
        new: true,
        runValidators: true,
      }).select("-password");

      if (!user) {
        return next(new AppError("User not found", 404));
      }
      res.status(200).json(user);
    } catch (error) {
      return next(
        new AppError("Error occured while updating user details", 500)
      );
    }
  }

  async deleteMe(req, res, next) {
    try {
      await User.findByIdAndDelete(req.user._id);
      res.status(204).send();
    } catch (error) {
      return next(
        new AppError("Error occured while deleting user details", 500)
      );
    }
  }

  async addProductToCart(req, res, next) {
    try {
      const user = await User.findById(req.user._id);
      if (!user) {
        return next(new AppError("User not found", 404));
      }
      user.cart.push(req.body.productId);
      await user.save({ validateBeforeSave: false });
      res.status(200).json(user.cart);
    } catch (error) {
      return next(
        new AppError("Error occured while adding product to cart", 500)
      );
    }
  }

  async removeProductFromCart(req, res, next) {
    try {
      const user = await User.findById(req.user._id);
      if (!user) {
        return next(new AppError("User not found", 404));
      }
      const productIdToRemove = req.body.productId.toString();
      user.cart = user.cart.filter(
        (productId) => productId.toString() !== productIdToRemove
      );
      await user.save({ validateBeforeSave: false });
      res.status(200).json(user.cart);
    } catch (error) {
      return next(
        new AppError("Error occured while removing product from cart", 500)
      );
    }
  }

  async addProductToWishlist(req, res, next) {
     try {
      const user = await User.findById(req.user._id);
      if (!user) {
        return next(new AppError("User not found", 404));
      }
      user.wishlist.push(req.body.productId);
      await user.save({ validateBeforeSave: false });
      res.status(200).json(user.wishlist);
    } catch (error) {
      return next(
        new AppError("Error occured while adding product to wishlist", 500)
      );
    }
  }

  async removeProductFromWishlist(req, res, next) {
    try {
      const user = await User.findById(req.user._id);
      if (!user) {
        return next(new AppError("User not found", 404));
      }
      const productIdToRemove = req.body.productId.toString();
      user.wishlist = user.wishlist.filter(
        (productId) => productId.toString() !== productIdToRemove
      );
      await user.save({ validateBeforeSave: false });
      res.status(200).json(user.wishlist);
    } catch (error) {
      return next(
        new AppError("Error occured while removing product from wishlist", 500)
      );
    }
  }

  async getCart(req, res, next) {
    try {
      const user = await User.findById(req.user._id)
        .select('cart')
        .populate("cart");
      if (!user) {
        return next(new AppError("User not found", 404));
      }
      res.status(200).json(user.cart || []);
    } catch (error) {
      return next(new AppError("Error occured while retrieving cart", 500));
    }
  }

  async getWishlist(req, res, next) {
     try {
      const user = await User.findById(req.user._id)
        .select('wishlist')
        .populate("wishlist");
      if (!user) {
        return next(new AppError("User not found", 404));
      }
      res.status(200).json(user.wishlist || []);
    } catch (error) {
      return next(new AppError("Error occured while retrieving wishlist", 500));
    }
  }

  async getOrders(req, res, next) {
    try {
      const user = await User.findById(req.user._id)
        .select('orders')
        .populate("orders");
      if (!user) {
        return next(new AppError("User not found", 404));
      }
      res.status(200).json(user.orders || []);
    } catch (error) {
      return next(new AppError("Error occured while retrieving orders", 500));
    }
  }
}

export default new UserController();