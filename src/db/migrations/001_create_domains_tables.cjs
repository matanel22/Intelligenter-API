/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {

  await knex.schema.createTable("domains", (table) => {
    table.increments("id").primary();
    table.string("domain", 255).notNullable().unique();
    table.enum("status", ["onAnalysis", "ready"]).defaultTo("onAnalysis");

    
    table.jsonb("vt_data").nullable();
    table.jsonb("whois_data").nullable();

    table.integer("reputation_score").nullable();
    table.boolean("is_malicious").defaultTo(false);

    table.timestamp("last_updated").defaultTo(knex.fn.now());
    table.timestamp("created_at").defaultTo(knex.fn.now());

    table.index(["status"]);
    table.index(["created_at"]);
    table.index(["last_updated"]);
  });


  await knex.schema.createTable("domain_analyses", (table) => {
    table.increments("id").primary();
    table.integer("domain_id").unsigned().notNullable();
    table.integer("score").notNullable();

    table.jsonb("metrics").notNullable();
    table.jsonb("suggestions").notNullable();

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
  await knex.schema.dropTableIfExists("domains");
};
