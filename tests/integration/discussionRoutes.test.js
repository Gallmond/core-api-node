//@ts-check
const request = require('supertest')
const { default: Prisma } = require('../../dist/repository/Prisma')
const {createCustomerAndLogin} = require("../helpers/CustomerHelper");
const {createDiscussionForCustomer} = require("../factories/DiscussionFactory");
const app = require('../../dist/app').default
const CustomerService = require('../../dist/services/CustomerService').default
const CustomerRepository = require('../../dist/repository/CustomerRepository').default
const AuthService = require('../../dist/services/AuthService').default

describe('Test the discussion endpoints', () => {

    const supertest = request(app)

    const customerRepository = new CustomerRepository(
        Prisma.client
    )
    const customerService = new CustomerService(
        new AuthService(),
        customerRepository,
    )

    test('An unauthorised user should get a 401 response', async () => {
        const response = await supertest
            .get('/discussions')
            .send()
        expect(response.status).toBe(401)
    })

    /**
     * This test relies on real data
     */
    test('A user can list discussions, and the first discussion has expected properties', async () => {
        
        // given - an existing user with trips in the tables and their token
        const {customer, accessToken} = await createCustomerAndLogin();

        const discussions = [
            await createDiscussionForCustomer(customer),
            await createDiscussionForCustomer(customer),
            await createDiscussionForCustomer(customer),
            await createDiscussionForCustomer(customer),
            await createDiscussionForCustomer(customer),
            await createDiscussionForCustomer(customer),
            await createDiscussionForCustomer(customer),
        ]


        // when - we request their discussions
        const response = await supertest
            .get('/discussions')
            .set('authorization', `Bearer ${accessToken}`)
            .set('content-type', 'application/json')
            .send({take: 7})
            .timeout(10000)

        // then - we get a resultset as expected
        expect(response.status).toBe(200)

        // this has a lot of parts so lets check some formats
        const { data, pagination } = response.body

        // check pagination
        expect(pagination).toHaveProperty('total')
        expect(pagination).toHaveProperty('skip')
        expect(pagination).toHaveProperty('take')
        expect(typeof pagination.total).toBe('number')
        expect(typeof pagination.skip).toBe('number')
        expect(typeof pagination.take).toBe('number')
        // and the specific ones we gave it
        expect(pagination.take).toBe(7)

        // check data
        expect(Array.isArray(data)).toBe(true)
        expect(data.length).toBe(7) // we took five

        const datum = data.shift()
        // base parts
        expect(typeof datum.id).toBe('string')
        expect(typeof datum.state).toBe('string')
        expect(typeof datum.type).toBe('string')
        expect(typeof datum.unread_message_count).toBe('number')
        expect(typeof datum.latest_message).toBe('object')
        expect(typeof datum.other_user).toBe('object')
        expect(typeof datum.user).toBe('object')
        expect(typeof datum.trip).toBe('object')
        expect(typeof datum.created_at).toBe('string')
        expect(typeof datum.updated_at).toBe('string')
        
        // latest message format
        const message = datum.latest_message
        expect(typeof message.sender_id).toBe('string')
        expect(typeof message.content).toBe('string')
        expect(typeof message.created_at).toBe('string')
        expect(typeof message.read_at === 'string' || message.read_at === null).toBe(true)

        // other_user format
        const other_user = datum.other_user
        expect(typeof other_user.id).toBe('string')
        expect(typeof other_user.first_name).toBe('string')
        expect(typeof other_user.last_name).toBe('string')
        expect(typeof other_user.avatar === 'string' || other_user.avatar === null).toBe(true)
        expect(typeof other_user.agreed_at === 'string' || other_user.agreed_at === null).toBe(true)

        // user format
        const user = datum.user
        expect(typeof user.id).toBe('string')
        expect(typeof user.first_name).toBe('string')
        expect(typeof user.last_name).toBe('string')
        expect(typeof user.avatar === 'string' || user.avatar === null).toBe(true)
        expect(typeof user.agreed_at === 'string' || user.agreed_at === null).toBe(true)

        // trip format
        const trip = datum.trip
        expect(typeof trip.id).toBe('string')
        expect(typeof trip.start === 'string' || trip.start === null ).toBe(true)
        expect(typeof trip.end === 'string' || trip.end === null ).toBe(true)
        expect(typeof trip.property).toBe('object')
        
        // property format
        const property = trip.property
        expect(typeof property.id).toBe('string')
        expect(typeof property.location_summary).toBe('string')
    })

    afterAll(() => {
        Prisma.client.$disconnect()
    })

})
