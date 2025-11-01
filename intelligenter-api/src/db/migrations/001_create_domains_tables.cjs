/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable("domains", (table) => {
    table.increments("id").primary();
    table.string("domain", 255).notNullable().unique();
    table.enum("status", ["onAnalysis", "ready"]).defaultTo("onAnalysis");
    table.json("vt_data").nullable();
    table.json("whois_data").nullable();
    table.timestamp("last_updated").nullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());

    table.index(["status"]);
    table.index(["domain"]);
    table.index(["created_at"]);
    table.index(["last_updated"]);
  });

  await knex.schema.createTable("requests", (table) => {
    table.increments("id").primary();
    table.string("method", 10).notNullable();
    table.string("endpoint", 255).notNullable();
    table.json("headers").nullable();
    table.json("query_params").nullable();
    table.json("body").nullable();
    table.string("ip_address", 45).nullable();
    table.string("user_agent", 500).nullable();
    table.integer("status_code").nullable();
    table.json("response_data").nullable();
    table.integer("response_time_ms").nullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());

    table.index(["method"]);
    table.index(["endpoint"]);
    table.index(["status_code"]);
    table.index(["created_at"]);
    table.index(["ip_address"]);
  });

  await knex.schema.createTable("domain_analyses", (table) => {
    table.increments("id").primary();
    table.integer("domain_id").unsigned().notNullable();
    table.integer("score").notNullable();
    table.json("metrics").notNullable();
    table.json("suggestions").notNullable();
    table.timestamp("analyzed_at").defaultTo(knex.fn.now());

    table
      .foreign("domain_id")
      .references("id")
      .inTable("domains")
      .onDelete("CASCADE");

    table.index(["domain_id"]);
    table.index(["analyzed_at"]);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("domain_analyses");
  await knex.schema.dropTableIfExists("requests");
  await knex.schema.dropTableIfExists("domains");
};
