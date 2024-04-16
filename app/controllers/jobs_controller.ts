import Job from '#models/job'
import Like from '#models/like'
import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export default class JobsController {
  // creer un job

  async createJob({ request, response }: HttpContext) {
    try {
      const { name, image, time, language, disponibility, location, target, fields } = request.only(
        ['name', 'image', 'time', 'language', 'disponibility', 'location', 'target', 'fields']
      )

      const job = await Job.create({
        name: name,
        image: image,
        time: time,
        language: language,
        disponibility: disponibility,
        location: location,
        target: target,
        fields: fields,
      })

      return response.status(201).json(job)
    } catch (error) {
      return response.status(500).json({ error: 'Impossible de créer le job' })
    }
  }

  // supprimer un job

  async deleteJob({ params, response }: HttpContext) {
    try {
      const jobId = await params.id
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
      console.log(formattedArray)

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
      console.log(jobfiltered, 'zzzz')
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
      console.log(jobsLiked)
      return response.status(200).json(jobsLiked)
    } catch (e) {
      return response
        .status(500)
        .json({ e: "impossible de trouver tous les jobs liké par l'uitisateur" })
    }
  }
}
