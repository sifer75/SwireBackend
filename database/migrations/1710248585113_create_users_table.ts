import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('name').nullable()
      table.string('email', 254).notNullable().unique()
      table.string('password').notNullable()
      table.text('image', 'longtext')
      table.string('age').nullable()
      table.boolean('visible')
      table.string('location').nullable()

      table.specificType('disponibility', 'text[]').nullable()
      table.specificType('fields', 'text[]').nullable()
      table.specificType('target', 'text[]').nullable()
      table.specificType('work_rhythm', 'text[]').nullable()
      table.specificType('duration', 'text[]').nullable()
      table.specificType('experience', 'text[]').nullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
