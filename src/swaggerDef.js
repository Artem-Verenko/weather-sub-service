const swaggerJsdoc = require("swagger-jsdoc");
const YAML = require("yaml");
const fs = require("fs");
const path = require("path");

// Read the swagger.yaml file directly
const swaggerYaml = fs.readFileSync(
  path.resolve(__dirname, "../swagger.yaml"),
  "utf8"
);
const swaggerDefinition = YAML.parse(swaggerYaml);

const options = {
  definition: swaggerDefinition,
  apis: [
    "./src/api/routes/*.js",
    "./src/api/controllers/*.js",
    "./src/api/models/*.js",
  ], // Path to API docs
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
