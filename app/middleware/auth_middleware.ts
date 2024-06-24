import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import type { Authenticators } from '@adonisjs/auth/types'

/**
 * Auth middleware is used authenticate HTTP requests and deny
 * access to unauthenticated users.
 */

export default class AuthMiddleware {
  /**
   * The URL to redirect to, when authentication fails
   */
  async handle(
    ctx: HttpContext,
    next: NextFn,
    options: {
      guards?: (keyof Authenticators)[]
    } = {}
  ) {
    const redirectTo = options.guards?.includes('company') ? '/company/login' : '/user/login'
    try {
      await ctx.auth.authenticateUsing(options.guards, { loginRoute: redirectTo })
    } catch (e) {
      ctx.response.redirect(redirectTo)
    }
    return next()
  }
}
