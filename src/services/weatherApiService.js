const axios = require("axios");
const config = require("../config");

async function getCurrentWeather(city) {
  if (!config.weatherApiKey) {
    console.error("Weather API key is missing.");
    // Simulate for development if no key
    if (config.nodeEnv === "development") {
      console.warn("Simulating weather data due to missing API key.");
      return {
        temperature: Math.floor(Math.random() * 30) + 5, // temp between 5-34°C
        humidity: Math.floor(Math.random() * 70) + 30, // humidity between 30-99%
        description: `Simulated weather for ${city}`,
      };
    }
    throw new Error("Weather API key is missing.");
  }

  try {
    const response = await axios.get(
      `${config.weatherApiBaseUrl}/current.json`,
      {
        params: {
          key: config.weatherApiKey,
          q: city,
          aqi: "no", // Air Quality Index
        },
      }
    );
    const { current } = response.data;
    return {
      temperature: current.temp_c,
      humidity: current.humidity,
      description: current.condition.text,
    };
  } catch (error) {
    if (error.response && error.response.status === 400) {
      // WeatherAPI uses 400 for city not found
      const apiError = error.response.data.error;
      if (apiError && apiError.code === 1006) {
        // 1006 is their code for "No matching location found."
        throw { status: 404, message: `City not found: ${city}` };
      }
    }
    console.error("Error fetching weather:", error.message);
    throw { status: 500, message: "Failed to fetch weather data" };
  }
}

module.exports = { getCurrentWeather };
