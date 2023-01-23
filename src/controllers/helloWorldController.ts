import HTTPException from 'exceptions/HTTPException'
import { RequestHandler } from 'express'
import BaseController from './BaseController'

class HelloWorldController extends BaseController{

    helloWorld: RequestHandler = (req, res) => {
        res.json({foo: 'bar', ...req.body})
    }
    echoUser: RequestHandler = (req, res) => {
        const {authenticated, customer} = req
        res.json({authenticated, customer})
    }

    throwsError: RequestHandler = (req) => {
        const {name, code, message} = req.body
    
        if(!name || !code || !message){
            throw new HTTPException(500, 'Missing params')
        }
    
        throw new HTTPException(code, message)
    }

}

export default new HelloWorldController()
