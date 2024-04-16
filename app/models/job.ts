import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, manyToMany } from '@adonisjs/lucid/orm'
import Company from './company.js'
import User from './user.js'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'

export default class Job extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name: string

  @column()
  declare image: string

  @column()
  declare time: string

  @column()
  declare language: string

  @column()
  declare disponibility: 'internship' | 'apprenticeship' | 'CDI' | 'CDD'

  @column()
  declare location: 'paris'

  @column()
  declare target: 'large company' | 'start-up' | 'public institution' | 'SME'

  @column()
  declare fields: 'marketing and PR' | 'admin and assistance' | 'design' | 'human ressources'

  @belongsTo(() => Company)
  declare company: BelongsTo<typeof Company>

  @manyToMany(() => User)
  declare user: ManyToMany<typeof User>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
