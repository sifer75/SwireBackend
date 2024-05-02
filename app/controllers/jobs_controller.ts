import Company from '#models/company'
import Job from '#models/job'
import Like from '#models/like'
import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export default class JobsController {
  // creer un job

  async createJobPreferences({ request, response }: HttpContext) {
    try {
      // if (!auth || !auth.user || !auth.user.id) {
      //   return response.status(400).json({ error: 'cookie non trouvé' })
      // }
      // const userId = auth.user.id
      // console.log(userId)

      const {
        name,
        time,
        salary,
        location,
        workRhythm,
      }: {
        name: string
        time: number
        salary: number
        location: string
        workRhythm: ('hybrid' | 'on_site' | 'remote')[] | null
      } = request.only(['name', 'time', 'salary', 'location', 'workRhythm'])

      const job = new Job()
      job.name = name
      job.time = time
      job.salary = salary
      job.location = location
      job.work_rhythm = workRhythm
      await job.save()
      return response.status(201).json(job)
    } catch (error) {
      console.log(error)
      return response.status(500).send({ message: 'impossible de créer le job', error })
    }
  }

  async updateJobDescription({ params, request, response }: HttpContext) {
    try {
      const { jobDescription, mission, competence, description, value } = request.only([
        'jobDescription',
        'mission',
        'competence',
        'description',
        'value',
      ])

      const jobId = await params.id
      const job = await Job.findOrFail(jobId)
      job.job_description = jobDescription
      job.mission = mission
      job.competence = competence
      job.description = description
      job.value = value
      await job.save()

      return response.status(201).json(job)
    } catch (error) {
      return response.status(500).json({ error: 'Impossible de créer la description du job' })
    }
  }

  async updateMatch({ params, request, response }: HttpContext) {
    try {
      const { studyLevel, fieldOfStudy, internshipDuration, yearsOfExperience } = request.only([
        'studyLevel',
        'yearsOfExperience',
        'internshipDuration',
        'fieldOfStudy',
      ])

      const jobId = await params.id
      // console.log(params, 'dddddd')
      // console.log(studyLevel, fieldOfStudy, internshipDuration, yearsOfExperience)

      const job = await Job.findOrFail(jobId)
      if (!job) {
        return response.status(404).json({ error: 'Job not found' })
      }
      job.study_level = studyLevel
      job.field_of_study = fieldOfStudy
      job.internship_duration = internshipDuration
      job.years_of_experience = yearsOfExperience
      await job.save()

      return response.status(201).json(job)
    } catch (error) {
      console.log(error)
      return response.status(500).json({ error: 'Impossible de créer les critères du job' })
    }
  }

  async createQuestion({ params, request, response }: HttpContext) {
    try {
      const { question } = request.only(['question'])
      const jobId = await params.id
      const job = await Job.findOrFail(jobId)
      if (!job) {
        return response.status(404).json({ error: 'Job not found' })
      }
      let questionArray: string[] = job.question || []
      questionArray.push(question)
      job.question = questionArray
      await job.save()
      return response.status(201).json(job)
    } catch (error) {
      console.log(error)
      return response.status(500).json({ error: 'Impossible de créer les questions du job' })
    }
  }

  async getQuestion({ params, response }: HttpContext) {
    try {
      const jobId = await params.id
      const job = await Job.findOrFail(jobId)
      if (!job) {
        return response.status(404).json({ error: 'Job not found' })
      }

      const questions = job.question || []

      return response.status(201).json(questions)
    } catch (error) {
      console.log(error)
      return response.status(500).json({ error: 'Impossible de créer les questions du job' })
    }
  }

  // supprimer un job

  async getJob({ auth, response }: HttpContext) {
    try {
      if (!auth || !auth.user || auth.user.id) {
        return response.status(400).json({ error: 'cookie non trouvé' })
      }
      const companyId = auth.user.id
      const company = await Company.find(companyId)
      console.log(companyId, company)
      if (!company) {
        return response.status(400).json({ error: 'Companie non trouvé' })
      }
      const jobs = await company.related('jobs').query().fetch()

      const jobNumber = jobs.length || 0
      return response.status(200).json(jobNumber)
    } catch (e) {
      return response.json({ e: "impossible de supprimer l'offre" })
    }
  }

  async updateUser({ request, response, auth }: HttpContext) {
    try {
      if (!auth || !auth.user || !auth.user.id) {
        return response.status(400).json({ error: 'cookie non trouvé' })
      }
      const data = request.only(['name', 'age', 'visible'])
      const userId = auth.user.id
      const user = await User.find(userId)
      if (!user) {
        return response.status(400).json({ error: 'Utilisateur non trouvé' })
      }
      user.name = data.name
      user.age = data.age
      user.visible = data.visible

      await user.save()
      return response.status(201).json(user)
    } catch (e) {
      return response.status(500).json({ e: 'impossible de créer le user' })
    }
  }
  async deleteJob({ params, response }: HttpContext) {
    try {
      const jobId = await params.id
      if (!jobId) {
        return response.status(500).json({
          e: 'jobs de la companie non trouvé',
        })
      }
      const job = await Job.findOrFail(jobId)
      await job.delete()
      return response.status(200).json(job)
    } catch (e) {
      return response.json({ e: "impossible de supprimer l'offre" })
    }
  }

  // obtenir tous les jobs ou les jobs sont égal à au moins 1 preferences enregistré sur l'obj user
  // filtrer les jobs en fonction du pourcentage de coincidence des preferences

  async filterJobsByUserPreference({ response, auth }: HttpContext) {
    try {
      const user = auth.user
      if (!user) {
        return response.status(500).json({
          e: "impossible de filtrer les jobs à partir des attentes de l'utilisateur",
        })
      }
      const preferencesUser = await User.findOrFail(user.id)
      const likedOrDislikedJobs = await Like.all()
      const idJobs = likedOrDislikedJobs.map((job) => job.job_id)
      const formattedArray = idJobs.length > 0 ? `('${idJobs.join("', '")}')` : '(NULL)'

      // faire en sorte que l'id dans idJobs ne soit pas dans la sélection des jobs
      const jobfiltered: any = await db.rawQuery(`
      SELECT 
      jobs.*,  
      ( 
          (
              (CASE WHEN jobs.location = '${preferencesUser.location}' THEN 1 ELSE 0 END) +
              (CASE WHEN jobs.fields = '${preferencesUser.fields}' THEN 1 ELSE 0 END) +
              (CASE WHEN jobs.disponibility = '${preferencesUser.disponibility}' THEN 1 ELSE 0 END) +
              (CASE WHEN jobs.target = '${preferencesUser.target}' THEN 1 ELSE 0 END)
          ) / 4.0 * 100
      ) AS percentage
  FROM 
      jobs 
  JOIN 
      users ON jobs.location = '${preferencesUser.location}'
          OR jobs.fields = '${preferencesUser.fields}'
          OR jobs.disponibility = '${preferencesUser.disponibility}'
          OR jobs.target = '${preferencesUser.target}'
  WHERE 
      ( ${formattedArray} IS NULL OR jobs.id NOT IN ${formattedArray}) AND
      (
          (
              (CASE WHEN jobs.location = '${preferencesUser.location}' THEN 1 ELSE 0 END) +
              (CASE WHEN jobs.fields = '${preferencesUser.fields}' THEN 1 ELSE 0 END) +
              (CASE WHEN jobs.disponibility = '${preferencesUser.disponibility}' THEN 1 ELSE 0 END) +
              (CASE WHEN jobs.target = '${preferencesUser.target}' THEN 1 ELSE 0 END)
          ) / 4.0 * 100
      ) > 0
  ORDER BY 
      percentage DESC;
      `)
      return response.status(200).json(jobfiltered.rows)
    } catch (e) {
      return response.status(500).json({
        e: "impossible de filtrer les jobs à partir des attentes de l'utilisateur",
      })
    }
  }

  // liker un job

  async likeJob({ params, response, auth }: HttpContext) {
    try {
      const jobId = params.id
      const job = await Job.findOrFail(jobId)
      const user = auth.user

      if (!job) {
        return response.badRequest({ message: "le job n'existe pas" })
      }

      if (!user) {
        return response.status(500).json({
          e: "impossible de filtrer les jobs à partir des attentes de l'utilisateur",
        })
      } else {
        const isLiked = await Like.query()
          .where('job_id', jobId)
          .andWhere('user_id', user.id)
          .first()

        if (isLiked) {
          return response.badRequest({ message: 'tu as déjà like ce job' })
        }
      }
      const like = new Like()
      like.job_id = jobId
      like.user_id = user.id
      like.like_status = 'like'

      await like.save()
      return response.status(200).json({ message: 'job liké' })
    } catch (e) {
      return response.status(500).json({ e: 'impossible de liker le job' })
    }
  }

  // disliker un job

  async dislikeJob({ params, response, auth }: HttpContext) {
    try {
      const jobId = params.id
      const job = await Job.findOrFail(jobId)
      const user = auth.user

      if (!job) {
        return response.badRequest({ message: "le job n'existe pas" })
      }

      if (!user) {
        return response.status(500).json({
          e: "impossible de filtrer les jobs à partir des attentes de l'utilisateur",
        })
      } else {
        const isDisliked = await Like.query()
          .where('job_id', jobId)
          .andWhere('user_id', user.id)
          .first()

        if (isDisliked) {
          return response.badRequest({ message: 'tu as déjà dislike ce job' })
        }
      }
      const like = new Like()
      like.job_id = jobId
      like.user_id = user.id
      like.like_status = 'dislike'
      await like.save()
      return response.status(200).json({ message: 'job disliké' })
    } catch (e) {
      console.error(e)
      return response.status(500).json({ e: 'impossible de disliker le job' })
    }
  }

  async allJobsLikedByUser({ auth, response }: HttpContext) {
    try {
      const user = auth.user
      if (!user) {
        return response.status(500).json({
          e: "impossible de filtrer les jobs à partir des attentes de l'utilisateur",
        })
      }
      const jobsLiked = await Like.query()
        .where('like_status', 'like')
        .andWhere('user_id', '=', user.id)
      return response.status(200).json(jobsLiked)
    } catch (e) {
      return response
        .status(500)
        .json({ e: "impossible de trouver tous les jobs liké par l'uitisateur" })
    }
  }
}
