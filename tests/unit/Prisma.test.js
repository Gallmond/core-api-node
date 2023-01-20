//@ts-check
const { default: Prisma } = require('../../dist/repository/Prisma')
const { randomBytes } = require('node:crypto')

describe('Prisma singleton', () => {

    const client = Prisma.client
    const testUserEmail = `${randomBytes(10).toString('hex')}@domain.com`

    it('It can create correctly typed records', async () => {
        
        // given - some info to make a test user
        const data = {
            email: testUserEmail,
            first_name: 'bob',
            password: 'somehashedpassword'
        }
        
        // when - we create the test user
        const newCustomer = await client.customer.create({
            data
        })
        
        // then - the returned customer object has the expected data
        expect(newCustomer.email).toEqual(data.email)
        expect(newCustomer.first_name).toEqual(data.first_name)
        expect(newCustomer.password).toEqual(data.password)
        
        // then - we can get that new customer by their generated id
        const fetched = await client.customer.findUniqueOrThrow({
            where: {
                id: newCustomer.id
            }
        })

        // then - we can see the new customer is in the database
        expect(typeof fetched.id).toBe('string')
        expect(fetched.email).toEqual(data.email)
        expect(fetched.first_name).toEqual(data.first_name)
        expect(fetched.password).toEqual(data.password)

    })

    /**
     * Delete all test customers
     */
    afterAll(async () => {
        await client.customer.delete({
            where: {
                email: testUserEmail
            }
        })
    })

})
