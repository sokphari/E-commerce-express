const env = require("../config/env");

function errorHandler(error, req, res, next) {
  const statusCode = error.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: statusCode === 500 ? "Internal server error" : error.message,
    ...(error.errors && {
      errors: error.errors,
    }),
    ...(env.nodeEnv !== "production" && {
      error: error.message,
    }),
  });
}

module.exports = errorHandler;
