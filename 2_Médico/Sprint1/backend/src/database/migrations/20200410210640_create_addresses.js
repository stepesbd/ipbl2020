
exports.up = function (knex) {
    return knex.schema.createTable('addresses', function (table) {
        table.increments('id').primary()
        table.integer('physicianId').notNullable()
        table.string('type').notNullable()
        table.string('zipcode').notNullable()
        table.string('state', 2).notNullable()
        table.string('city').notNullable()
        table.string('district').notNullable()
        table.string('street').notNullable()
        table.string('number').notNullable()
        table.foreign('physicianId').references('id').inTable('physicians')
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable('addresses')
};
