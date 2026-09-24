require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();

const PORT = process.env.PORT || 5000;

// ===============================
// SECURITY MIDDLEWARE
// ===============================

app.use(helmet());

// ===============================
// CORS
// ===============================

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://oscarmbahdevhub.github.io",
    ],
    credentials: true,
  })
);

// ===============================
// BODY PARSER
// ===============================

app.use(express.json({ limit: "1mb" }));

// ===============================
// TEST / HEALTH ROUTE
// ===============================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 ShopMate Backend API is running...",
  });
});

// ===============================
// AUTH ROUTES
// ===============================

app.use("/api/auth", authRoutes);

// ===============================
// PRODUCT ROUTES
// ===============================

app.use("/api/products", productRoutes);

// ===============================
// ORDER ROUTES
// ===============================

app.use("/api/orders", orderRoutes);

// ===============================
// 404 — ROUTE NOT FOUND
// ===============================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// ===============================
// GLOBAL ERROR HANDLER
// ===============================

app.use((err, req, res, next) => {
  console.error("❌ Global Server Error:", err);

  if (res.headersSent) {
    return next(err);
  }

  res.status(err.status || 500).json({
    success: false,
    message:
      err.message ||
      "Something went wrong on the server.",
  });
});

// ===============================
// MONGODB CONNECTION
// ===============================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ Database Connection Error");
    console.error(error.message);
    process.exit(1);
  });