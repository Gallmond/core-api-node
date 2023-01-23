//@ts-check
const request = require('supertest')
const {createCustomer} = require("../factories/CustomerFactory");
const {createCustomerAndLogin} = require("../helpers/CustomerHelper");
const {default: Prisma} = require("../../dist/repository/Prisma");
const {tearDown} = require("../helpers/DatabaseHelper");
const app = require('../../dist/app').default

const expectHTTPException = (response, code, message) => {
    expect(response.status).toBe(code)
    expect(response.body.message).toBe(message)
    expect(response.body.code).toBe(code)
    expect(response.body.error).toBe('HTTPException')
}

describe('Auth routes', () => {
    afterEach(async () => {
        await tearDown()
    });

    const supertest = request(app)

    it('It should return 422 when email / password is missing', async () => {
        // given - an invalid login request
        const postData = {
            email: 'foo@bar.com'
        }

        // when - we make the login request
        const response = await supertest
            .post('/login')
            .send(postData)

        // then - we get 422 unprocessible response
        expectHTTPException(response, 422, 'invalid request')
    })

    it('It should return 401 when email / password do not pass check', async () => {
        // given - an invalid user & password request
        const postData = {
            email: 'foo@bar.com',
            password: 'fizzbuzz'
        }

        // when - we make the login request
        const response = await supertest
            .post('/login')
            .send(postData)

        // then - we get a 401 unauthorized response
        expectHTTPException(response, 401, 'invalid user or password')

    })

    it('It should return 200 and a token on valid email / password', async () => {
        // given - a real user credentials
        const customer = await createCustomer();

        // when - we make the login request
        const response = await request(app)
            .post('/login')
            .send({
                email: customer.email,
                password: 'password',
            })

        // then - we get a 200 success with an access_token
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('access_token')
    })

    it('...And that token should be able to echo the user on the /echo-user endpoint', async () => {
        // given - a real user credentials
        const {customer, accessToken} = await createCustomerAndLogin();

        // when - we make the login request
        const loginResponse = await supertest
            .post('/login')
            .send({
                email: customer.email,
                password: 'password',
            })

        // then - we get a success response with a token
        expect(loginResponse.status).toBe(200)
        expect(loginResponse.body).toHaveProperty('access_token')

        // when - we then make a request to a proteted route with that token
        const echoResponse = await supertest
            .get('/echo-user')
            .set('authorization', `Bearer ${accessToken}`)
            .send()

        // then - we the expected response
        const expectedProps = ['id', 'email', 'first_name', 'last_name', 'avatar']

        expect(echoResponse.status).toBe(200)
        expect(echoResponse.body.authenticated).toBe(true)

        expectedProps.forEach(prop => {
            expect(echoResponse.body.customer).toHaveProperty(prop)
        })
        expect(echoResponse.body.customer.email).toBe(customer.email)
    })

})


