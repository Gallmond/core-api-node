//@ts-check
const AuthService = require('../../dist/services/AuthService').default
const { default: CustomerService } = require('../../dist/services/CustomerService')
const { default: CustomerRepository} = require('../../dist/repository/CustomerRepository')
const Prisma = require('../../dist/repository/Prisma').default

describe('Test the AuthService', () => {
    
    const prismaClient = Prisma.client
    const customerRepo = new CustomerRepository(prismaClient)
    const authService = new AuthService()
    const customerService = new CustomerService(
        authService, 
        customerRepo
    )

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

    it('It should be able to authenticate a known user/pass', async () => {

        // given - a known user credential
        const email = 'joshua.franks@lovehomeswap.com'
        const password = 'password'
        
        // when - we authenticate by email and password
        const accessToken = await customerService.authenticateByEmailAndPassword(
            email, password
        )
        
        // then - we get a string back (the token)
        expect(typeof accessToken).toBe('string')
    })

    it('It return false if the compare fails', async () => {
        
        // given - an incorrect password
        const email = 'joshua.franks@lovehomeswap.com'
        const password = 'password-foobar'
        
        // when - we authenticate by email and password
        const result = await customerService.authenticateByEmailAndPassword(
            email, password
        )
        
        // then - we get false back
        expect(result).toBe(false)
    })


})
