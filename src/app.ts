import express from 'express'
import errorHandler from 'middleware/ErrorHandler'
import apiRouter from 'routes/api'
import HTTPException from 'exceptions/HTTPException'

// initialise express
const app = express()

// register routers
app.all('*', apiRouter)

// handle unmatched pages
app.all('', async (req, res, next) => {
    next(new HTTPException(404, 'route not found'))
})

// middleware
app.use(errorHandler)   // generic error handler must be set after routes

export default app
