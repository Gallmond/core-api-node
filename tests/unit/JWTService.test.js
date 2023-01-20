const JWTService = require('../../dist/services/JWTService').default
const { TokenExpiredError, JsonWebTokenError } = require('jsonwebtoken')
const fs = require('node:fs')

describe('JWT Service Test', () => {

    /**
     * If this is failing you are probably missing local .gitignored file
     */
    it('Can read the public pem file', () => {

        // given - local pem files
        const path = './monolith-public-key.pem'

        // when - we read them
        const publicKey = fs.readFileSync(path, { encoding: 'utf-8' })

        // then - they are as expected
        expect(typeof publicKey).toBe('string')
        const hasExpectedHeader = publicKey.startsWith('-----BEGIN CERTIFICATE-----')
        expect(hasExpectedHeader).toBeTruthy()
    })

    /**
     * If this is failing you are probably missing local .gitignored file
     */
    it('Can read the private pem file', () => {
        
        // given - local pem files
        const path = './monolith-private-key.pem'
        
        // when - we read them
        const privateKey = fs.readFileSync(path, { encoding: 'utf-8' })
        
        // then - they are as expected
        expect(typeof privateKey).toBe('string')
        const hasExpectedHeader = privateKey.startsWith('-----BEGIN RSA PRIVATE KEY-----')
        expect(hasExpectedHeader).toBeTruthy()
    })

    it('Can generate a JWT with the monolith keys', () => {
        // given - a test payload
        const testPayload = { foo: 'bar' }
        
        // when - we encode a JWT using the payload
        const jwt = JWTService.encode(testPayload)

        // then - the returned string looks like a JWT
        expect(typeof jwt).toBe('string')
        const parts = jwt.split('.')
        expect(parts).toHaveLength(3)

        const headBuffer = Buffer.from(parts[0], 'base64')
        const jsonString = headBuffer.toString('utf-8')
        const decodedHead = JSON.parse(jsonString)
        expect(decodedHead).toHaveProperty('alg')
        expect(decodedHead.alg).toBe('RS256')
        expect(decodedHead).toHaveProperty('typ')
        expect(decodedHead.typ).toBe('JWT')
        
        // then - we are able to decode it
        const decodedPayload = JWTService.decode(jwt)
        expect(typeof decodedPayload).toBe('object')
        
        // then - the decoded payload has the expected data
        expect(decodedPayload).toHaveProperty('foo')
        expect(decodedPayload.foo).toBe(testPayload.foo)
    })

    it('Fails when decoding an expired token', () => {

        // given - a jwt with an expired date in the payload
        const nowSeconds = Math.floor(new Date().valueOf() / 1000)
        const payload = { exp: nowSeconds - 1000 }
        const jwt = JWTService.encode(payload)
        
        // when - we decode it
        const shouldThrow = () => {
            JWTService.decode(jwt)
        }

        // then - it threw the expected error
        expect(shouldThrow).toThrow(TokenExpiredError)
    })

    it('Fails when decoding an invalid token', () => {
        // given - a jwt with a broken signature
        const payload = { foo: 'bar'}
        const jwt = JWTService.encode(payload) + 'a'
        
        // when - we try to decode it
        const shouldThrow = () => {
            JWTService.decode(jwt)
        }
        
        // then - it throws the expected error
        expect(shouldThrow).toThrow(JsonWebTokenError)
        expect(shouldThrow).toThrow('invalid signature')
    })

})
