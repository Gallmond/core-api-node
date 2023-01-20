import HTTPException from 'exceptions/HTTPException'
import { RequestHandler } from 'express'

export const helloWorld: RequestHandler = (req, res) => {
    res.json({foo: 'bar', ...req.body})
}

export const echoUser: RequestHandler = (req, res) => {
    const {authenticated, customer} = req
    res.json({authenticated, customer})
}

export const throwsError: RequestHandler = (req) => {
    const {name, code, message} = req.body

    if(!name || !code || !message){
        throw new HTTPException(500, 'Missing params')
    }

    throw new HTTPException(code, message)
}
