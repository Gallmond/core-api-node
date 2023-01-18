import {createConnection} from "mysql2/promise";
import {IMonolithCustomer} from "../types/MonolithCustomer";

async function getConnection() {
    return createConnection({
        host: '0.0.0.0',
        port: 3306,
        user: 'dev',
        password: 'dev',
        database: 'luxe',
    });
}

export async function chunkById(lastId: number, limit: number = 1000): Promise<IMonolithCustomer[]> {
    const connection = await getConnection();

    let [rows, _]: any = await connection.query(`
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

    connection.end();

    return rows;
}

export async function getCustomerCount(): Promise<number> {
    const connection = await getConnection();

    let [rows, _]: any = await connection.query('SELECT COUNT(*) as customerCount FROM customers')

    connection.end();

    return rows[0].customerCount;
}