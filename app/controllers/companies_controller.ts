import Company from '#models/company'
import Job from '#models/job'
import User from '#models/user'
import { HttpContext } from '@adonisjs/core/http'

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

  async updateCompany({ request, response, auth }: HttpContext) {
    try {
      if (!auth || !auth.user || !auth.user.id) {
        return response.status(400).json({ e: 'impossible de trouver la companie' })
      }
      const data = request.only(['name', 'image'])
      if (!data.image || !data.name) {
        return response.status(400).json({ error: "Aucune image n'a été téléchargée." })
      }

      const companyId = auth.user.id
      const company = await Company.find(companyId)
      if (!company) {
        return response.status(400).json({ error: 'Companie non trouvée' })
      }
      company.name = data.name
      company.image = data.image

      await company.save()

      return response.status(201).json(company)
    } catch (e) {
      return response.status(201).json({ e: 'impossible de modifier la companie' })
    }
  }

  async findCompany({ response, auth }: HttpContext) {
    try {
      if (!auth || !auth.user || !auth.user.id) {
        return response.status(400).json({ error: 'Company non trouvée' })
      }
      const companyId = auth.user.id
      const company = await Company.find(companyId)
      if (!company) {
        return response.status(400).json({ error: 'company non trouvée' })
      }
      return response.json(company)
    } catch (e) {
      return response.status(500).json({ e: 'impossible de trouver le job loggé' })
    }
  }

  async login({ request, response, auth }: HttpContext) {
    try {
      const { email, password } = request.only(['email', 'password'])
      const company = await Company.verifyCredentials(email, password)
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

  async getNumberOfUserWhoLikedJob({ auth, response }: HttpContext) {
    try {
      if (!auth || !auth.user || !auth.user.id) {
        return response.status(400).json({ error: 'cookie non trouvé' })
      }
      const companyId = auth.user.id
      const company = await Company.find(companyId)
      if (!company) {
        return response.status(400).json({ error: 'Companie non trouvé' })
      }
      await company.load('jobs', (query) => {
        query.preload('likes', (likeQuery: any) => {
          likeQuery.where('like_status', 'like').preload('user')
        })
      })

      const jobsFromCompany = company.jobs
      const usersWhoLikedJobs = jobsFromCompany.reduce((users, job) => {
        job.likes.forEach((like) => {
          const user = like.user
          users.push(user)
        })
        return users
      }, [] as any)
      const isEmptyArray =
        usersWhoLikedJobs.length === 1 &&
        Array.isArray(usersWhoLikedJobs[0]) &&
        usersWhoLikedJobs[0].length === 0

      const userNumber = isEmptyArray ? 0 : usersWhoLikedJobs.length

      return response.status(200).json({ userNumber })
    } catch (e) {
      return response
        .status(500)
        .send({ message: 'impossible de trouver le nombre de users qui ont liké le job', e })
    }
  }

  async getUserWhoLikedJob({ params, auth, response }: HttpContext) {
    try {
      const jobId = await params.id
      if (!auth || !auth.user || !auth.user.id) {
        return response.status(400).json({ error: 'cookie non trouvé' })
      }
      const companyId = auth.user.id
      const company = await Company.find(companyId)
      if (!company) {
        return response.status(400).json({ error: 'Companie non trouvé' })
      }
      // --- Verifie que le job appartient à la companie

      const job = await Job.find(jobId)
      if (!job) {
        return response.status(400).json({ error: 'Job non trouvé' })
      }
      await job.load('likes', (query) => {
        query.where('like_status', 'like').preload('user')
      })
      const likes = job.likes
      const users = await Promise.all(likes.map((like: any) => like.user))
      if (!users) {
        return response.status(200).json({ usersWhoLikedJobs: null })
      }
      return response.status(200).json({ usersWhoLikedJobs: users })
    } catch (e) {
      return response
        .status(500)
        .send({ message: 'impossible de trouver le user qui a liké le job', e })
    }
  }

  async findUserWithId({ params, response }: HttpContext) {
    try {
      const userId = params.id
      const user = await User.find(userId)
      const userTab = [user]

      return response.status(201).json(userTab)
    } catch (e) {
      return response
        .status(500)
        .send({ message: 'impossible de trouver le user qui a liké le job', e })
    }
  }
}
