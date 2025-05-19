const config = require("../../config");

/**
 * Global error handler middleware for Express
 * @function
 * @param {Error} err - The error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void}
 */
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  console.error("Error caught by handler: ", err.message, err.stack);

  const statusCode = err.status || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    status: "error",
    statusCode,
    message,
    ...(config.nodeEnv === "development" && { stack: err.stack }), // Show stack in dev
  });
}

module.exports = errorHandler;
