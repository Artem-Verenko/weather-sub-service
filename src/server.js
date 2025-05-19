const app = require("./app");
const config = require("./config");
const db = require("./db/knex");
const { startSchedulers } = require("./services/schedulerService");

async function checkDatabaseConnection() {
  try {
    await db.raw("SELECT 1");
    console.log("Database connected successfully.");
    return true;
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    return false;
  }
}

async function runMigrations() {
  try {
    console.log("Running database migrations...");
    await db.migrate.latest();
    console.log("Migrations completed successfully.");
  } catch (error) {
    console.error("Failed to run migrations:", error);
    process.exit(1); // Exit if migrations fail
  }
}

async function startServer() {
  if (!(await checkDatabaseConnection())) {
    console.error("Exiting due to database connection failure.");
    process.exit(1);
  }
  await runMigrations();

  app.listen(config.port, () => {
    console.log(`Node environment: ${config.nodeEnv}`);
    console.log(`Server running on ${config.appBaseUrl}`);
    console.log(`Swagger UI available at ${config.appBaseUrl}/api-docs`);
    if (config.nodeEnv !== "test") {
      // Don't start schedulers in test environment
      startSchedulers();
    }
  });
}

// Start the server immediately when this file is executed directly
startServer();
