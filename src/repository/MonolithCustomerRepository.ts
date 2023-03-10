import {IMonolithCustomer} from '../types/MonolithCustomer'
import {Pool, RowDataPacket} from 'mysql2/promise'

export default class MonolithCustomerRepository {
    #pool: Pool

    constructor(pool: Pool) {
        this.#pool = pool
    }

    async chunkById(lastId: number, limit = 1000): Promise<IMonolithCustomer[]> {
        const [rows]: [RowDataPacket[], unknown] = await this.#pool.query(`
            SELECT customer_id,
                   customer_uuid,
                   customer_firstname,
                   customer_lastname,
                   customer_email,
                   customer_password,
                   customer_created
            FROM customers
            WHERE customer_id > ${lastId}
            ORDER BY customer_id ASC LIMIT ${limit}
        `)

        return rows as IMonolithCustomer[]
    }

    async getCustomerCount(): Promise<number> {
        const [rows]: [RowDataPacket[], unknown] = await this.#pool.query('SELECT COUNT(*) as customerCount FROM customers')

        return rows[0].customerCount
    }
}
