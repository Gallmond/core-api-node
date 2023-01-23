import { Request } from 'express'
import { FilteredCustomer } from 'middleware/JWTAuth'


class BaseController{
    protected authenticatedCustomer = (req: Request): FilteredCustomer | false => {
        return req.authenticated === true && typeof req.customer?.id === 'string'
            ? req.customer
            : false
    }
}

export default BaseController
