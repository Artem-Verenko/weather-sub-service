const Joi = require("joi");

/**
 * Validation schema for subscription request
 * @type {Joi.ObjectSchema}
 */
const subscribeSchema = Joi.object({
  email: Joi.string().email().required(),
  city: Joi.string().min(2).max(100).required(),
  frequency: Joi.string().valid("hourly", "daily").required(),
});

/**
 * Middleware to validate subscription requests
 * @function
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void}
 */
const validateSubscribe = (req, res, next) => {
  const { error } = subscribeSchema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json({ message: "Invalid input", details: error.details[0].message });
  }
  next();
};

/**
 * Validation schema for weather request
 * @type {Joi.ObjectSchema}
 */
const getWeatherSchema = Joi.object({
  city: Joi.string().min(2).max(100).required(),
});

/**
 * Middleware to validate weather requests
 * @function
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void}
 */
const validateGetWeather = (req, res, next) => {
  const { error } = getWeatherSchema.validate(req.query);
  if (error) {
    return res
      .status(400)
      .json({ message: "Invalid request", details: error.details[0].message });
  }
  next();
};

/**
 * Middleware to validate token parameter
 * @function
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void}
 */
const validateToken = (req, res, next) => {
  const { token } = req.params;
  if (!token) {
    return res
      .status(400)
      .json({ message: "Invalid token: Token is required." });
  }
  next();
};

module.exports = { validateSubscribe, validateGetWeather, validateToken };
