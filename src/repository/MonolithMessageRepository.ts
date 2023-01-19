import {Pool, RowDataPacket} from 'mysql2/promise'
import {IMonolithMessage} from '../types/MonolithMessage'

export default class MonolithMessageRepository {
    #pool: Pool

    constructor(pool: Pool) {
        this.#pool = pool
    }

    async chunkById(lastId: number, limit = 1000): Promise<IMonolithMessage[]> {
        const [rows]: [RowDataPacket[], unknown] = await this.#pool.query(`
            SELECT message_id,
                   message_uuid,
                   message_from,
                   message_message,
                   message_redacted,
                   message_created,
                   message_read,
                   discussion_uuid,
                   customer_uuid as from_uuid
            FROM discussion_messages
                     LEFT JOIN discussions ON discussions.discussion_id = discussion_messages.message_discussion
                     LEFT JOIN customers ON customers.customer_id = discussion_messages.message_from
            WHERE message_id > ${lastId}
              AND message_uuid <> ""
            ORDER BY message_id ASC LIMIT ${limit}
        `)

        return rows as IMonolithMessage[]
    }

    async getMessageCount(): Promise<number> {
        const [rows]: [RowDataPacket[], unknown] = await this.#pool.query('SELECT COUNT(*) as messageCount FROM discussion_messages WHERE message_uuid <> ""')

        return rows[0].messageCount
    }
}
