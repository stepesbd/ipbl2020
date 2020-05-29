
exports.up = function (knex) {
    return knex.schema.createTable('specialties', function (table) {
        table.increments('id').primary()
        table.string('name').notNullable()
        table.boolean('status').notNullable().defaultTo(true)
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable('specialties')
};
