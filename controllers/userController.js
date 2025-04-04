import User from "../models/userModel.js";
import AppError from "../utils/appError.js";

class UserController {
  async getMe(req, res) {
    try {
      const user = await User.findById(req.user._id).select("-password");
      if (!user) {
        return next(new AppError("User not found", 404));
      }
      res.status(200).json(user);
    } catch (error) {
      return next(
        new AppError("Error occured while retrieving user details", 501)
      );
    }
  }
  async updateMe(req, res) {
    try {
      const user = await User.findByIdAndUpdate(req.user._id, req.body, {
        new: true,
        runValidators: true,
      }).select("-password");
      if (!user) {
        return next(new AppError("User not found", 404));
      }
      res.status(200).json(user);
    } catch (error) {
      return next(
        new AppError("Error occured while updating user details", 501)
      );
    }
  }
  async deleteMe(req, res) {
    try {
      await User.findByIdAndDelete(req.user._id);
      res.status(204).json({ status: "success", data: null });
    } catch (error) {
      return next(
        new AppError("Error occured while deleting user details", 501)
      );
    }
  }
  async addProductToCart(req, res) {
    try {
      const user = await User.findById(req.user._id);
      if (!user) {
        return next(new AppError("User not found", 404));
      }
      user.cart.push(req.body.productId);
      await user.save();
      res.status(200).json(user.cart);
    } catch (error) {
      return next(
        new AppError("Error occured while adding product to cart", 501)
      );
    }
  }

  async removeProductFromCart(req, res) {
    try {
      const user = await User.findById(req.user._id);
      if (!user) {
        return next(new AppError("User not found", 404));
      }
      user.cart = user.cart.filter(
        (productId) => productId !== req.body.productId
      );
      await user.save();
      res.status(200).json(user.cart);
    } catch (error) {
      return next(
        new AppError("Error occured while removing product from cart", 501)
      );
    }
  }

  async addProductToWishlist(req, res) {
    try {
      const user = await User.findById(req.user._id);
      if (!user) {
        return next(new AppError("User not found", 404));
      }
      user.wishlist.push(req.body.productId);
      await user.save();
      res.status(200).json(user.wishlist);
    } catch (error) {
      return next(
        new AppError("Error occured while adding product to wishlist", 501)
      );
    }
  }

  async removeProductFromWishlist(req, res) {
    try {
      const user = await User.findById(req.user._id);
      if (!user) {
        return next(new AppError("User not found", 404));
      }
      user.wishlist = user.wishlist.filter(
        (productId) => productId !== req.body.productId
      );
      await user.save();
      res.status(200).json(user.wishlist);
    } catch (error) {
      return next(
        new AppError("Error occured while removing product from wishlist", 501)
      );
    }
  }

  async getCart(req, res) {
    try {
      const user = await User.findById(req.user._id, {
        cart: 1,
        _id: 0,
      }).populate("cart");
      if (!user) {
        return next(new AppError("User not found", 404));
      }
      res.status(200).json(user.cart);
    } catch (error) {
      return next(new AppError("Error occured while retrieving cart", 501));
    }
  }

  async getWishlist(req, res) {
    try {
      const user = await User.findById(req.user._id, {
        wishlist: 1,
        _id: 0,
      }).populate("wishlist");
      if (!user) {
        return next(new AppError("User not found", 404));
      }
      res.status(200).json(user.wishlist);
    } catch (error) {
      return next(new AppError("Error occured while retrieving wishlist", 501));
    }
  }

  async getOrders(req, res) {
    try {
      const user = await User.findById(req.user._id, {
        orders: 1,
        _id: 0,
      }).populate("orders");
      if (!user) {
        return next(new AppError("User not found", 404));
      }
      res.status(200).json(user.orders);
    } catch (error) {
      return next(new AppError("Error occured while retrieving orders", 501));
    }
  }
}

export default new UserController();
