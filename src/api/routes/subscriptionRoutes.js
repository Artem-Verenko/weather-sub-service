const express = require("express");
const subscriptionController = require("../controllers/subscriptionController");
const {
  validateSubscribe,
  validateToken,
} = require("../middlewares/validateRequest");
const router = express.Router();

/**
 * POST endpoint for subscribing to weather updates
 * @name POST /api/subscribe
 * @function
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body
 * @param {string} req.body.email - Email address to subscribe
 * @param {string} req.body.city - City for weather updates
 * @param {string} req.body.frequency - Frequency of updates (hourly or daily)
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
router.post("/subscribe", validateSubscribe, subscriptionController.subscribe);

/**
 * GET endpoint for confirming a subscription
 * @name GET /api/confirm/:token
 * @function
 * @param {Object} req - Express request object
 * @param {Object} req.params - URL parameters
 * @param {string} req.params.token - Confirmation token
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
router.get(
  "/confirm/:token",
  validateToken,
  subscriptionController.confirmSubscription
);

/**
 * GET endpoint for unsubscribing from weather updates
 * @name GET /api/unsubscribe/:token
 * @function
 * @param {Object} req - Express request object
 * @param {Object} req.params - URL parameters
 * @param {string} req.params.token - Unsubscribe token
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
router.get(
  "/unsubscribe/:token",
  validateToken,
  subscriptionController.unsubscribe
);

module.exports = router;
