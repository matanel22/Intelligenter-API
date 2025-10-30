/**
 * Example migration: Add new columns to domains table
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  // Add new columns to domains table
  await knex.schema.table('domains', (table) => {
    table.integer('reputation_score').nullable();
    table.boolean('is_malicious').defaultTo(false);
  });
};

/**
 * Rollback migration: Remove the columns added in up()
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.schema.table('domains', (table) => {
    table.dropColumn('reputation_score');
    table.dropColumn('is_malicious');
  });
};
