import HTTPException from 'exceptions/HTTPException'
import { ErrorRequestHandler } from 'express'

export interface ErrorJson{
    error: string,
    message: string,
    code: number
}

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    if(err instanceof HTTPException){
        const { name, statusCode, statusMessage } = err
        const json: ErrorJson = {
            error: name,
            message: statusMessage,
            code: statusCode,
        }

        res.status(statusCode).json(json).send()
        return
    }
    
    return next(err)
}

export default errorHandler
