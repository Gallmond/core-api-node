const request = require('supertest')
const {createCustomer} = require("../factories/CustomerFactory");
const app = require('../../dist/app').default

async function createCustomerAndLogin() {
    const customer = await createCustomer();

    const loginResponse = await request(app)
        .post('/login')
        .send({
            email: customer.email,
            password: 'password',
        });

    return {
        customer,
        accessToken: loginResponse.body.access_token,
    }
}

module.exports = {
    createCustomerAndLogin
}