import Prisma from 'repository/Prisma'
import {type RequestHandler} from 'express'
import CustomerRepository from 'repository/CustomerRepository'
import AuthService from 'services/AuthService'
import CustomerService from 'services/CustomerService'

import BaseController from './BaseController'
import HTTPException from 'exceptions/HTTPException'

class AuthController extends BaseController {

    echo: RequestHandler = async (req, res) => {
        const { authenticated, customer } = req

        res.json({authenticated, customer}).end()
    }

    login: RequestHandler = async (req, res, next) => {

        const {email, password} = req.body

        if (typeof email !== 'string' || typeof password !== 'string') {
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

        if (!accessToken) {
            next(new HTTPException(401, 'invalid user or password'))
            return
        }

        res.json({
            access_token: accessToken
        }).end()
        return
    }
}

export default new AuthController()

