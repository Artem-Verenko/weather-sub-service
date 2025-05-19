/**
 * @swagger
 * definitions:
 *   Weather:
 *     type: "object"
 *     properties:
 *       temperature:
 *         type: "number"
 *         description: "Current temperature"
 *       humidity:
 *         type: "number"
 *         description: "Current humidity percentage"
 *       description:
 *         type: "string"
 *         description: "Weather description"
 *   Subscription:
 *     type: "object"
 *     required:
 *       - "email"
 *       - "city"
 *       - "frequency"
 *     properties:
 *       email:
 *         type: "string"
 *         description: "Email address"
 *       city:
 *         type: "string"
 *         description: "City for weather updates"
 *       frequency:
 *         type: "string"
 *         description: "Frequency of updates"
 *         enum: ["hourly", "daily"]
 *       confirmed:
 *         type: "boolean"
 *         description: "Whether the subscription is confirmed"
 */
