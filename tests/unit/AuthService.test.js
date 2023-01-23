//@ts-check
const AuthService = require('../../dist/services/AuthService').default
const { default: CustomerService } = require('../../dist/services/CustomerService')
const { default: CustomerRepository} = require('../../dist/repository/CustomerRepository')
const {createCustomer} = require("../factories/CustomerFactory");
const {tearDown} = require("../helpers/DatabaseHelper");
const Prisma = require('../../dist/repository/Prisma').default

describe('Test the AuthService', () => {

    const prismaClient = Prisma.client
    const customerRepo = new CustomerRepository(prismaClient)
    const authService = new AuthService()
    const customerService = new CustomerService(
        authService,
        customerRepo
    )

    afterEach(async () => {
       await tearDown()
    });

    test('It should be able to create its own hashes and then compare them', async () => {

        // given - some plain text
        const plainText = 'some cool password'
        
        // when - we hash it
        const hashed = authService.hash(plainText)
        expect(typeof hashed).toBe('string')

        // then - the compare function can match them
        const matches = await authService.compare(plainText, hashed)
        expect(matches).toBe(true)
    })

    /**
     * The algo identified by flag $2a$ (Blowfish-based crypt) had a bug
     *
     * A recommendation was made to identifiy the the fixed / broken with flags
     * - $2x$ : the broken version was used
     * - $2y$ : the corrected version was used
     *
     * Only PHP Adopted this recommendation and as such Node still expects $2a$
     * to identify this algorithm but our users on the monoltih have $2y$
     */
    it('It should be able to encrypt both broken and fixed algo flags', async () => {

        // given - a PHP flavour and Node flavour password using different flags for the same algo
        const plainText = 'password'
        const hashedBrokenAlgo = '$2a$10$/Ufi5VoFh1c.SSYi/V0Oqulgf2/66HvsMfa4yTSZmvhd9/yWHJEza'
        const hashedCorrectedAlgo = '$2y$10$/Ufi5VoFh1c.SSYi/V0Oqulgf2/66HvsMfa4yTSZmvhd9/yWHJEza'

        // when - we compare it with AuthService
        const brokenAlgoResult = await authService.compare(plainText, hashedBrokenAlgo)
        const correctedAlgoResult = await authService.compare(plainText, hashedCorrectedAlgo)

        // then - both are successful
        expect(brokenAlgoResult).toBe(true)
        expect(correctedAlgoResult).toBe(true)
    })


    it('It return false if the compare fails', async () => {

        // given - an incorrect password
        const customer = createCustomer();

        // when - we authenticate by email and password
        const result = await customerService.authenticateByEmailAndPassword(
            customer.email,
            'invalid-password',
        )

        // then - we get false back
        expect(result).toBe(false)
    })


})
