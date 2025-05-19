const express = require("express");
const weatherRoutes = require("./weatherRoutes");
const subscriptionRoutes = require("./subscriptionRoutes");

const router = express.Router();

/**
 * Weather routes for getting weather data
 * @name /api/weather routes
 */
router.use("/weather", weatherRoutes);

/**
 * Subscription routes for managing subscriptions
 * @name /api/* subscription routes
 */
router.use("/", subscriptionRoutes);

/**
 * Health check endpoint for monitoring
 * @name GET /api/health
 * @function
 * @returns {Object} Status object with "UP" status
 */
router.get("/health", (req, res) => res.status(200).json({ status: "UP" }));

module.exports = router;
