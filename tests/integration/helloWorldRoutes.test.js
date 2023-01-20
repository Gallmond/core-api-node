//@ts-check
const request = require('supertest')
const app = require('../../dist/app').default
const Prisma = require('../../dist/repository/Prisma').default
const CustomerService = require('../../dist/services/CustomerService').default
const CustomerRepository = require('../../dist/repository/CustomerRepository').default
const AuthService = require('../../dist/services/AuthService').default


describe('Test the echo-user GET request', () => {

    const supertest = request(app)
    it('It should show authorised and customer info for valid token', async () => {
        
        // given - a real user access token (in the actual db)
        const email = 'joshua.franks@lovehomeswap.com'
        const password = 'password'

        const customerRepository = new CustomerRepository(
            Prisma.client
        )
        const customerService = new CustomerService(
            new AuthService(),
            customerRepository,
        )

        const token = await customerService.authenticateByEmailAndPassword(email, password)
        expect(typeof token).toBe('string')

        // when - we make a request to echo user
        const response = await supertest
            .get('/echo-user')
            .set('authorization', `Bearer ${token}`)
            .send()

        // then - we get a success response 
        expect(response.status).toBe(200)
        expect(response.body.authenticated).toBe(true)

        // then - we get the expected data
        expect(response.body).toHaveProperty('customer')
        const customer = await customerRepository.getCustomerByEmail(email)
        expect(response.body.customer.id).toEqual(customer.id)
        expect(response.body.customer.email).toEqual(customer.email)
        expect(response.body.customer.first_name).toEqual(customer.first_name)
        expect(response.body.customer.last_name).toEqual(customer.last_name)
        expect(response.body.customer.avatar).toEqual(customer.avatar)
    })

})

describe('Test the throws-error POST request', () => {
    
    const supertest = request(app)

    test('It should throw a specified error', async () => {
        // given - a correct request
        const postData = {
            name: 'HTTPException',
            code: 481,
            message: 'I\'m a teapot!'
        }

        // when - we make the request
        const response = await supertest
            .post('/throw-error')
            .set('content-type', 'application/json')
            .send(postData)

        // then - it should be caught and transformed into an expected shape
        expect(response.status).toEqual(postData.code)
        expect(response.body.error).toEqual(postData.name)
        expect(response.body.code).toEqual(postData.code)
        expect(response.body.message).toEqual(postData.message)
    })
    
    test('It should throw a generic error on missing params', async () => {
        // given - a malformed request
        const postData = {
            foo: 'bar'
        }

        // when - we make the request
        const response = await supertest
            .post('/throw-error')
            .set('content-type', 'application/json')
            .send(postData)

        // then - it should be caught and transformed into an expected shape
        expect(response.status).toBe(500)
        expect(response.body.error).toBe('HTTPException')
        expect(response.body.code).toBe(500)
        expect(response.body.message).toBe('Missing params')
    })

})

describe('Test the hello-world GET request', () => {

    const supertest = request(app)

    test('It should return status 200 and the expected json', async () => {
        
        // given - an existing route
        const response = await supertest.get('/hello-world')

        // when - we make a request
        expect(response.status).toBe(200)

        // then - we get a success response
        expect(response.body).toEqual({ foo: 'bar' })
    })

    test('It should return status 200 and echo any passed-in json', async () => {
        
        // given - a post request
        const json = {fizz: 'buzz'}
        
        // when - we make a request to hello world
        const response = await supertest
            .get('/hello-world')
            .set('content-type', 'application/json')
            .send(json)

        // then - it returns the expected data
        expect(response.status).toBe(200)
        expect(response.body).toEqual({ foo: 'bar', fizz: 'buzz' })
    })

})
