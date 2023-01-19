import express from 'express'
import {routes as helloWorldRoutes} from './routes/helloWorldRoutes'
import { Route } from './routes/types'

// initialise express
const app = express()

// enable json request body
app.use(express.json())

// register routes
const routes: Route[] = []
routes.push(...helloWorldRoutes)
routes.forEach(route => {
    const [method, routeMatcher, handler] = route
    app[method](routeMatcher, handler)
})

export default app
