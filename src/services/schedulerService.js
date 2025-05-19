const cron = require("node-cron");
const db = require("../db/knex");
const { getCurrentWeather } = require("./weatherApiService");
const { sendWeatherUpdateEmail } = require("./emailService");

async function processSubscriptions(frequency) {
  console.log(
    `Processing ${frequency} subscriptions at ${new Date().toISOString()}`
  );
  try {
    const subscriptions = await db("subscriptions").where({
      is_confirmed: true,
      frequency: frequency,
    });

    if (subscriptions.length === 0) {
      console.log(`No active ${frequency} subscriptions to process.`);
      return;
    }

    for (const sub of subscriptions) {
      try {
        const weatherData = await getCurrentWeather(sub.city);
        await sendWeatherUpdateEmail(
          sub.email,
          sub.city,
          weatherData,
          sub.unsubscribe_token
        );
      } catch (error) {
        console.error(
          `Failed to process subscription for ${sub.email} in ${sub.city}:`,
          error.message || error
        );
        // Potentially mark subscription as problematic or notify admin if errors persist
      }
    }
  } catch (dbError) {
    console.error(
      `Database error during ${frequency} subscription processing:`,
      dbError
    );
  }
}

function startSchedulers() {
  // Run hourly tasks (e.g., every hour at minute 0)
  // For testing, you might use '*/1 * * * *' (every minute)
  cron.schedule(
    "0 * * * *",
    () => {
      // Every hour at minute 0
      console.log("Running hourly weather update job...");
      processSubscriptions("hourly");
    },
    {
      timezone: "Etc/UTC", // Important for consistency
    }
  );

  // Run daily tasks (e.g., every day at 8 AM UTC)
  // For testing, you might use '*/2 * * * *' (every 2 minutes)
  cron.schedule(
    "0 8 * * *",
    () => {
      // Every day at 8:00 AM UTC
      console.log("Running daily weather update job...");
      processSubscriptions("daily");
    },
    {
      timezone: "Etc/UTC",
    }
  );

  console.log("Weather update schedulers started.");
}

module.exports = { startSchedulers };
