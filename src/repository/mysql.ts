import {createPool, Pool} from 'mysql2/promise'

export const pool: Pool = createPool({
    connectionLimit: 10,
    host: '0.0.0.0',
    port: 3306,
    user: 'dev',
    password: 'dev',
    database: 'luxe',
})
