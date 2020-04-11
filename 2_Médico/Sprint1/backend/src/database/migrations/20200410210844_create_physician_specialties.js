
exports.up = function (knex) {
    return knex.schema.createTable('physician_specialties', function (table) {
        table.increment('id').primary()
        table.integer('physicianId').unsigned().notNullable()
        table.integer('specialtiesId').unsigned().notNullable()
        table.foreign('physicianId').references('id').inTable('physicians')
        table.foreign('specialtiesId').references('id').inTable('specialties')
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable('physician_specialties')
};
