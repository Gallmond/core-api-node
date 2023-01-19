import {IMonolithDiscussion} from "../types/MonolithDiscussion";
import {Pool} from "mysql2/promise";

export default class MonolithDiscussionRepository {
    #pool: Pool;

    constructor(pool: Pool) {
        this.#pool = pool;
    }

    async chunkById(lastId: number, limit: number = 1000): Promise<IMonolithDiscussion[]> {
        const [rows, _]: any = await this.#pool.query(`
            SELECT discussion_id,
                   discussion_uuid,
                   discussion_type,
                   discussion_status,
                   discussion_created,
                   customers.customer_uuid as discussion_sender_uuid
            FROM discussions
                     LEFT JOIN customers ON discussion_sender = customer_id
            WHERE discussion_id > ${lastId}
              AND discussion_uuid <> ""
            ORDER BY discussion_id ASC LIMIT ${limit}
        `)

        return rows;
    }

    async getDiscussionCount(): Promise<number> {
        const [rows, _]: any = await this.#pool.query('SELECT COUNT(*) as discussionCount FROM discussions WHERE discussion_uuid <> ""')

        return rows[0].discussionCount;
    }
}