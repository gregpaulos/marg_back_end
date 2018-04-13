
exports.up = function(knex, Promise) {
    return knex.schema.createTable(`establishments`, table => {
        table.increments("id").primary().notNullable()
        table.string("name").notNullable()
        table.string("address").notNullable()
        table.string("phone")
        table.string("website")
        table.text("description")
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists("establishments")
};
