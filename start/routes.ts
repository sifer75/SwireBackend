import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

const UsersController = () => import('#controllers/users_controller')
const JobsController = () => import('#controllers/jobs_controller')

// Creation du user

// router.get('/user', [UsersController, 'getAllUsers'])
router.post('/user/create', [UsersController, 'createUser'])

// Login avec linkedin

router.get('login/linkedin', [UsersController, 'redirection'])
router.get('/auth/linkedin/redirect', [UsersController, 'callbackLinkedin'])

// login avec une session

router.post('/login', [UsersController, 'login'])
router.post('/forget/password', [UsersController, 'forgetPassword'])

// Matching

router
  .group(() => {
    router.post('/user/update', [UsersController, 'updateUser'])
    router.post('/user/updateFields', [UsersController, 'updateFields'])
    router.post('/user/updateTarget', [UsersController, 'updateTarget'])
    router.post('/user/updateDisponibility', [UsersController, 'updateDisponibility'])
    router.post('/user/updateLocation', [UsersController, 'updateLocation'])
    router.get('/job/all', [JobsController, 'filterJobsByUserPreference'])
    router.get('/user', [UsersController, 'findUser'])
    router.post('/logout', [UsersController, 'logout'])
    router.get('/job/like/all', [JobsController, 'allJobsLikedByUser'])
    router.post('/job/:id/like', [JobsController, 'likeJob'])
    router.post('/job/:id/dislike', [JobsController, 'dislikeJob'])
  })
  .use(
    middleware.auth({
      guards: ['web'],
    })
  )

router.post('/job/create', [JobsController, 'createJob'])
router.delete('/job/:id/delete', [JobsController, 'deleteJob'])
