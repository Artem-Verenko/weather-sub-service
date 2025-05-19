require("dotenv").config();

module.exports = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: process.env.APP_PORT || 3000,
  weatherApiKey: process.env.WEATHER_API_KEY,
  weatherApiBaseUrl:
    process.env.WEATHER_API_BASE_URL || "http://api.weatherapi.com/v1",
  appBaseUrl:
    process.env.APP_BASE_URL || `http://localhost:${process.env.PORT || 3000}`,
  email: {
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || "2525", 10),
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
    from: process.env.EMAIL_FROM || '"Weather App" <noreply@example.com>',
  },
};

//   databaseUrl: process.env.DATABASE_URL
