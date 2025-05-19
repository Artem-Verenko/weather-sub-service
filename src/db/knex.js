const knex = require("knex");
const knexConfig = require("../../knexfile");
const config = require("../config");

// Detect environment from NODE_ENV or default to development
const environment = config.nodeEnv || "development";

// Use the test environment configuration from knexfile when running tests,
// fallback to development if test environment is not defined
const configToUse = knexConfig[environment] || knexConfig.development;

const db = knex(configToUse);

// Test the connection
db.raw("SELECT 1")
  .then(() => {
    console.log(
      `PostgreSQL connected successfully using Knex for ${environment} environment.`
    );
  })
  .catch((e) => {
    console.error(
      `Failed to connect to PostgreSQL using Knex for ${environment} environment:`,
      e
    );
    // process.exit(1); // Optionally exit if DB connection is critical at startup
  });

module.exports = db;
