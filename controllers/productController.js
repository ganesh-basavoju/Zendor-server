import Product from "../models/productModel.js";
import AppError from "../utils/appError.js";
import Wallpaper from "../models/wallpaperModel.js";
import WoodenFloor from "../models/woodenFloorModel.js";

const categories = {
  wallpaper: Wallpaper,
  woodenFlooring: WoodenFloor,
};

const findCategory = (category) => categories[category] || null;

class ProductController {
  async addProduct(req, res, next) {
    try {
      const CategoryModel = findCategory(req.body.product.category);
      if (!CategoryModel) {
        return next(new AppError("Invalid product category", 400));
      }

      const productData = await CategoryModel.create({
        ...req.body.product,
        images: req.files.map((file) => file.path),
      });
      if (!productData) {
        return next(new AppError("Error creating product", 400));
      }

      return res.status(201).json({
        status: "success",
        data: {
          product: productData,
        },
      });
    } catch (error) {
      return next(new AppError("Error adding product - " + error.message, 500));
    }
  }

  async updateProduct(req, res, next) {
    const { id } = req.params;
    try {
      const CategoryModel = findCategory(req.body.product.category);
      if (!CategoryModel) {
        return next(new AppError("Invalid product category", 400));
      }
      const product = await CategoryModel.findByIdAndUpdate(
        id,
        { ...req.body.product },
        { new: true, runValidators: true }
      );
      if (!product) {
        return next(new AppError("Product not found", 404));
      }
      res.status(200).json({
        status: "success",
        message: "Product updated successfully",
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
      const CategoryModel = findCategory(req.body.product.category);
      if (!CategoryModel) {
        return next(new AppError("Invalid product category", 400));
      }
      const product = await CategoryModel.findByIdAndUpdate(
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

  // async getAllProducts(req, res, next) {
  //   // Pagination logic
  //   const { page = 1, limit = 10 } = req.query;
  //   const skip = (page - 1) * limit;
  //   try {
  //     const CategoryModel = findCategory(req.body.product.category);
  //     if (!CategoryModel) {
  //       return next(new AppError("Invalid product category", 400));
  //     }
  //     const products = await CategoryModel.find({ isActive: true })
  //       .skip(skip)
  //       .limit(limit)
  //       .sort({ createdAt: -1 });
  //     res.status(200).json({
  //       status: "success",
  //       data: {
  //         products,
  //       },
  //       page,
  //       limit,
  //     });
  //   } catch (error) {
  //     return next(
  //       new AppError("Error fetching products - " + error.message, 500)
  //     );
  //   }
  // }

  async getProductById(req, res, next) {
    const { id } = req.params;
    try {
      const CategoryModel = findCategory(req.body.product.category);
      if (!CategoryModel) {
        return next(new AppError("Invalid product category", 400));
      }
      const product = await CategoryModel.findById(id);
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
      const CategoryModel = findCategory(category);
      if (!CategoryModel) {
        return next(new AppError("Invalid product category", 400));
      }
      const products = await CategoryModel.find({
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

  async getProductsBySubCategory(req, res, next) {
    const { category, subcategory } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    try {
      const CategoryModel = findCategory(category);
      if (!CategoryModel) {
        return next(new AppError("Invalid product category", 400));
      }
      const products = await CategoryModel.find({
        subCategory: subcategory,
        isActive: true,
      })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

      if (!products.length) {
        return next(new AppError("No products found in this sub-category", 404));
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
