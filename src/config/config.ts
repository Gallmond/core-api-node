import * as dotenv from 'dotenv'
dotenv.config({path: './.env'})

/**
 * import { get } from '../config/config'
 * 
 * const someEnvVariable = get('SOME_ENV_VARIABLE')
 */
export const get = (key: string): unknown =>
{
    return process.env[ key ]
}
