import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('name').nullable()
      table.string('email', 254).notNullable().unique()
      table.string('password').notNullable()
      table.string('image')
      table.string('age').nullable()
      table.boolean('visible')
      table.boolean('gender')
      table.string('location')
      table.enum('disponibility', ['internship', 'apprenticeship', 'CDI', 'CDD'])
      table.enum('fields', [
        'marketing and PR',
        'admin and assistance',
        'design',
        'human ressources',
      ])
      table.enum('target', ['large company', 'start-up', 'public institution', 'SME'])

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
