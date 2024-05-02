import Company from '#models/company'
import type { HttpContext } from '@adonisjs/core/http'

export default class CompaniesController {
  async createCompany({ request, response }: HttpContext) {
    try {
      const data = request.only(['email', 'password'])
      const company = new Company()
      company.email = data.email
      company.password = data.password
      await company.save()

      return response.status(201).json(company)
    } catch (e) {
      return response.status(500).json({ e: 'impossible de créer la companie' })
    }
  }

  async login({ request, response, auth }: HttpContext) {
    try {
      const { email, password } = request.only(['email', 'password'])
      const company = await Company.verifyCredentials(email, password)
      console.log(company)
      if (!company) {
        return response.status(500).json({ e: 'email undefined' })
      }
      await auth.use('company').login(company)
      return response.status(200).json({ message: 'Connexion réussie', company })
    } catch (error) {
      return response.status(500).send({ message: 'impossible de se connecter', error })
    }
  }

  async logout({ request, response, auth }: HttpContext) {
    try {
      const { email, password } = request.only(['email', 'password'])
      const company = await Company.verifyCredentials(email, password)
      if (!company) {
        return response.status(500).json({ e: 'email undefined' })
      }
      await auth.use('company').logout()
      return response.status(200).json({ message: 'Déconnection réussie', company })
    } catch (error) {
      return response.status(500).send({ message: 'impossible de se déconnecter', error })
    }
  }
  async forgetPassword({ response, request }: HttpContext) {
    try {
      const company = request.only(['password1', 'password2', 'email'])
      if (company.password1 !== company.password2) {
        return response.status(400).json({ error: 'mot de passe incorrect' })
      }
      const existingCompany = await Company.findBy('email', company.email)
      if (!existingCompany) {
        return response.status(400).json({ error: 'email non trouvé' })
      }
      existingCompany.password = company.password1
      await existingCompany.save()
      return response.status(200).json({ message: 'Mot de passe modifié avec succès' })
    } catch (e) {
      return response.status(500).send({ message: 'impossible de se déconnecter', e })
    }
  }
}
