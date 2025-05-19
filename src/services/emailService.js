const nodemailer = require("nodemailer");
const config = require("../config");

const transporter = nodemailer.createTransport({
  host: config.email.host,
  port: config.email.port,
  auth: {
    user: config.email.user,
    pass: config.email.pass,
  },
  // secure: config.email.port === 465, // true for 465, false for other ports like 587 or 2525
});

async function sendConfirmationEmail(email, city, token) {
  const confirmationLink = `${config.appBaseUrl}/api/confirm/${token}`;
  const mailOptions = {
    from: config.email.from,
    to: email,
    subject: `Confirm your weather subscription for ${city}`,
    html: `
            <p>Hello,</p>
            <p>Thank you for subscribing to weather updates for ${city}.</p>
            <p>Please confirm your email address by clicking the link below:</p>
            <a href="${confirmationLink}">${confirmationLink}</a>
            <p>If you did not request this, please ignore this email.</p>
        `,
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log(`Confirmation email sent to ${email}`);
  } catch (error) {
    console.error(`Error sending confirmation email to ${email}:`, error);
    throw new Error("Failed to send confirmation email.");
  }
}

async function sendWeatherUpdateEmail(
  email,
  city,
  weatherData,
  unsubscribeToken
) {
  const unsubscribeLink = `${config.appBaseUrl}/api/unsubscribe/${unsubscribeToken}`;
  const mailOptions = {
    from: config.email.from,
    to: email,
    subject: `Weather Update for ${city}`,
    html: `
            <p>Hello,</p>
            <p>Here is your weather update for ${city}:</p>
            <ul>
                <li>Temperature: ${weatherData.temperature}°C</li>
                <li>Humidity: ${weatherData.humidity}%</li>
                <li>Description: ${weatherData.description}</li>
            </ul>
            <p>Don't want these emails? <a href="${unsubscribeLink}">Unsubscribe here</a>.</p>
        `,
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log(`Weather update sent to ${email} for ${city}`);
  } catch (error) {
    console.error(`Error sending weather update to ${email}:`, error);
    // Don't throw, as one failed email shouldn't stop others
  }
}

module.exports = { sendConfirmationEmail, sendWeatherUpdateEmail };
