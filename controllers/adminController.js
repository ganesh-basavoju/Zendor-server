import User from "../models/userModel.js"; // Assuming you have a User model
import Order from "../models/orderModel.js"; // Assuming you have an Order model
import AppError from "../utils/appError.js";

class AdminController {
  async getUsers(req, res) {
    try {
      const users = await User.find({});
      res.json(users);
    } catch (error) {
      console.error(error.message);
      return next(new AppError("Server Error", 500));
    }
  }

  // async getProducts(req, res) {
  //   try {
  //     const products = await Product.find({});
  //     res.json(products);
  //   } catch (error) {
  //     console.error(error.message);
  //     return next(new AppError("Server Error", 500));
  //   }
  // }

  async getAllOrders(req, res) {
    try {
      // Populate user and orderItems details if needed
      const orders = await Order.find({})
        .populate("user", "id name email")
        .populate("items.product");
      res.json(orders);
    } catch (error) {
      console.error(error.message);
      return next(new AppError("Server Error", 500));
    }
  }
}

export default new AdminController();
