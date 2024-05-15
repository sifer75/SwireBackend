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
  declare id: number

  @column()
  declare name: string | null

  @column()
  declare email: string

  @column()
  declare password: string

  @column()
  declare image: string | null

  @column()
  declare age: string | null

  @column()
  declare visible: boolean

  @column()
  declare location: string | null

  @column()
  declare disponibility: string[] | null

  @column()
  declare target: string[] | null

  @column()
  declare work_rhythm: string[] | null

  @column()
  declare duration: string[] | null

  @column()
  declare experience: string[] | null

  @column()
  declare fields: string[] | null

  @manyToMany(() => Job)
  declare jobs: ManyToMany<typeof Job>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
