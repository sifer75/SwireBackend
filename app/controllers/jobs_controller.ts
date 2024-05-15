import Company from '#models/company'
import Job from '#models/job'
import Like from '#models/like'
import User from '#models/user'
import { cuid } from '@adonisjs/core/helpers'
import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import path from 'node:path'
import fs from 'node:fs'
import db from '@adonisjs/lucid/services/db'

export default class JobsController {
  // creer un job

  async createJobPreferences({ request, response }: HttpContext) {
    try {
      const getExtensionFromBase64 = (base64Data: string): string => {
        const extensionRegExp = /(?:image\/)(\w+)/
        const result = base64Data.match(extensionRegExp)
        if (result && result.length === 2) {
          return result[1]
        } else {
          throw new Error(
            "Impossible de déterminer l'extension du fichier à partir des données base64."
          )
        }
      }

      const {
        name,
        salary,
        location,
        language,
        workRhythm,
        disponibility,
        fields,
        target,
        imageFont,
      }: {
        name: string
        salary: number
        location: string
        language: string
        target: string[]
        fields: string[]
        disponibility: string[]
        workRhythm: string[]
        imageFont: string
      } = request.only([
        'name',
        'salary',
        'location',
        'workRhythm',
        'disponibility',
        'language',
        'target',
        'fields',
        'imageFont',
      ])
      if (!imageFont) {
        return response.status(400).send({ message: "Aucune image n'a été téléchargée." })
      }
      const base64Data = imageFont.replace(/^data:image\/\w+;base64,/, '')
      const dataBuffer = Buffer.from(base64Data, 'base64')
      const fileName = `${cuid()}.${getExtensionFromBase64(imageFont)}`
      const uploadsDirectory = app.makePath('uploads')
      if (!fs.existsSync(uploadsDirectory)) {
        fs.mkdirSync(uploadsDirectory, { recursive: true })
      }
      const filePath = path.join(app.makePath('uploads'), fileName)
      fs.writeFileSync(filePath, dataBuffer)

      const job = new Job()
      job.name = name
      job.salary = salary
      job.location = location
      job.work_rhythm = workRhythm
      job.disponibility = disponibility
      job.target = target
      job.fields = fields
      job.language = language
      job.image_font = fileName
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
      const { studyLevel, fieldOfStudy, duration, experience } = request.only([
        'studyLevel',
        'experience',
        'duration',
        'fieldOfStudy',
      ])
      const jobId = await params.id
      const job = await Job.findOrFail(jobId)
      if (!job) {
        return response.status(404).json({ error: 'Job not found' })
      }
      job.study_level = studyLevel
      job.field_of_study = fieldOfStudy
      job.duration = duration
      job.experience = experience
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
      console.log(questionArray)
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

  // avoir les jobs avec une queue

  async getJob({ auth, response }: HttpContext) {
    try {
      if (!auth || !auth.user || auth.user.id) {
        return response.status(400).json({ error: 'cookie non trouvé' })
      }
      const companyId = auth.user.id
      const company = await Company.find(companyId)
      if (!company) {
        return response.status(400).json({ error: 'Companie non trouvé' })
      }
      const jobs = await company.related('jobs').query()
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

  // supprimer un job

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
          e: "Impossible de filtrer les jobs à partir des attentes de l'utilisateur",
        })
      }

      const preferencesUser = await User.findOrFail(user.id)
      if (
        !preferencesUser.experience ||
        !preferencesUser.duration ||
        !preferencesUser.work_rhythm ||
        !preferencesUser.disponibility ||
        !preferencesUser.fields ||
        !preferencesUser.target
      ) {
        return response.status(500).json({
          e: "Impossible de filtrer les jobs à partir des attentes de l'utilisateur",
        })
      }
      const likedOrDislikedJobs = await Like.all()
      const idJobs = likedOrDislikedJobs.map((job) => job.job_id)
      const formattedArray = idJobs.length > 0 ? `('${idJobs.join("', '")}')` : '(NULL)'

      // Convertir les valeurs nettoyées en chaînes de caractères pour la requête SQL
      const experienceString = `ARRAY['${preferencesUser.experience.join("', '")}']`
      const fieldsString = `ARRAY['${preferencesUser.fields.join("', '")}']`
      const disponibilityString = `ARRAY['${preferencesUser.disponibility.join("', '")}']`
      const durationString = `ARRAY['${preferencesUser.duration.join("', '")}']`
      const workRhythmString = `ARRAY['${preferencesUser.work_rhythm.join("', '")}']`
      const targetString = `ARRAY['${preferencesUser.target.join("', '")}']`
      console.log(
        experienceString,
        fieldsString,
        disponibilityString,
        durationString,
        workRhythmString,
        targetString,
        'coucou'
      )
      console.log(
        preferencesUser.experience,
        preferencesUser.fields,
        preferencesUser.disponibility,
        preferencesUser.duration,
        preferencesUser.work_rhythm,
        preferencesUser.target,
        'coucou2'
      )

      const jobfiltered: any = await db.rawQuery(
        `   


        SELECT jobs.*,  
        ( 
            (
                (CASE WHEN ARRAY(SELECT unnest(${experienceString})) && ARRAY(SELECT unnest(jobs.experience)) THEN 1 ELSE 0 END) +
                (CASE WHEN ARRAY(SELECT unnest(${fieldsString})) && ARRAY(SELECT unnest(jobs.fields)) THEN 1 ELSE 0 END) +
                (CASE WHEN ARRAY(SELECT unnest(${disponibilityString})) && ARRAY(SELECT unnest(jobs.disponibility)) THEN 1 ELSE 0 END) +
                (CASE WHEN ARRAY(SELECT unnest(${durationString})) && ARRAY(SELECT unnest(jobs.duration)) THEN 1 ELSE 0 END) +
                (CASE WHEN ARRAY(SELECT unnest(${workRhythmString})) && ARRAY(SELECT unnest(jobs.work_rhythm)) THEN 1 ELSE 0 END) +
                (CASE WHEN ARRAY(SELECT unnest(${targetString})) && ARRAY(SELECT unnest(jobs.target)) THEN 1 ELSE 0 END)
            ) / 6.0 * 100
        ) AS pourcentage
    FROM 
        jobs, users
    WHERE ( ${formattedArray} IS NULL OR jobs.id NOT IN ${formattedArray}) AND
        (
            (
                (CASE WHEN ARRAY(SELECT unnest(${experienceString})) && ARRAY(SELECT unnest(jobs.experience)) THEN 1 ELSE 0 END) +
                (CASE WHEN ARRAY(SELECT unnest(${fieldsString})) && ARRAY(SELECT unnest(jobs.fields)) THEN 1 ELSE 0 END) +
                (CASE WHEN ARRAY(SELECT unnest(${disponibilityString})) && ARRAY(SELECT unnest(jobs.disponibility)) THEN 1 ELSE 0 END) +
                (CASE WHEN ARRAY(SELECT unnest(${durationString})) && ARRAY(SELECT unnest(jobs.duration)) THEN 1 ELSE 0 END) +
                (CASE WHEN ARRAY(SELECT unnest(${workRhythmString})) && ARRAY(SELECT unnest(jobs.work_rhythm)) THEN 1 ELSE 0 END) +
                (CASE WHEN ARRAY(SELECT unnest(${targetString})) && ARRAY(SELECT unnest(jobs.target)) THEN 1 ELSE 0 END)
            ) / 6.0 * 100
        ) > 0
    ORDER BY 
        pourcentage DESC;
    `
      )

      // SELECT jobs.*,
      // (
      //   (  CASE
      //         WHEN EXISTS (
      //             SELECT 1
      //             FROM unnest(jobs.work_rhythm) AS jr
      //             CROSS JOIN LATERAL unnest('${preferencesUser.work_rhythm}') AS ur
      //             WHERE jr = ur
      //         ) THEN 1
      //         ELSE 0
      //     END ) +
      // 	(  CASE
      //         WHEN EXISTS (
      //             SELECT 1
      //             FROM unnest(jobs.duration) AS jr
      //             CROSS JOIN LATERAL unnest('${preferencesUser.duration}') AS ur
      //             WHERE jr = ur
      //         ) THEN 1
      //         ELSE 0
      //     END ) +
      // 	(  CASE
      //         WHEN EXISTS (
      //             SELECT 1
      //             FROM unnest(jobs.experience) AS jr
      //             CROSS JOIN LATERAL unnest('${preferencesUser.experience}') AS ur
      //             WHERE jr = ur
      //         ) THEN 1
      //         ELSE 0
      //     END ) +
      // 	(  CASE
      //         WHEN EXISTS (
      //             SELECT 1
      //             FROM unnest(jobs.target) AS jr
      //             CROSS JOIN LATERAL unnest('${preferencesUser.target}') AS ur
      //             WHERE jr = ur
      //         ) THEN 1
      //         ELSE 0
      //     END ) +
      // 	(  CASE
      //         WHEN EXISTS (
      //             SELECT 1
      //             FROM unnest(jobs.fields) AS jr
      //             CROSS JOIN LATERAL unnest('${preferencesUser.fields}') AS ur
      //             WHERE jr = ur
      //         ) THEN 1
      //         ELSE 0
      //     END ) +
      // 	(  CASE
      //         WHEN EXISTS (
      //             SELECT 1
      //             FROM unnest(jobs.disponibility) AS jr
      //             CROSS JOIN LATERAL unnest('${preferencesUser.disponibility}') AS ur
      //             WHERE jr = ur
      //         ) THEN 1
      //         ELSE 0
      //     END )
      // ) / 6.0 * 100 AS pourcentage
      // FROM jobs, users;
      // `
      //       )
      // for (const job of jobs) {
      //   let matchingCriteria = 0
      //   if (!idJobs.includes(job.id)) {
      //     const criteriasArray = [
      //       ...job.disponibility,
      //       ...job.experience,
      //       ...job.target,
      //       ...job.fields,
      //       ...job.duration,
      //       ...job.work_rhythm,
      //     ]

      //     criteriasArray.forEach((criteria) => {
      //       Object.keys(preferencesUser).forEach((key) => {
      //         const criteriaKey = key as PreferenceKey
      //         if (preferencesUser[criteriaKey].includes(criteria)) {
      //           matchingCriteria++
      //         }
      //       })
      //     })

      //     const totalCriteriaCount = criteriasArray.length * Object.keys(preferencesUser).length
      //     const jobPercentage = (matchingCriteria / totalCriteriaCount) * 100

      //     console.log(jobPercentage, 'percentage')
      //     console.log(totalCriteriaCount, 'criteria')
      //     console.log(jobPercentage, 'percentage')

      //     if (jobPercentage >= 20) {
      //       recommendedJobs.push({ job, percentage: jobPercentage })
      //     }
      //   } WHERE ( ${formattedArray} IS NULL OR jobs.id NOT IN ${formattedArray}) AND
      // }

      console.log(jobfiltered, 'jobsssss')
      // console.log(recommendedJobs, 'jobs')
      if (!jobfiltered || jobfiltered.length === 0) {
        return response.status(404).json({
          message: "Aucun résultat trouvé pour les préférences de l'utilisateur.",
        })
      }
      return response.status(200).json(jobfiltered.rows)
    } catch (e) {
      return response.status(500).json({
        e: "Impossible de filtrer les jobs à partir des attentes de l'utilisateur",
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
