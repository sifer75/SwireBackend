import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import User from './user.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Job from './job.js'

export default class Like extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare job_id: number

  @column()
  declare user_id: number

  @column({ columnName: 'review_status' })
  declare review_status: 'accepted' | 'pending' | 'refused'

  @column({ columnName: 'like_status' })
  declare like_status: 'like' | 'dislike'

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @belongsTo(() => User, {
    foreignKey: 'user_id',
  })
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Job)
  declare job: BelongsTo<typeof Job>

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
