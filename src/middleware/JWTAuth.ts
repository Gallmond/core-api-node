import { Customer } from '@prisma/client'
import HTTPException from 'exceptions/HTTPException'
import { Request, RequestHandler } from 'express'
import Prisma from 'repository/Prisma'
import JWTService from 'services/JWTService'

export type FilteredCustomer = {
    id: string,
    email: string,
    first_name: string,
    last_name: string | null,
    avatar: string | null,
}

const getBearerToken = (req: Request): false | string => {
    const authHeader = req.get('authorization')
    if (
        typeof authHeader !== 'string'
        || !authHeader.startsWith('Bearer')
    ) {
        return false
    }

    return authHeader.split(' ')[1] ?? false
}

const filterCustomer = (customer: Customer): FilteredCustomer => {
    const {
        id, email, first_name, last_name, avatar
    } = customer
    
    return {
        id, email, first_name, last_name, avatar
    }
}

const jwtAuth: RequestHandler = async (req, res, next) => {
    const jwt = getBearerToken(req)
    if(!jwt){
        req.authenticated = false
        next()
        return
    }

    try{
        const payload = JWTService.decode(jwt)
        const { sub } = payload

        const customer = await Prisma.client.customer.findUniqueOrThrow({
            where: { id: sub }
        })

        req.authenticated = true
        req.customer = filterCustomer(customer)
    }catch(e){
        if(e instanceof Error){
            throw new HTTPException(402, e.message ?? 'Authorization error')
        }else{
            next(e)
        }
        return
    }

    next()
}

export default jwtAuth
