import { DateTime } from 'luxon'
import { withAuthFinder } from '@adonisjs/auth'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import Job from './job.js'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name: string

  @column()
  declare email: string

  @column()
  declare password: string

  @column()
  declare image: string

  @column()
  declare age: string

  @column()
  declare visible: boolean

  @column()
  declare disponibility: 'internship' | 'apprenticeship' | 'CDI' | 'CDD'

  @column()
  declare location: 'paris'

  @column()
  declare target: 'large company' | 'start-up' | 'public institution' | 'SME'

  @column()
  declare fields: 'marketing and PR' | 'admin and assistance' | 'design' | 'human ressources'

  @manyToMany(() => Job)
  declare Jobs: ManyToMany<typeof Job>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
