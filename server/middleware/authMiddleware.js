const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    // ===============================
    // CHECK JWT SECRET
    // ===============================

    if (!process.env.JWT_SECRET) {
      console.error(
        "❌ JWT_SECRET is not configured."
      );

      return res.status(500).json({
        success: false,
        message: "Server authentication is not configured.",
      });
    }

    // ===============================
    // GET AUTHORIZATION HEADER
    // ===============================

    const authHeader = req.headers.authorization;

    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {
      return res.status(401).json({
        success: false,
        message: "Not authorized. No token provided.",
      });
    }

    // ===============================
    // EXTRACT TOKEN
    // ===============================

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized. Token missing.",
      });
    }

    // ===============================
    // VERIFY TOKEN
    // ===============================

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    if (!decoded || !decoded.id) {
      return res.status(401).json({
        success: false,
        message: "Not authorized. Invalid token.",
      });
    }

    // ===============================
    // FIND USER
    // ===============================

    const user = await User.findById(
      decoded.id
    ).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User no longer exists.",
      });
    }

    // ===============================
    // ATTACH USER TO REQUEST
    // ===============================

    req.user = user;

    // ===============================
    // CONTINUE REQUEST
    // ===============================

    next();
  } catch (error) {
    console.error(
      "❌ Auth Middleware Error:",
      error.message
    );

    return res.status(401).json({
      success: false,
      message:
        "Not authorized. Invalid or expired token.",
    });
  }
};

module.exports = protect;