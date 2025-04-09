import Product from "../models/productModel.js";
import AppError from "../utils/appError.js";

class ProductController {
  async getAllProducts(req, res, next) {
    // Pagination logic
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    try {
      const products = await Product.find({ isActive: true })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });
      res.status(200).json({
        status: "success",
        data: {
          products,
        },
        page,
        limit,
      });
    } catch (error) {
      return next(
        new AppError("Error fetching products - " + error.message, 500)
      );
    }
  }

  async getProductById(req, res, next) {
    const { id } = req.params;
    try {
      const product = await Product.findById(id);
      if (!product) {
        return next(new AppError("Product not found", 404));
      }
      res.status(200).json({
        status: "success",
        data: {
          product,
        },
      });
    } catch (error) {
      return next(
        new AppError("Error fetching product - " + error.message, 500)
      );
    }
  }

  async getProductsByCategory(req, res, next) {
    const { category } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    try {
      const products = await Product.find({
        category: category,
        isActive: true,
      })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

      if (!products.length) {
        return next(new AppError("No products found in this category", 404));
      }
      res.status(200).json({
        status: "success",
        data: {
          products,
        },
      });
    } catch (error) {
      return next(
        new AppError("Error fetching products - " + error.message, 500)
      );
    }
  }

}

export default new ProductController();
