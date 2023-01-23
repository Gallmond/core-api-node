import authController from 'controllers/AuthController'
import discussionController from 'controllers/DiscussionController'
import DiscussionActivityStreamController from '../controllers/DiscussionActivityStreamController'
import {Router, json} from 'express'
import jwtAuth from 'middleware/JWTAuth'

const apiRouter = Router()

// middleware for api routes
apiRouter.use(json())
apiRouter.use(jwtAuth)

// routes
apiRouter.post('/login', authController.login)
apiRouter.get('/echo-user', authController.echo)

apiRouter.get('/discussions/:id/activity-stream', DiscussionActivityStreamController.index.bind(DiscussionActivityStreamController))
apiRouter.get('/discussions', discussionController.getDiscussions)

export default apiRouter

