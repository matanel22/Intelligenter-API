/**
 * Migration to change json columns to jsonb for better compatibility
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  // Change json columns to jsonb in all tables
  await knex.schema.alterTable('domains', (table) => {
    table.jsonb('vt_data').nullable().alter();
    table.jsonb('whois_data').nullable().alter();
  });
  
  await knex.schema.alterTable('requests', (table) => {
    table.jsonb('headers').nullable().alter();
    table.jsonb('query_params').nullable().alter();
    table.jsonb('body').nullable().alter();
    table.jsonb('response_data').nullable().alter();
  });
  
  await knex.schema.alterTable('domain_analyses', (table) => {
    table.jsonb('metrics').notNullable().alter();
    table.jsonb('suggestions').notNullable().alter();
  });
};

/**
 * Rollback to json type
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.schema.alterTable('domains', (table) => {
    table.json('vt_data').nullable().alter();
    table.json('whois_data').nullable().alter();
  });
  
  await knex.schema.alterTable('requests', (table) => {
    table.json('headers').nullable().alter();
    table.json('query_params').nullable().alter();
    table.json('body').nullable().alter();
    table.json('response_data').nullable().alter();
  });
  
  await knex.schema.alterTable('domain_analyses', (table) => {
    table.json('metrics').notNullable().alter();
    table.json('suggestions').notNullable().alter();
  });
};
