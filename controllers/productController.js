import Product from "../models/productModel.js";
import AppError from "../utils/appError.js";
import setProductData from "../lib/setProductData.js";

class ProductController {
  async addProduct(req, res, next) {
    try {
      const productData = setProductData(req.body);
    } catch (error) {
      return next(new AppError("Error adding product - " + error.message, 500));
    }
  }

  async updateProduct(req, res, next) {
    const { id } = req.params;
    const { name, price, category, description } = req.body;
    try {
      const product = await Product.findByIdAndUpdate(
        id,
        { name, price, category, description },
        { new: true, runValidators: true }
      );
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
        new AppError("Error updating product - " + error.message, 500)
      );
    }
  }

  async deleteProduct(req, res, next) {
    const { id } = req.params;
    try {
      const product = await Product.findByIdAndUpdate(
        id,
        { isActive: false },
        { new: true, runValidators: true }
      );
      if (!product) {
        return next(new AppError("Product not found", 404));
      }
      res.status(204).json({
        status: "success",
        message: "Product deleted successfully",
      });
    } catch (error) {
      return next(
        new AppError("Error deleting product - " + error.message, 500)
      );
    }
  }

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
