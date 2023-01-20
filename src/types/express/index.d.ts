import { FilteredCustomer } from 'middleware/JWTAuth'

export {}

// extend the request type to include optional authenticated and customer info
declare global {
    namespace Express{
        export interface Request{
            authenticated?: boolean
            customer?: FilteredCustomer
        }
    }
}
