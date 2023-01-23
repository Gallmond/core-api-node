import Prisma from 'repository/Prisma'
import { type RequestHandler } from 'express'
import CustomerRepository from 'repository/CustomerRepository'
import AuthService from 'services/AuthService'
import CustomerService from 'services/CustomerService'
import BaseController from './BaseController'
import HTTPException from 'exceptions/HTTPException'

class AuthController extends BaseController{

    login: RequestHandler = async (req, res, next) => {

        const {email, password} = req.body
    
        if(typeof email !== 'string' || typeof password !== 'string'){
            next(new HTTPException(422, 'invalid request'))
            return
        }
    
        const customerService = new CustomerService(
            new AuthService(),
            new CustomerRepository(
                Prisma.client
            )
        )
    
        const accessToken = await customerService.authenticateByEmailAndPassword(
            email, password
        )
    
        if(!accessToken){
            res.status(401).json({
                message: 'invalid user or password'
            }).end()
            return
        }
    
        res.json({
            access_token: accessToken
        }).end()
        return
    }

}

export default new AuthController()

