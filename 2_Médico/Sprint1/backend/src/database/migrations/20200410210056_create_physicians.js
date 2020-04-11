
exports.up = function (knex) {
    return knex.schema.createTable('physicians', function (table) {
        table.increments('id').primary()
        table.string('name').notNullable()
        table.string('crm').notNullable()
        table.string('cpf', 11).notNullable()
    })
}

exports.down = function (knex) {
    return knex.schema.dropTable('physicians')
}
