require("dotenv").config({ path: "./.env" });

// Default PostgreSQL connection values
const defaultConfig = {
  client: process.env.DB_CLIENT || "pg",
  connection: {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432", 10),
    user: process.env.DB_USER || "myuser",
    password: process.env.DB_PASSWORD || "mypassword",
    database: process.env.DB_NAME || "mydatabase",
  },
  migrations: {
    directory: "./src/db/migrations",
  },
  seeds: {
    directory: "./src/seeds",
  },
};

module.exports = {
  development: {
    ...defaultConfig,
  },

  test: {
    ...defaultConfig,
    connection: {
      ...defaultConfig.connection,
      database: process.env.TEST_DB_NAME || process.env.DB_NAME || "mydatabase",
    },
  },
  production: {
    ...defaultConfig,
    connection: {
      ...defaultConfig.connection,
      // Disable SSL for local Docker environment
      // If deploying to a service that requires SSL (like Heroku), uncomment the line below
      // ssl: { rejectUnauthorized: false },
    },
    pool: {
      // Example production pool settings
      min: 2,
      max: 10,
    },
  },
};
