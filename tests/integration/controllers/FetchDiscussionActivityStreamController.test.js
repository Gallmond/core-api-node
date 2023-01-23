//@ts-check

const request = require('supertest')
const app = require('../../../dist/app').default
const {v4: uuidv4} = require('uuid')

const Prisma = require('../../../dist/repository/Prisma').default
const {DiscussionState} = require('../../../dist/enums/DiscussionState')
const {createDiscussionForCustomer} = require('../../factories/DiscussionFactory')
const {createCustomer} = require('../../factories/CustomerFactory')
const {createCustomerAndLogin} = require('../../helpers/CustomerHelper')
const {tearDown} = require('../../helpers/DatabaseHelper')

describe('FetchDiscussionActivityStreamController', () => {

    afterEach(async () => {
        await tearDown()    
    })

    it('It should return 200 and an array of messages', async () => {
        // given
        const {customer, accessToken} = await createCustomerAndLogin()
        const {discussion, messages} = await createDiscussionForCustomer(customer)

        // when
        const response = await request(app)
            .get(`/discussions/${discussion.id}/activity-stream`)
            .set('authorization', `Bearer ${accessToken}`)
            .send()

        // then
        expect(response.status).toBe(200)
        expect(response.body).toEqual({
            data: messages.map(message => {
                return {
                    id: message.id,
                    discussion_id: message.discussion_id,
                    customer_id: message.sender_id,
                    type: 'message',
                    content: message.content,
                    created_at: message.created_at.toISOString(),
                    read_at: message.read_at ? message.read_at.toISOString() : null,
                }
            })
        })
    })

    it('It should return 404 if the discussion does not exist', async () => {
        // given
        const {accessToken} = await createCustomerAndLogin()

        // when
        const response = await request(app)
            .get(`/discussions/${uuidv4()}/activity-stream`)
            .set('authorization', `Bearer ${accessToken}`)
            .send()

        // then
        expect(response.status).toBe(404)
        expect(response.body).toEqual({
            error: {
                'message': 'Discussion not found',
            }
        })
    })

    it('It should return 401 if no bearer token is provided', async () => {
        // given
        const {customer} = await createCustomerAndLogin()
        const {discussion} = await createDiscussionForCustomer(customer)

        // when
        const response = await request(app)
            .get(`/discussions/${discussion.id}/activity-stream`)
            .send()

        // then
        expect(response.status).toBe(401)
        expect(response.body).toEqual({
            error: {
                'message': 'Unauthorised',
            }
        })
    })

    it('It should return 404 if the user does not have access to the discussion', async () => {
        // given
        const {accessToken} = await createCustomerAndLogin()
        const otherCustomer = await createCustomer()
        const discussion = await Prisma.client.discussion.create({
            data: {
                id: uuidv4(),
                state: DiscussionState.discuss,
                initiator: {
                    connect: {
                        id: otherCustomer.id
                    }
                }
            }
        })

        // when
        const response = await request(app)
            .get(`/discussions/${discussion.id}/activity-stream`)
            .set('authorization', `Bearer ${accessToken}`)
            .send()

        // then
        expect(response.status).toBe(404)
        expect(response.body).toEqual({
            error: {
                'message': 'Discussion not found',
            }
        })
    })
})


