import { login } from 'controllers/authController'
import { Route } from './types'

const routes: Route[] = [
    ['post', '/login', login]
]

export {routes}
