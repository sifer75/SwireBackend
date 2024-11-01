import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'likes'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('job_id').unsigned().notNullable()
      table.integer('user_id').unsigned().notNullable()
      table.enum('review_status', ['accepted', 'pending', 'refused']).defaultTo('pending')
      table.enum('like_status', ['like', 'dislike']).notNullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
