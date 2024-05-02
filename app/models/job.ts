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
  declare time: number

  @column()
  declare salary: number

  @column()
  declare job_description: string

  @column()
  declare mission: string

  @column()
  declare competence: string

  @column()
  declare description: string

  @column()
  declare value: string

  @column()
  declare work_rhythm: ('hybrid' | 'on_site' | 'remote')[] | null

  @column()
  declare study_level: ('phd' | 'master' | 'underground' | 'highschool')[] | null

  @column()
  declare field_of_study:
    | ('design' | 'engineering' | 'business_administration' | 'marketing')[]
    | null

  @column()
  declare internship_duration: number | null

  @column()
  declare years_of_experience: ('10years' | '5-10years' | '3-5years' | '-3years')[] | null

  @column()
  declare language: string

  @column()
  declare disponibility: 'internship' | 'apprenticeship' | 'CDI' | 'CDD' | null

  @column()
  declare location: string

  @column()
  declare question: string[]

  @column()
  declare target: 'large company' | 'start-up' | 'public institution' | 'SME' | null

  @column()
  declare fields: 'marketing and PR' | 'admin and assistance' | 'design' | 'human ressources' | null

  @belongsTo(() => Company)
  declare company: BelongsTo<typeof Company>

  @manyToMany(() => User)
  declare user: ManyToMany<typeof User>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
