import {IMonolithDiscussion} from "../types/MonolithDiscussion";
import {pool} from "./mysql";

export async function chunkById(lastId: number, limit: number = 1000): Promise<IMonolithDiscussion[]> {
    let rows = [];

    try {
        let [results, _]: any = await pool.query(`
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

        rows = results;
    } catch (err) {
        console.error(err);
    }

    return rows;
}

export async function getDiscussionCount(): Promise<number> {
    let [rows, _]: any = await pool.query('SELECT COUNT(*) as discussionCount FROM discussions WHERE discussion_uuid <> ""')

    return rows[0].discussionCount;
}