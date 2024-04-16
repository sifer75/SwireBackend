import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'jobs'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('name').notNullable()
      table.string('image')
      table.string('time')
      table.string('language')
      table.string('location')
      table.enum('disponibility', ['internship', 'apprenticeship', 'CDI', 'CDD'])
      table.enum('fields', [
        'marketing and PR',
        'admin and assistance',
        'design',
        'human ressources',
      ])
      table.enum('target', ['large company', 'start-up', 'public institution', 'SME'])
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
