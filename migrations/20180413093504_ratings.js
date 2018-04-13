
exports.up = function(knex, Promise) {
    return knex.schema.createTable("ratings", table => {
        table.increments("id").primary().notNullable()
        table.foreign("establishment").references("id").inTable("establishments").notNullable()
        table.integer("rating").notNullable()
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists("ratings")
};
