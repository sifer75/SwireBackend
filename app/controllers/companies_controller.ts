import Company from '#models/company'
import type { HttpContext } from '@adonisjs/core/http'

export default class CompaniesController {
  async index({ response }: HttpContext) {
    try {
      const data = await Company.all()
      return response.status(200).json(data)
    } catch (e) {
      return response.status(500).json({ e: 'impossible de trouver les users' })
    }
  }
}
