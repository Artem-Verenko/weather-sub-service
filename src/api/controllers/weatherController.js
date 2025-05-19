const weatherApiService = require("../../services/weatherApiService");

/**
 * @swagger
 * /weather:
 *   get:
 *     tags:
 *       - weather
 *     summary: Get current weather for a city
 *     description: Returns the current weather forecast for the specified city using WeatherAPI.com.
 *     operationId: getWeather
 *     parameters:
 *       - name: city
 *         in: query
 *         description: City name for weather forecast
 *         required: true
 *         type: string
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Successful operation - current weather forecast returned
 *         schema:
 *           type: object
 *           properties:
 *             temperature:
 *               type: number
 *               description: Current temperature
 *             humidity:
 *               type: number
 *               description: Current humidity percentage
 *             description:
 *               type: string
 *               description: Weather description
 *       400:
 *         description: Invalid request
 *       404:
 *         description: City not found
 */
async function getWeather(req, res, next) {
  const { city } = req.query;
  try {
    const weatherData = await weatherApiService.getCurrentWeather(city);
    res.status(200).json(weatherData);
  } catch (error) {
    // Pass custom error objects to the error handler
    if (error.status) {
      return next(error);
    }
    // For unexpected errors
    next({
      status: 500,
      message: "An unexpected error occurred while fetching weather.",
    });
  }
}

module.exports = { getWeather };
