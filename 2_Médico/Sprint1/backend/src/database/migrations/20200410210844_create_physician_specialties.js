
exports.up = function (knex) {
    return knex.schema.createTable('physician_specialties', function (table) {
        table.increments('id').primary()
        table.integer('physicianId')
            .unsigned()
            .notNullable()
            .references('id')
            .inTable('physicians')
            .onDelete('CASCADE');
        table.integer('specialtiesId')
            .unsigned()
            .notNullable()
            .references('id')
            .inTable('specialties')
            .onDelete('CASCADE');
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable('physician_specialties')
};
