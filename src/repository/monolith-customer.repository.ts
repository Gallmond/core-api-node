import {IMonolithCustomer} from "../types/MonolithCustomer";
import {pool} from "./mysql";

export async function chunkById(lastId: number, limit: number = 1000): Promise<IMonolithCustomer[]> {
    let [rows, _]: any = await pool.query(`
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

    return rows;
}

export async function getCustomerCount(): Promise<number> {
    let [rows, _]: any = await pool.query('SELECT COUNT(*) as customerCount FROM customers')

    return rows[0].customerCount;
}