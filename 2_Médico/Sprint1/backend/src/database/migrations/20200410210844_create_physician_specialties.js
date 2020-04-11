
exports.up = function (knex) {
    return knex.schema.createTable('physician_specialties', function (table) {
        table.increments('id').primary()
        table.integer('physicianId').notNullable()
        table.integer('specialtiesId').notNullable()
        table.foreign('physicianId').references('id').inTable('physicians')
        table.foreign('specialtiesId').references('id').inTable('specialties')
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable('physician_specialties')
};
