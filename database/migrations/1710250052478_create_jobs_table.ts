import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'jobs'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('name').notNullable()
      table.string('language')
      table.text('image_font', 'longtext')
      table.string('location')

      table.specificType('disponibility', 'text[]')
      table.specificType('fields', 'text[]')
      table.specificType('work_rhythm', 'text[]')
      table.specificType('study_level', 'text[]')
      table.specificType('field_of_study', 'text[]')
      table.specificType('experience', 'text[]')
      table.specificType('duration', 'text[]')
      table.specificType('target', 'text[]')
      table.specificType('question', 'text[]')

      table.text('salary').nullable()
      table.string('job_description').nullable()
      table.string('mission').nullable()
      table.string('competence').nullable()
      table.string('description').nullable()
      table.string('value').nullable()
      table.integer('company_id').references('id').inTable('companies')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
