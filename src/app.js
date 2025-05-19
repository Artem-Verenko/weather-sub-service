const express = require("express");
const path = require("path");
const apiRoutes = require("./api/routes");
const errorHandler = require("./api/middlewares/errorHandler");
const config = require("./config");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swaggerDef");

const app = express();

// Middlewares
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
app.use(express.static(path.join(__dirname, "../public"))); // Serve static files from public directory

/**
 * Swagger UI documentation route
 * Serves API documentation based on JSDoc annotations and definitions
 */
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * API Routes with /api prefix
 * All API endpoints are mounted under this path
 */
app.use("/api", apiRoutes);

// Serve index.html for the root path
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public", "index.html"));
});

/**
 * 404 handler middleware
 * Catches routes that aren't defined and forwards to error handler
 */
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// Global error handler
app.use(errorHandler);

module.exports = app;
