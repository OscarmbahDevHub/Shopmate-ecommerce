const admin = (req, res, next) => {
  // ===============================
  // CHECK AUTHENTICATED USER
  // ===============================

  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Not authorized. Please log in.",
    });
  }

  // ===============================
  // CHECK ADMIN ROLE
  // ===============================

  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admins only.",
    });
  }

  // ===============================
  // CONTINUE REQUEST
  // ===============================

  next();
};

module.exports = admin;