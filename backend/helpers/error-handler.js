function errorHandler(err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    res.status(401).json({
      success: false,
      message: "Invalid token Unauthorized",
    });
    if (err.message === "jwt expired") {
      res.status(401).json({
        success: false,
        message: "Token expired",
      });
    }
    if (err.name === "JsonWebTokenError") {
      res.status(401).json({
        success: false,
        message: "Invalid token JsonWebTokenError",
      });
    }
    if (err.name === "ValidationError") {
      res.status(401).json({
        success: false,
        message: "Validation Error Occoured",
      });
    }
  }

  return res.status(500).json(err);
}

module.exports = errorHandler;
