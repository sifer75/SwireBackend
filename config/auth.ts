import { defineConfig } from '@adonisjs/auth'
import { InferAuthEvents, Authenticators } from '@adonisjs/auth/types'
import { sessionGuard, sessionUserProvider } from '@adonisjs/auth/session'

const authConfig = defineConfig({
  default: 'company',
  guards: {
    user: sessionGuard({
      useRememberMeTokens: true,
      provider: sessionUserProvider({
        model: () => import('#models/user'),
      }),
    }),
    company: sessionGuard({
      useRememberMeTokens: true,
      provider: sessionUserProvider({
        model: () => import('#models/company'),
      }),
    }),
  },
})

export default authConfig

/**
 * Inferring types from the configured auth
 * guards.
 */
declare module '@adonisjs/auth/types' {
  interface Authenticators extends InferAuthenticators<typeof authConfig> {}
}
declare module '@adonisjs/core/types' {
  interface EventsList extends InferAuthEvents<Authenticators> {}
}
