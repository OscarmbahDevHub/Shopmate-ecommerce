const express = require("express");
const mongoose = require("mongoose");

const Product = require("../models/Product");
const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const router = express.Router();

// ===============================
// HELPER — VALIDATE PRODUCT ID
// ===============================

const isValidProductId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

// ===============================
// GET ALL PRODUCTS — PUBLIC
// ===============================

router.get("/", async (req, res) => {
  try {
    const products = await Product.find({
      isActive: true,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error(
      "❌ Get Products Error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while fetching products.",
    });
  }
});

// ===============================
// GET SINGLE PRODUCT — PUBLIC
// ===============================

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidProductId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID.",
      });
    }

    const product = await Product.findOne({
      _id: id,
      isActive: true,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error(
      "❌ Get Product Error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while fetching product.",
    });
  }
});

// ===============================
// CREATE PRODUCT — ADMIN ONLY
// ===============================

router.post(
  "/",
  protect,
  admin,
  async (req, res) => {
    try {
      const {
        name,
        description,
        price,
        discountPrice,
        image,
        category,
        brand,
        stock,
        rating,
        numReviews,
        isFeatured,
      } = req.body;

      // ===============================
      // REQUIRED FIELDS
      // ===============================

      if (
        typeof name !== "string" ||
        typeof description !== "string" ||
        typeof image !== "string" ||
        typeof category !== "string" ||
        price === undefined ||
        price === null
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Name, description, price, image and category are required.",
        });
      }

      // ===============================
      // CLEAN STRING VALUES
      // ===============================

      const cleanName = name.trim();
      const cleanDescription =
        description.trim();
      const cleanImage = image.trim();
      const cleanCategory = category.trim();
      const cleanBrand =
        typeof brand === "string"
          ? brand.trim()
          : "";

      // ===============================
      // BASIC VALIDATION
      // ===============================

      if (
        !cleanName ||
        !cleanDescription ||
        !cleanImage ||
        !cleanCategory
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Product name, description, image and category cannot be empty.",
        });
      }

      const numericPrice = Number(price);

      if (
        !Number.isFinite(numericPrice) ||
        numericPrice < 0
      ) {
        return res.status(400).json({
          success: false,
          message: "Product price must be a valid number.",
        });
      }

      let numericDiscountPrice = null;

      if (
        discountPrice !== null &&
        discountPrice !== undefined &&
        discountPrice !== ""
      ) {
        numericDiscountPrice =
          Number(discountPrice);

        if (
          !Number.isFinite(
            numericDiscountPrice
          ) ||
          numericDiscountPrice < 0
        ) {
          return res.status(400).json({
            success: false,
            message:
              "Discount price must be a valid number.",
          });
        }

        if (
          numericDiscountPrice >= numericPrice
        ) {
          return res.status(400).json({
            success: false,
            message:
              "Discount price must be lower than the regular price.",
          });
        }
      }

      // ===============================
      // STOCK VALIDATION
      // ===============================

      const numericStock =
        stock === undefined ||
        stock === null ||
        stock === ""
          ? 0
          : Number(stock);

      if (
        !Number.isInteger(numericStock) ||
        numericStock < 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Stock must be a whole number greater than or equal to 0.",
        });
      }

      // ===============================
      // RATING VALIDATION
      // ===============================

      const numericRating =
        rating === undefined ||
        rating === null ||
        rating === ""
          ? 0
          : Number(rating);

      if (
        !Number.isFinite(numericRating) ||
        numericRating < 0 ||
        numericRating > 5
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Rating must be between 0 and 5.",
        });
      }

      // ===============================
      // REVIEW COUNT VALIDATION
      // ===============================

      const numericNumReviews =
        numReviews === undefined ||
        numReviews === null ||
        numReviews === ""
          ? 0
          : Number(numReviews);

      if (
        !Number.isInteger(
          numericNumReviews
        ) ||
        numericNumReviews < 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Number of reviews must be a whole number greater than or equal to 0.",
        });
      }

      // ===============================
      // CREATE PRODUCT
      // ===============================

      const product = await Product.create({
        name: cleanName,
        description: cleanDescription,
        price: numericPrice,
        discountPrice:
          numericDiscountPrice,
        image: cleanImage,
        category: cleanCategory,
        brand: cleanBrand,
        stock: numericStock,
        rating: numericRating,
        numReviews: numericNumReviews,
        isFeatured:
          Boolean(isFeatured),
      });

      return res.status(201).json({
        success: true,
        message: "Product created successfully.",
        product,
      });
    } catch (error) {
      console.error(
        "❌ Create Product Error:",
        error.message
      );

      return res.status(500).json({
        success: false,
        message:
          "Server error while creating product.",
      });
    }
  }
);

// ===============================
// UPDATE PRODUCT — ADMIN ONLY
// ===============================

router.put(
  "/:id",
  protect,
  admin,
  async (req, res) => {
    try {
      const { id } = req.params;

      if (!isValidProductId(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid product ID.",
        });
      }

      const allowedFields = [
        "name",
        "description",
        "price",
        "discountPrice",
        "image",
        "category",
        "brand",
        "stock",
        "rating",
        "numReviews",
        "isFeatured",
        "isActive",
      ];

      const updates = {};

      for (const field of allowedFields) {
        if (
          Object.prototype.hasOwnProperty.call(
            req.body,
            field
          )
        ) {
          updates[field] = req.body[field];
        }
      }

      if (Object.keys(updates).length === 0) {
        return res.status(400).json({
          success: false,
          message:
            "No valid product fields were provided for update.",
        });
      }

      // ===============================
      // CLEAN STRING FIELDS
      // ===============================

      const stringFields = [
        "name",
        "description",
        "image",
        "category",
        "brand",
      ];

      for (const field of stringFields) {
        if (updates[field] !== undefined) {
          if (
            typeof updates[field] !== "string"
          ) {
            return res.status(400).json({
              success: false,
              message: `${field} must be a string.`,
            });
          }

          updates[field] =
            updates[field].trim();
        }
      }

      // ===============================
      // NUMBER FIELDS
      // ===============================

      if (updates.price !== undefined) {
        updates.price = Number(updates.price);

        if (
          !Number.isFinite(updates.price) ||
          updates.price < 0
        ) {
          return res.status(400).json({
            success: false,
            message:
              "Price must be a valid number greater than or equal to 0.",
          });
        }
      }

      if (
        updates.discountPrice !== undefined
      ) {
        if (
          updates.discountPrice === null ||
          updates.discountPrice === ""
        ) {
          updates.discountPrice = null;
        } else {
          updates.discountPrice =
            Number(updates.discountPrice);

          if (
            !Number.isFinite(
              updates.discountPrice
            ) ||
            updates.discountPrice < 0
          ) {
            return res.status(400).json({
              success: false,
              message:
                "Discount price must be a valid number.",
            });
          }
        }
      }

      if (updates.stock !== undefined) {
        updates.stock = Number(updates.stock);

        if (
          !Number.isInteger(updates.stock) ||
          updates.stock < 0
        ) {
          return res.status(400).json({
            success: false,
            message:
              "Stock must be a whole number greater than or equal to 0.",
          });
        }
      }

      if (updates.rating !== undefined) {
        updates.rating = Number(updates.rating);

        if (
          !Number.isFinite(updates.rating) ||
          updates.rating < 0 ||
          updates.rating > 5
        ) {
          return res.status(400).json({
            success: false,
            message:
              "Rating must be between 0 and 5.",
          });
        }
      }

      if (
        updates.numReviews !== undefined
      ) {
        updates.numReviews =
          Number(updates.numReviews);

        if (
          !Number.isInteger(
            updates.numReviews
          ) ||
          updates.numReviews < 0
        ) {
          return res.status(400).json({
            success: false,
            message:
              "Number of reviews must be a whole number greater than or equal to 0.",
          });
        }
      }

      // ===============================
      // BOOLEAN FIELDS
      // ===============================

      if (
        updates.isFeatured !== undefined
      ) {
        if (
          typeof updates.isFeatured !==
          "boolean"
        ) {
          return res.status(400).json({
            success: false,
            message:
              "isFeatured must be true or false.",
          });
        }
      }

      if (
        updates.isActive !== undefined
      ) {
        if (
          typeof updates.isActive !==
          "boolean"
        ) {
          return res.status(400).json({
            success: false,
            message:
              "isActive must be true or false.",
          });
        }
      }

      // ===============================
      // FETCH CURRENT PRODUCT
      // ===============================

      const product = await Product.findById(id);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found.",
        });
      }

      // ===============================
      // VALIDATE FINAL PRICES
      // ===============================

      const finalPrice =
        updates.price !== undefined
          ? updates.price
          : product.price;

      const finalDiscountPrice =
        updates.discountPrice !== undefined
          ? updates.discountPrice
          : product.discountPrice;

      if (
        finalDiscountPrice !== null &&
        finalDiscountPrice !== undefined &&
        finalDiscountPrice >= finalPrice
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Discount price must be lower than the regular price.",
        });
      }

      // ===============================
      // APPLY UPDATE
      // ===============================

      Object.assign(product, updates);

      await product.save();

      return res.status(200).json({
        success: true,
        message: "Product updated successfully.",
        product,
      });
    } catch (error) {
      console.error(
        "❌ Update Product Error:",
        error.message
      );

      return res.status(500).json({
        success: false,
        message:
          "Server error while updating product.",
      });
    }
  }
);

// ===============================
// DELETE PRODUCT — ADMIN ONLY
// ===============================

router.delete(
  "/:id",
  protect,
  admin,
  async (req, res) => {
    try {
      const { id } = req.params;

      if (!isValidProductId(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid product ID.",
        });
      }

      const product =
        await Product.findById(id);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found.",
        });
      }

      // Soft delete
      product.isActive = false;

      await product.save();

      return res.status(200).json({
        success: true,
        message: "Product deleted successfully.",
      });
    } catch (error) {
      console.error(
        "❌ Delete Product Error:",
        error.message
      );

      return res.status(500).json({
        success: false,
        message:
          "Server error while deleting product.",
      });
    }
  }
);

module.exports = router;