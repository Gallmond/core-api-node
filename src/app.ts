import express from 'express'
import {routes as helloWorldRoutes} from 'routes/helloWorldRoutes'
import {routes as authRoutes} from 'routes/authRoutes'
import { Route } from 'routes/types'
import jwtAuth from 'middleware/JWTAuth'
import errorHandler from 'middleware/ErrorHandler'

// initialise express
const app = express()

// middleware
app.use(express.json()) // enable json request bodies
app.use(jwtAuth)        // enable JWT auth

// register routes
const routes: Route[] = []
routes.push(...helloWorldRoutes)
routes.push(...authRoutes)
routes.forEach(route => {
    const [method, routeMatcher, handler] = route
    app[method](routeMatcher, handler)
})

// middleware
app.use(errorHandler)   // generic error handler must be set after routes

export default app
