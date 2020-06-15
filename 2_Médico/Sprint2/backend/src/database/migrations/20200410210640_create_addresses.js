
exports.up = function (knex) {
    return knex.schema.createTable('addresses', function (table) {
        table.increments('id').primary()
        table.integer('physicianId')
            .unsigned()
            .notNullable()
            .references('id')
            .inTable('physicians')
            .onDelete('CASCADE');
        table.string('type').notNullable()
        table.string('zipcode').notNullable()
        table.string('state', 2).notNullable()
        table.string('city').notNullable()
        table.string('district').notNullable()
        table.string('street').notNullable()
        table.string('status').notNullable()
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable('addresses')
    //return knex.schema.dropTable('addresses')
};
