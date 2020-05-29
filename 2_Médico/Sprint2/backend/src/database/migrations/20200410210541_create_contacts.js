
exports.up = function (knex) {
    return knex.schema.createTable('contacts', function (table) {
        table.increments('id').primary()
        table.integer('physicianId')
            .unsigned()
            .notNullable()
            .references('id')
            .inTable('physicians')
            .onDelete('CASCADE');
        table.string('type').notNullable()
        table.string('contact').notNullable()
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable('contacts')
};
