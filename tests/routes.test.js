//@ts-check
const request = require('supertest')
const app = require('../dist/routes').default

describe('Test the hello-world GET request', () => {
    test('It should return status 200 and the expected json', async () => {
        const response = await request(app).get('/hello-world')
        expect(response.status).toBe(200)
        expect(response.body).toEqual({foo:'bar'})
    })

    test('It should return status 200 and echo any passed-in json', async () => {
        const json = {
            fizz: 'buzz'
        }

        const response = await request(app)
            .get('/hello-world')
            .set('content-type', 'application/json')
            .send(json)
            
        expect(response.status).toBe(200)
        expect(response.body).toEqual({foo:'bar', fizz:'buzz'})
    })

})