const express = require("express");
const weatherController = require("../controllers/weatherController");
const { validateGetWeather } = require("../middlewares/validateRequest");
const router = express.Router();

/**
 * GET endpoint for retrieving weather data for a city
 * @name GET /api/weather
 * @function
 * @param {Object} req - Express request object
 * @param {Object} req.query - Query parameters
 * @param {string} req.query.city - City name to get weather for
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} Weather data for the requested city
 */
router.get("/", validateGetWeather, weatherController.getWeather);

module.exports = router;
