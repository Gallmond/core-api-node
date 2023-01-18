import * as dotenv from 'dotenv'
dotenv.config({path: './.env'})

export const get = (key: string): unknown =>
{
    return process.env[ key ]
}