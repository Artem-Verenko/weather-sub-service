const db = require("../../db/knex");
const { v4: uuidv4 } = require("uuid");
const emailService = require("../../services/emailService");

/**
 * @swagger
 * /subscribe:
 *   post:
 *     tags:
 *       - subscription
 *     summary: Subscribe to weather updates
 *     description: Subscribe an email to receive weather updates for a specific city with chosen frequency.
 *     operationId: subscribe
 *     consumes:
 *       - application/json
 *       - application/x-www-form-urlencoded
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: email
 *         in: formData
 *         description: Email address to subscribe
 *         required: true
 *         type: string
 *       - name: city
 *         in: formData
 *         description: City for weather updates
 *         required: true
 *         type: string
 *       - name: frequency
 *         in: formData
 *         description: Frequency of updates (hourly or daily)
 *         required: true
 *         type: string
 *         enum: [hourly, daily]
 *     responses:
 *       200:
 *         description: Subscription successful. Confirmation email sent.
 *       400:
 *         description: Invalid input
 *       409:
 *         description: Email already subscribed
 */
async function subscribe(req, res, next) {
  const { email, city, frequency } = req.body;

  try {
    const existingSubscription = await db("subscriptions")
      .where({ email: email })
      .first();
    if (existingSubscription) {
      if (existingSubscription.is_confirmed) {
        return res
          .status(409)
          .json({ message: "Email already subscribed and confirmed." });
      } else {
        // Resend confirmation for an unconfirmed existing subscription
        // Or just return 409. For simplicity, let's be strict.
        return res.status(409).json({
          message: "Email already registered, awaiting confirmation.",
        });
      }
    }

    const confirmationToken = uuidv4();
    const unsubscribeToken = uuidv4(); // Generate unsubscribe token upfront

    await db("subscriptions").insert({
      email,
      city,
      frequency,
      confirmation_token: confirmationToken,
      unsubscribe_token: unsubscribeToken,
      is_confirmed: false,
    });

    await emailService.sendConfirmationEmail(email, city, confirmationToken);

    res
      .status(200)
      .json({ message: "Subscription successful. Confirmation email sent." });
  } catch (error) {
    if (error.message.includes("Failed to send confirmation email")) {
      // Rollback DB insert if email fails? Or let it be and allow manual confirmation?
      // For now, let's inform the user but keep the DB record.
      console.error("Subscription DB entry created, but email failed:", error);
      return res.status(500).json({
        message:
          "Subscription recorded, but failed to send confirmation email. Please try confirming later or contact support.",
      });
    }
    next(error); // Pass to generic error handler
  }
}

/**
 * @swagger
 * /confirm/{token}:
 *   get:
 *     tags:
 *       - subscription
 *     summary: Confirm email subscription
 *     description: Confirms a subscription using the token sent in the confirmation email.
 *     operationId: confirmSubscription
 *     parameters:
 *       - name: token
 *         in: path
 *         type: string
 *         required: true
 *         description: Confirmation token
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Subscription confirmed successfully
 *       400:
 *         description: Invalid token
 *       404:
 *         description: Token not found
 */
async function confirmSubscription(req, res, next) {
  const { token } = req.params;

  try {
    const subscription = await db("subscriptions")
      .where({ confirmation_token: token })
      .first();

    if (!subscription) {
      return res
        .status(404)
        .json({ message: "Token not found or already used." });
    }

    if (subscription.is_confirmed) {
      return res
        .status(200)
        .json({ message: "Subscription already confirmed." });
    }

    // Update subscription: mark as confirmed and clear confirmation_token
    await db("subscriptions").where({ id: subscription.id }).update({
      is_confirmed: true,
      confirmation_token: null, // Invalidate token after use
      updated_at: db.fn.now(),
    });

    res.status(200).json({ message: "Subscription confirmed successfully." });
  } catch (error) {
    next(error);
  }
}

/**
 * @swagger
 * /unsubscribe/{token}:
 *   get:
 *     tags:
 *       - subscription
 *     summary: Unsubscribe from weather updates
 *     description: Unsubscribes an email from weather updates using the token sent in emails.
 *     operationId: unsubscribe
 *     parameters:
 *       - name: token
 *         in: path
 *         type: string
 *         required: true
 *         description: Unsubscribe token
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Unsubscribed successfully
 *       400:
 *         description: Invalid token
 *       404:
 *         description: Token not found
 */
async function unsubscribe(req, res, next) {
  const { token } = req.params;

  try {
    const result = await db("subscriptions")
      .where({ unsubscribe_token: token })
      .del(); // Delete the subscription

    if (result === 0) {
      return res
        .status(404)
        .json({ message: "Token not found or subscription already removed." });
    }

    res.status(200).json({ message: "Unsubscribed successfully." });
  } catch (error) {
    next(error);
  }
}

module.exports = { subscribe, confirmSubscription, unsubscribe };
