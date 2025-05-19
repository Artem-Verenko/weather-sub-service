exports.up = function (knex) {
  return knex.schema.createTable("subscriptions", function (table) {
    table.increments("id").primary();
    table.string("email").notNullable().unique();
    table.string("city").notNullable();
    table.enu("frequency", ["hourly", "daily"]).notNullable();
    table.string("confirmation_token").unique();
    table.string("unsubscribe_token").notNullable().unique();
    table.boolean("is_confirmed").defaultTo(false);
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("subscriptions");
};
