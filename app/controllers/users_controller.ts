import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class UsersController {
  async getAllUsers({ response }: HttpContext) {
    try {
      const data = await User.all()
      return response.status(200).json(data)
    } catch (e) {
      return response.status(500).json({ e: 'impossible de trouver les users' })
    }
  }

  async createUser({ request, response }: HttpContext) {
    try {
      const data = request.only(['email', 'password'])
      const user = new User()
      user.email = data.email
      user.password = data.password
      await user.save()
      return response.status(201).json(user)
    } catch (e) {
      return response.status(500).json({ e: 'impossible de créer le user' })
    }
  }

  async updateUser({ request, response, auth }: HttpContext) {
    try {
      if (!auth || !auth.user || !auth.user.id) {
        return response.status(400).json({ error: 'cookie non trouvé' })
      }
      const data = request.only(['name', 'age', 'visible', 'image', 'cv'])
      if (!data.image || !data.cv) {
        return response.status(400).send({ message: "Aucune image n'a été téléchargée." })
      }
      const userId = auth.user.id
      const user = await User.find(userId)
      if (!user) {
        return response.status(400).json({ error: 'Utilisateur non trouvé' })
      }
      user.name = data.name
      user.age = data.age
      user.visible = data.visible
      user.image = data.image
      user.cv = data.cv

      await user.save()

      return response.status(201).json(user)
    } catch (e) {
      return response.status(500).json({ e: 'impossible de créer le user' })
    }
  }

  async updateFields({ request, response, auth }: HttpContext) {
    try {
      if (!auth || !auth.user || !auth.user.id) {
        return response.status(400).json({ error: 'cookie non trouvé' })
      }
      const userId = auth.user.id
      const fields: string[] = request.only(['fields']).fields
      const user = await User.find(userId)
      if (!user) {
        return response.status(400).json({ error: 'Utilisateur non trouvé' })
      }
      user.fields = fields
      await user.save()
      return response.status(200).json({ user })
    } catch (e) {
      return response.status(500).json({ e: 'impossible de update le fields' })
    }
  }

  async updateTarget({ request, response, auth }: HttpContext) {
    try {
      if (!auth || !auth.user || !auth.user.id) {
        return response.status(400).json({ error: 'cookie non trouvé' })
      }
      const userId = auth.user.id
      const target: string[] = request.only(['target']).target
      const user = await User.find(userId)
      if (!user) {
        return response.status(400).json({ error: 'Utilisateur non trouvé' })
      }
      user.target = target
      await user.save()
      return response.status(200).json({ user })
    } catch (e) {
      return response.status(500).json({ e: 'impossible de update la target' })
    }
  }

  async updateDisponibility({ request, response, auth }: HttpContext) {
    try {
      if (!auth || !auth.user || !auth.user.id) {
        return response.status(400).json({ error: 'Utilisateur non trouvé' })
      }
      const userId = auth.user.id
      const disponibility: string[] = request.only(['disponibility']).disponibility
      const user = await User.find(userId)
      if (!user) {
        return response.status(400).json({ error: 'Utilisateur non trouvé' })
      }
      user.disponibility = disponibility
      await user.save()
      return response.status(200).json({ user })
    } catch (e) {
      return response.status(500).json({ e: 'impossible de update le job' })
    }
  }

  async updateRhythm({ request, response, auth }: HttpContext) {
    try {
      if (!auth || !auth.user || !auth.user.id) {
        return response.status(400).json({ error: 'Utilisateur non trouvé' })
      }
      const userId = auth.user.id
      const workRhythm: string[] = request.only(['workRhythm']).workRhythm
      const user = await User.find(userId)
      if (!user) {
        return response.status(400).json({ error: 'Utilisateur non trouvé' })
      }
      user.work_rhythm = workRhythm
      await user.save()
      return response.status(200).json({ user })
    } catch (e) {
      return response.status(500).json({ e: 'impossible de update le job' })
    }
  }

  async updateDuration({ request, response, auth }: HttpContext) {
    try {
      if (!auth || !auth.user || !auth.user.id) {
        return response.status(400).json({ error: 'Utilisateur non trouvé' })
      }
      const userId = auth.user.id
      const duration: string[] = request.only(['duration']).duration
      const user = await User.find(userId)
      if (!user) {
        return response.status(400).json({ error: 'Utilisateur non trouvé' })
      }
      user.duration = duration
      await user.save()
      return response.status(200).json({ user })
    } catch (e) {
      return response.status(500).json({ e: 'impossible de update le job' })
    }
  }

  async updateExperience({ request, response, auth }: HttpContext) {
    try {
      if (!auth || !auth.user || !auth.user.id) {
        return response.status(400).json({ error: 'Utilisateur non trouvé' })
      }
      const userId = auth.user.id
      const experience = request.only(['experience']).experience
      const user = await User.find(userId)
      if (!user) return response.status(400).json({ error: 'Utilisateur non trouvé' })
      user.experience = experience
      await user.save()
      return response.status(200).json({ user })
    } catch (e) {
      return response.status(500).json({ e: 'impossible de update le job' })
    }
  }

  async updateLocation({ request, response, auth }: HttpContext) {
    try {
      if (!auth || !auth.user || !auth.user.id) {
        return response.status(400).json({ error: 'Utilisateur non trouvé' })
      }
      const userId = auth.user.id
      const location = request.only(['location']).location
      const user = await User.find(userId)
      if (!user) {
        return response.status(400).json({ error: 'Utilisateur non trouvé' })
      }
      user.location = location
      await user.save()
      return response.status(200).json({ user })
    } catch (e) {
      return response.status(500).json({ e: 'impossible de update la location' })
    }
  }

  async store({ request, auth, response }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])
    const user = await User.verifyCredentials(email, password)
    await auth.use('user').login(user)
    response.redirect('/dashboard')
  }

  // Login avec redirection
  async redirection({ ally }: HttpContext) {
    return ally.use('linkedin').stateless().redirect()
  }

  // callback Linkedin avec
  async callbackLinkedin({ ally }: HttpContext) {
    const linkedin = ally.use('linkedin').stateless()

    if (linkedin.accessDenied()) {
      return 'You have cancelled the login process'
    }

    if (linkedin.stateMisMatch()) {
      return 'We are unable to verify the request. Please try again'
    }

    if (linkedin.hasError()) {
      return linkedin.getError()
    }

    const user = await linkedin.user()

    return user
  }

  // connection avec le système de session

  async login({ request, response, auth }: HttpContext) {
    try {
      const { email, password } = request.only(['email', 'password'])
      const user = await User.verifyCredentials(email, password)
      if (!user) {
        return response.status(500).json({ e: 'email undefined' })
      }
      await auth.use('user').login(user)
      return response.status(200).json({ message: 'Connexion réussie', user })
    } catch (error) {
      return response.status(500).send({ message: 'impossible de se connecter', error })
    }
  }

  // déconnection avec le système de session

  async logout({ auth, response }: HttpContext) {
    try {
      await auth.use('user').logout()
      return response.status(200).json('utilisateur déconnecté')
    } catch (error) {
      return response.status(500).send({ message: 'impossible de se déconnecter', error })
    }
  }

  // mot de passe oublié

  async forgetPassword({ response, request }: HttpContext) {
    try {
      const user = request.only(['password1', 'password2', 'email'])
      if (user.password1 !== user.password2) {
        return response.status(400).json({ error: 'mot de passe incorrect' })
      }
      const existingUser = await User.findBy('email', user.email)
      if (!existingUser) {
        return response.status(400).json({ error: 'email non trouvé' })
      }
      existingUser.password = user.password1
      await existingUser.save()
      return response.status(200).json({ message: 'Mot de passe modifié avec succès' })
    } catch (e) {
      return response.status(500).send({ message: 'impossible de se déconnecter', e })
    }
  }

  // trouver l'utilisateur connecté

  async findUser({ response, auth }: HttpContext) {
    try {
      if (!auth || !auth.user || !auth.user.id) {
        return response.status(400).json({ error: 'Utilisateur non trouvé' })
      }
      const userId = auth.user.id
      const user = await User.find(userId)
      if (!user) {
        return response.status(400).json({ error: 'Utilisateur non trouvé' })
      }
      return response.json(user)
    } catch (e) {
      return response.status(500).json({ e: 'utilisateur non trouvé' })
    }
  }
}
