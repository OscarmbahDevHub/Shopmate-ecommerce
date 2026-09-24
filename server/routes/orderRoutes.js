const express = require("express");
const mongoose = require("mongoose");

const Order = require("../models/Order");
const Product = require("../models/Product");
const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const router = express.Router();

const PAYMENT_METHODS = [
  "Paystack",
  "PayPal",
  "Bank Transfer",
];

const ORDER_STATUSES = [
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

const ORDER_CURRENCY = "USD";

// =========================================================
// HELPERS
// =========================================================

const isValidObjectId = (id) => {
  if (!id) return false;

  return mongoose.isObjectIdOrHexString(id);
};

const normalizeProductId = (value) => {
  if (!value) return null;

  if (
    typeof value === "string" ||
    value instanceof mongoose.Types.ObjectId
  ) {
    const stringValue = String(value);

    return isValidObjectId(stringValue)
      ? stringValue
      : null;
  }

  if (typeof value === "object") {
    const nestedId =
      value._id ||
      value.id ||
      value.$oid ||
      null;

    if (!nestedId) return null;

    const stringValue = String(nestedId);

    return isValidObjectId(stringValue)
      ? stringValue
      : null;
  }

  return null;
};

const getProductId = (item) => {
  if (!item || typeof item !== "object") {
    return null;
  }

  const possibleIds = [
    item.product,
    item.productId,
    item._id,
    item.id,
  ];

  for (const possibleId of possibleIds) {
    const productId =
      normalizeProductId(possibleId);

    if (productId) {
      return productId;
    }
  }

  return null;
};

const getActualProductPrice = (product) => {
  const price = Number(product.price);

  const discountPrice =
    product.discountPrice !== null &&
    product.discountPrice !== undefined
      ? Number(product.discountPrice)
      : null;

  if (
    Number.isFinite(discountPrice) &&
    discountPrice >= 0 &&
    discountPrice < price
  ) {
    return discountPrice;
  }

  return price;
};

// =========================================================
// CREATE ORDER
// =========================================================

router.post(
  "/",
  protect,
  async (req, res) => {
    try {
      const {
        items,
        shippingAddress,
        paymentMethod,
      } = req.body;

      // ---------------------------------------------------
      // BASIC VALIDATION
      // ---------------------------------------------------

      if (
        !Array.isArray(items) ||
        items.length === 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Order must contain at least one product.",
        });
      }

      if (!shippingAddress) {
        return res.status(400).json({
          success: false,
          message:
            "Shipping information is required.",
        });
      }

      if (
        typeof paymentMethod !== "string" ||
        !PAYMENT_METHODS.includes(
          paymentMethod
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Please select a valid payment method.",
        });
      }

      // ---------------------------------------------------
      // SHIPPING VALIDATION
      // ---------------------------------------------------

      const requiredFields = [
        "fullName",
        "email",
        "phone",
        "street",
        "city",
        "state",
      ];

      for (const field of requiredFields) {
        if (
          typeof shippingAddress[field] !==
            "string" ||
          !shippingAddress[field].trim()
        ) {
          return res.status(400).json({
            success: false,
            message:
              `${field} is required.`,
          });
        }
      }

      const email =
        shippingAddress.email
          .trim()
          .toLowerCase();

      const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message:
            "Please provide a valid email address.",
        });
      }

      // ---------------------------------------------------
      // PAYSTACK
      // ---------------------------------------------------
      // Paystack is intentionally disabled for this
      // portfolio project.
      //
      // It remains visible on the frontend, but no real
      // Paystack payment will be processed.

      if (paymentMethod === "Paystack") {
        return res.status(400).json({
          success: false,
          message:
            "Paystack payments are currently unavailable for this portfolio demo.",
        });
      }

      // ---------------------------------------------------
      // BUILD ORDER ITEMS FROM DATABASE
      // ---------------------------------------------------

      const finalItems = [];
      let calculatedTotal = 0;

      for (const item of items) {
        if (
          !item ||
          typeof item !== "object"
        ) {
          return res.status(400).json({
            success: false,
            message:
              "Invalid order item.",
          });
        }

        const productId =
          getProductId(item);

        if (!productId) {
          return res.status(400).json({
            success: false,
            message:
              "Each order item must contain a valid product ID.",
          });
        }

        const quantity =
          Number(item.quantity);

        if (
          !Number.isInteger(quantity) ||
          quantity <= 0
        ) {
          return res.status(400).json({
            success: false,
            message:
              `Invalid quantity for ${
                item.name || "product"
              }.`,
          });
        }

        const product =
          await Product.findOne({
            _id: productId,
            isActive: true,
          });

        if (!product) {
          return res.status(400).json({
            success: false,
            message:
              "One of the products in your cart is no longer available.",
          });
        }

        if (
          quantity >
          Number(product.stock)
        ) {
          return res.status(400).json({
            success: false,
            message:
              `Not enough stock available for "${product.name}".`,
          });
        }

        const actualPrice =
          getActualProductPrice(product);

        if (
          !Number.isFinite(actualPrice) ||
          actualPrice < 0
        ) {
          return res.status(400).json({
            success: false,
            message:
              `Invalid price for "${product.name}".`,
          });
        }

        calculatedTotal +=
          actualPrice * quantity;

        finalItems.push({
          product: product._id,
          name: product.name,
          price: actualPrice,
          quantity,
          image: product.image || "",
        });
      }

      // ---------------------------------------------------
      // FINAL TOTAL
      // ---------------------------------------------------

      const finalTotal = Number(
        calculatedTotal.toFixed(2)
      );

      if (
        !Number.isFinite(finalTotal) ||
        finalTotal <= 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid order total.",
        });
      }

      // ---------------------------------------------------
      // CREATE ORDER
      // ---------------------------------------------------

      const order =
        await Order.create({
          user: req.user._id,

          items: finalItems,

          shippingAddress: {
            fullName:
              shippingAddress.fullName.trim(),

            email,

            phone:
              shippingAddress.phone.trim(),

            street:
              shippingAddress.street.trim(),

            city:
              shippingAddress.city.trim(),

            state:
              shippingAddress.state.trim(),
          },

          paymentMethod,

          paymentStatus: "Pending",

          paymentReference: "",

          paidAt: null,

          currency: ORDER_CURRENCY,

          totalPrice: finalTotal,

          status: "Pending",
        });

      // ---------------------------------------------------
      // REDUCE STOCK
      // ---------------------------------------------------

      for (const item of finalItems) {
        await Product.findByIdAndUpdate(
          item.product,
          {
            $inc: {
              stock: -item.quantity,
            },
          }
        );
      }

      console.log(
        "✅ ORDER CREATED:",
        order._id
      );

      return res.status(201).json({
        success: true,
        message:
          "Order placed successfully.",
        order,
      });
    } catch (error) {
      console.error(
        "❌ Create Order Error:",
        error
      );

      if (
        error.name ===
        "ValidationError"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid order information.",
          errors:
            Object.values(
              error.errors
            ).map(
              (validationError) =>
                validationError.message
            ),
        });
      }

      return res.status(500).json({
        success: false,
        message:
          error.message ||
          "Unable to create order.",
      });
    }
  }
);

// =========================================================
// PAYSTACK INITIALIZE
// =========================================================
// Intentionally disabled.
// Paystack remains visible in the frontend as a demo option.

router.post(
  "/paystack/initialize",
  protect,
  async (req, res) => {
    return res.status(400).json({
      success: false,
      message:
        "Paystack payments are currently unavailable for this portfolio demo.",
    });
  }
);

// =========================================================
// PAYSTACK VERIFY
// =========================================================
// Intentionally disabled.

router.get(
  "/paystack/verify/:reference",
  protect,
  async (req, res) => {
    return res.status(400).json({
      success: false,
      message:
        "Paystack payments are currently unavailable for this portfolio demo.",
    });
  }
);

// =========================================================
// MY ORDERS
// =========================================================

router.get(
  "/my-orders",
  protect,
  async (req, res) => {
    try {
      const orders =
        await Order.find({
          user: req.user._id,
        })
          .populate(
            "items.product"
          )
          .sort({
            createdAt: -1,
          });

      return res.status(200).json({
        success: true,
        count: orders.length,
        orders,
      });
    } catch (error) {
      console.error(
        "❌ Get My Orders Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Server error while fetching orders.",
      });
    }
  }
);

// =========================================================
// ADMIN — ALL ORDERS
// =========================================================

router.get(
  "/admin/all",
  protect,
  admin,
  async (req, res) => {
    try {
      const orders =
        await Order.find({})
          .populate(
            "user",
            "name email"
          )
          .populate(
            "items.product"
          )
          .sort({
            createdAt: -1,
          });

      return res.status(200).json({
        success: true,
        count: orders.length,
        orders,
      });
    } catch (error) {
      console.error(
        "❌ Get All Orders Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Server error while fetching orders.",
      });
    }
  }
);

// =========================================================
// ADMIN — UPDATE ORDER STATUS
// =========================================================

router.put(
  "/admin/:id/status",
  protect,
  admin,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!isValidObjectId(id)) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid order ID.",
        });
      }

      if (
        !ORDER_STATUSES.includes(status)
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid order status.",
        });
      }

      const order =
        await Order.findByIdAndUpdate(
          id,
          {
            status,
          },
          {
            new: true,
            runValidators: true,
          }
        )
          .populate(
            "user",
            "name email"
          )
          .populate(
            "items.product"
          );

      if (!order) {
        return res.status(404).json({
          success: false,
          message:
            "Order not found.",
        });
      }

      return res.status(200).json({
        success: true,
        message:
          "Order status updated successfully.",
        order,
      });
    } catch (error) {
      console.error(
        "❌ Update Order Status Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Server error while updating order status.",
      });
    }
  }
);

// =========================================================
// GET SINGLE ORDER
// =========================================================

router.get(
  "/:id",
  protect,
  async (req, res) => {
    try {
      const { id } = req.params;

      if (!isValidObjectId(id)) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid order ID.",
        });
      }

      const order =
        await Order.findOne({
          _id: id,
          user: req.user._id,
        }).populate(
          "items.product"
        );

      if (!order) {
        return res.status(404).json({
          success: false,
          message:
            "Order not found.",
        });
      }

      return res.status(200).json({
        success: true,
        order,
      });
    } catch (error) {
      console.error(
        "❌ Get Single Order Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Server error while fetching order.",
      });
    }
  }
);

module.exports = router;