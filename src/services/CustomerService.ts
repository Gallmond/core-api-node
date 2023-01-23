import { Customer } from '@prisma/client'
import CustomerRepository from '../repository/CustomerRepository'
import AuthService from './AuthService'
import {randomBytes} from 'node:crypto'
import JWTService from './JWTService'

class CustomerService{

    authService: AuthService
    customerRepository: CustomerRepository

    constructor(
        authService: AuthService,
        customerRepository: CustomerRepository
    ){
        this.authService = authService
        this.customerRepository = customerRepository
    }

    getCustomerToken(customer: Customer): string
    {
        const hourSeconds = 60 * 60 // one hour //TODO move this to config
        const aud = 'lhsapiclient' //TODO move this to config
        const nowSeconds = Math.floor(new Date().valueOf() / 1000)
        
        const jti = randomBytes(10).toString('hex')
        const payload = {
            jti,
            aud,
            sub: customer.id,
            iat: nowSeconds,
            exp: nowSeconds + hourSeconds
        }

        const header = {
            jti
        }

        return JWTService.encode(payload, header)
    }

    async authenticateByEmailAndPassword(email: string, plainTextPassword: string): Promise<boolean | string>
    {
        const customer = await this.customerRepository.getCustomerByEmail(email)

        if (!customer) {
            return false
        }

        const authenticated = await this.authService.compare(plainTextPassword, customer.password)

        if(authenticated){
            return this.getCustomerToken(customer)
        }

        return authenticated
    }

}

export default CustomerService
