import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Like extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare job_id: string

  @column()
  declare user_id: string

  @column({ columnName: 'like_status' })
  declare like_status: 'like' | 'dislike'

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
