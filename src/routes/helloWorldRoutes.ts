import { helloWorld } from '../controllers/helloWorldController'
import { Route } from './types'

const routes: Route[] = [
    ['get', '/hello-world', helloWorld]
]

export {routes}
