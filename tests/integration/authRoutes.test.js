//@ts-check
const request = require('supertest')
const app = require('../../dist/app').default

describe('Auth routes', () => {

    it('It should return 422 when email / password is missing', async () => {

        // given - an invalid login request 
        const postData = {
            email: 'foo@bar.com'
        }

        // when - we make the login request
        const response = await request(app)
            .post('/login')
            .send(postData)

        // then - we get 422 unprocessible response
        expect(response.status).toBe(422)
        expect(response.body).toEqual({ message: 'invalid request' })
    })

    it('It should return 401 when email / password do not pass check', async () => {

        // given - an invalid user & password request
        const postData = {
            email: 'foo@bar.com',
            password: 'fizzbuzz'
        }

        // when - we make the login request
        const response = await request(app)
            .post('/login')
            .send(postData)

        // then - we get a 401 unauthorized response
        expect(response.status).toBe(401)
        expect(response.body).toEqual({ message: 'invalid user or password' })
    })

    it('It should return 200 and a token on valid email / password', async () => {

        // given - a user we know to exist (in the migrated database)
        const postData = {
            email: 'joshua.franks@lovehomeswap.com',
            password: 'password'
        }

        // when - we login with the real credentials
        const response = await request(app)
            .post('/login')
            .send(postData)

        // then - we get a 200 success with an access_token
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('access_token')
    })

    it('...And that token should be able to echo the user on the /echo-user endpoint', async () => {

        // given - a real user credentials
        const postData = {
            email: 'joshua.franks@lovehomeswap.com',
            password: 'password'
        }

        // when - we make the login request
        const loginResponse = await request(app)
            .post('/login')
            .send(postData)

        // then - we get a success response with a token
        expect(loginResponse.status).toBe(200)
        expect(loginResponse.body).toHaveProperty('access_token')

        // when - we then make a request to a proteted route with that token
        const echoResponse = await request(app)
            .get('/echo-user')
            .set('authorization', `Bearer ${loginResponse.body.access_token}`)
            .send()

        // then - we get a success status
        expect(echoResponse.status).toBe(200)
        expect(echoResponse.body.authenticated).toBe(true)

        // then - we the expected response
        const expectedProps = ['id', 'email', 'first_name', 'last_name', 'avatar']
        expectedProps.forEach(prop => {
            expect(echoResponse.body.customer).toHaveProperty(prop)
        })
        expect(echoResponse.body.customer.email).toBe(postData.email)
    })

})


