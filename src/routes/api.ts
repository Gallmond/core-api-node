import authController from 'controllers/authController'
import helloWorldController from 'controllers/helloWorldController'
import discussionController from 'controllers/discussionController'
import DiscussionActivityStreamController from '../controllers/DiscussionActivityStreamController'
import {Router, json} from 'express'
import jwtAuth from 'middleware/JWTAuth'

const apiRouter = Router()

// middleware for api routes
apiRouter.use(json())
apiRouter.use(jwtAuth)

// routes
apiRouter.post('/login', authController.login)

apiRouter.get('/hello-world', helloWorldController.helloWorld)
apiRouter.get('/echo-user', helloWorldController.echoUser)
apiRouter.post('/throw-error', helloWorldController.throwsError)

apiRouter.get('/discussions/:id/activity-stream', DiscussionActivityStreamController.index.bind(DiscussionActivityStreamController))
apiRouter.get('/discussions', discussionController.getDiscussions)

export default apiRouter

