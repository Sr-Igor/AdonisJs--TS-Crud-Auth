import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'taks'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('title').notNullable()
      table.dateTime("due_date").notNullable()
      table.string('description', 100).nullable()
      table.float('price').nullable()
      table.boolean("is_completed").defaultTo(false)
      table.integer('category_id').unsigned().references('id').inTable('categories')
      table.integer('user_id').unsigned().references('id').inTable('users') // #TODO Alterar para relacionamento
      table.timestamps(true,true)

    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
