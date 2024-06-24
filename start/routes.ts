import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

const UsersController = () => import('#controllers/users_controller')
const JobsController = () => import('#controllers/jobs_controller')
const CompanyController = () => import('#controllers/companies_controller')

// Creation du compte

router.post('/user/create', [UsersController, 'createUser'])
router.post('/company/create', [CompanyController, 'createCompany'])

// Login avec linkedin

router.get('login/linkedin', [UsersController, 'redirection'])
router.get('/auth/linkedin/redirect', [UsersController, 'callbackLinkedin'])

// login avec une session

router.post('/user/login', [UsersController, 'login'])
router.post('/forget/password', [UsersController, 'forgetPassword'])
router.post('/company/forget/password', [CompanyController, 'forgetPassword'])
router.post('/company/login', [CompanyController, 'login'])

// Matching

router
  .group(() => {
    router.post('/user/update', [UsersController, 'updateUser'])
    router.post('/user/updateFields', [UsersController, 'updateFields'])
    router.post('/user/updateTarget', [UsersController, 'updateTarget'])
    router.post('/user/updateDisponibility', [UsersController, 'updateDisponibility'])
    router.post('/user/updateRhythm', [UsersController, 'updateRhythm'])
    router.post('/user/updateDuration', [UsersController, 'updateDuration'])
    router.post('/user/updateExperience', [UsersController, 'updateExperience'])
    router.post('/user/updateLocation', [UsersController, 'updateLocation'])
    router.get('/user/job/all', [JobsController, 'filterJobsByUserPreference'])
    router.get('/user', [UsersController, 'findUser'])
    router.post('/user/logout', [UsersController, 'logout'])
    router.get('/job/like/all', [JobsController, 'allJobsLikedByUser'])
    router.post('/job/:id/like', [JobsController, 'likeJob'])
    router.post('/job/:id/dislike', [JobsController, 'dislikeJob'])
  })
  .use(
    middleware.auth({
      guards: ['user'],
    })
  )

router.get('/job/:id/getquestion', [JobsController, 'getQuestion'])
router.delete('/job/:id/delete', [JobsController, 'deleteJob'])

router
  .group(() => {
    router.post('/company/job/create', [JobsController, 'createJobPreferences'])
    router.get('/company', [CompanyController, 'findCompany'])
    router.post('/job/:id/updatedescription', [JobsController, 'updateJobDescription'])
    router.post('/job/:id/updatematch', [JobsController, 'updateMatch'])
    router.post('/job/:id/createquestion', [JobsController, 'createQuestion'])
    router.post('/company/logout', [CompanyController, 'logout'])
    router.get('/company/job/all', [JobsController, 'getJob'])
    router.get('/company/job/countlikedbyuser', [CompanyController, 'getNumberOfUserWhoLikedJob'])
    router.get('/company/job/likedbyuser', [CompanyController, 'getUserWhoLikedJob'])
    router.get('/user/:id', [CompanyController, 'findUserWithId'])
  })
  .use(
    middleware.auth({
      guards: ['company'],
    })
  )
