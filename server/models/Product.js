const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    // ===============================
    // PRODUCT NAME
    // ===============================

    name: {
      type: String,
      required: [true, "Product name is required."],
      trim: true,
      minlength: [2, "Product name must be at least 2 characters."],
      maxlength: [200, "Product name cannot exceed 200 characters."],
    },

    // ===============================
    // DESCRIPTION
    // ===============================

    description: {
      type: String,
      required: [true, "Product description is required."],
      trim: true,
      minlength: [
        10,
        "Product description must be at least 10 characters.",
      ],
      maxlength: [
        5000,
        "Product description cannot exceed 5000 characters.",
      ],
    },

    // ===============================
    // PRICE
    // ===============================

    price: {
      type: Number,
      required: [true, "Product price is required."],
      min: [0, "Product price cannot be negative."],
    },

    // ===============================
    // DISCOUNT PRICE
    // ===============================

    discountPrice: {
      type: Number,
      min: [0, "Discount price cannot be negative."],
      default: null,
      validate: {
        validator: function (value) {
          if (
            value === null ||
            value === undefined
          ) {
            return true;
          }

          return value < this.price;
        },
        message:
          "Discount price must be lower than the regular price.",
      },
    },

    // ===============================
    // PRODUCT IMAGE
    // ===============================

    image: {
      type: String,
      required: [true, "Product image is required."],
      trim: true,
    },

    // ===============================
    // CATEGORY
    // ===============================

    category: {
      type: String,
      required: [true, "Product category is required."],
      trim: true,
      minlength: [2, "Category must be at least 2 characters."],
      maxlength: [100, "Category cannot exceed 100 characters."],
    },

    // ===============================
    // BRAND
    // ===============================

    brand: {
      type: String,
      trim: true,
      default: "",
      maxlength: [100, "Brand cannot exceed 100 characters."],
    },

    // ===============================
    // STOCK
    // ===============================

    stock: {
      type: Number,
      required: [true, "Product stock is required."],
      min: [0, "Stock cannot be negative."],
      default: 0,
      validate: {
        validator: Number.isInteger,
        message: "Stock must be a whole number.",
      },
    },

    // ===============================
    // RATING
    // ===============================

    rating: {
      type: Number,
      min: [0, "Rating cannot be below 0."],
      max: [5, "Rating cannot be above 5."],
      default: 0,
    },

    // ===============================
    // NUMBER OF REVIEWS
    // ===============================

    numReviews: {
      type: Number,
      min: [0, "Number of reviews cannot be negative."],
      default: 0,
      validate: {
        validator: Number.isInteger,
        message: "Number of reviews must be a whole number.",
      },
    },

    // ===============================
    // FEATURED PRODUCT
    // ===============================

    isFeatured: {
      type: Boolean,
      default: false,
    },

    // ===============================
    // ACTIVE PRODUCT
    // ===============================

    isActive: {
      type: Boolean,
      default: true,
    },
  },

  // ===============================
  // TIMESTAMPS
  // ===============================

  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Product",
  productSchema
);