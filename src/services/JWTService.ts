import {JwtPayload, sign, verify} from 'jsonwebtoken'
import {readFileSync} from 'node:fs'

class JWTService{

    private static algorithm = 'RS256'
    private static audience = 'lhsapiclient' //TODO move this to a config
    private static _privateKey: string | null = null
    private static _publicKey: string | null = null
    
    static get privateKey(){
        if(JWTService._privateKey === null){
            JWTService._privateKey = readFileSync('./monolith-private-key.pem', {encoding: 'utf-8'})
        }

        return JWTService._privateKey
    }

    static get publicKey(){
        if(JWTService._publicKey === null){
            JWTService._publicKey = readFileSync('./monolith-public-key.pem', {encoding:'utf-8'})
        }

        return JWTService._publicKey
    }

    static encode(customPayload: object, additionalHeaders: Record<string, unknown> = {}): string
    {
        const header = {
            alg: JWTService.algorithm,
            typ: 'JWT',
            ...additionalHeaders
        }

        const payload = {
            aud: JWTService.audience,
            ...customPayload
        }

        return sign(payload, JWTService.privateKey, {
            algorithm: 'RS256',
            allowInsecureKeySizes: true,
            header
        })
    }

    static decode(jwt:string): JwtPayload
    {
        return verify(jwt, JWTService.publicKey, {
            audience: JWTService.audience
        }) as JwtPayload
    }

}

export default JWTService
