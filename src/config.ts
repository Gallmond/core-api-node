import * as dotenv from 'dotenv'
dotenv.config({path: './.env'})

export const get = (key: string): any =>
{
    return process.env[ key ]
}