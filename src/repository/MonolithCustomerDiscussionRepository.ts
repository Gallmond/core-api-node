import {IMonolithDiscussion} from "../types/MonolithDiscussion";
import {Pool} from "mysql2/promise";
import {IMonolithCustomerDiscussion} from "../types/MonolithCustomerDiscussion";

export default class MonolithCustomerDiscussionRepository {
    #pool: Pool;

    constructor(pool: Pool) {
        this.#pool = pool;
    }

    async chunkById(lastId: number, limit: number = 1000): Promise<IMonolithCustomerDiscussion[]> {
        const [rows, _]: any = await this.#pool.query(`
            SELECT
                cd.link_id,
                cd.link_uuid,
                cd.link_customer,
                cd.link_discussion,
                cd.link_status,
                cd.link_agreed,
                cd.link_created,
                cd.link_updated,
                d.discussion_uuid,
                c.customer_uuid
            FROM
                customer_discussions cd
                    LEFT JOIN customers c ON c.customer_id = cd.link_customer
                    LEFT JOIN discussions d ON d.discussion_id = cd.link_discussion
            WHERE cd.link_id > ${lastId}
              AND cd.link_uuid <> ""
              AND d.discussion_uuid <> ""
            ORDER BY
                cd.link_id ASC
                LIMIT ${limit}
        `)

        return rows;
    }

    async getCustomerDiscussionCount(): Promise<number> {
        let [rows, _]: any = await this.#pool.query(`
            SELECT COUNT(*) as customerDiscussionCount
            FROM customer_discussions
                     LEFT JOIN discussions ON discussions.discussion_id = customer_discussions.link_discussion
            WHERE link_uuid <> ""
              AND discussion_uuid <> ""
        `)

        return rows[0].customerDiscussionCount;
    }
}