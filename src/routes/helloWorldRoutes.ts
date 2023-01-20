import { helloWorld, echoUser, throwsError } from 'controllers/helloWorldController'
import { Route } from './types'

const routes: Route[] = [
    ['get', '/hello-world', helloWorld],
    ['get', '/echo-user', echoUser],
    ['post', '/throw-error', throwsError],
]

export {routes}
