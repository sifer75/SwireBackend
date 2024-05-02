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
      table.enum('disponibility', ['internship', 'apprenticeship', 'CDI', 'CDD']).nullable()
      table
        .enum('fields', ['marketing and PR', 'admin and assistance', 'design', 'human ressources'])
        .nullable()
      table.specificType('work_rhythm', 'text[]').nullable()
      table.specificType('study_level', 'text[]').nullable()
      table.specificType('field_of_study', 'text[]').nullable()
      table.specificType('years_of_experience', 'text[]').nullable()
      table.specificType('internship_duration', 'text[]').nullable()
      table.string('salary'),
        table.specificType('question', 'text[]').nullable(),
        table.enum('target', ['large company', 'start-up', 'public institution', 'SME']).nullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
      table.string('job_description').nullable()
      table.string('mission').nullable()
      table.string('competence').nullable()
      table.string('description').nullable()
      table.string('value').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
