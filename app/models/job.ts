import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, manyToMany, hasMany } from '@adonisjs/lucid/orm'
import Company from './company.js'
import User from './user.js'
import type { BelongsTo, ManyToMany, HasMany } from '@adonisjs/lucid/types/relations'
import Like from './like.js'

export default class Job extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name: string

  @column()
  declare language: string

  @column()
  declare image_font: string

  @column()
  declare location: string

  @column()
  declare time: number

  @column()
  declare salary: number | null

  @column()
  declare job_description: string | null

  @column()
  declare mission: string | null

  @column()
  declare competence: string | null

  @column()
  declare description: string | null

  @column()
  declare value: string | null

  @column()
  declare work_rhythm: string[]

  @column()
  declare study_level: string[]

  @column()
  declare field_of_study: string[]

  @column()
  declare duration: string[]

  @column()
  declare experience: string[]

  @column()
  declare disponibility: string[]

  @column()
  declare question: string[]

  @column()
  declare target: string[]

  @column()
  declare fields: string[]

  @belongsTo(() => Company)
  declare company: BelongsTo<typeof Company>

  @column()
  declare companyId: number

  @manyToMany(() => User)
  declare user: ManyToMany<typeof User>

  @hasMany(() => Like, { foreignKey: 'job_id' })
  declare likes: HasMany<typeof Like>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
