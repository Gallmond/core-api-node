import {Pool, RowDataPacket} from 'mysql2/promise'
import {LegacyMonolithDiscussionEvents} from '../enums/LegacyMonolithDiscussionEvents'
import {IMonolithDiscussionEvent} from '../types/MonolithDiscussionEvent'

export default class MonolithDiscussionEventRepository {
    #pool: Pool

    constructor(pool: Pool) {
        this.#pool = pool
    }

    async chunkById(lastId: number, limit = 1000): Promise<IMonolithDiscussionEvent[]> {
        const legacyEventString = Object.values(LegacyMonolithDiscussionEvents).map(eventName => `'${eventName}'`).join(',')

        const [rows]: [RowDataPacket[], unknown] = await this.#pool.query(`
            SELECT event_id,
                   event_uuid,
                   event_event,
                   event_params,
                   event_created,
                   customers.customer_uuid     as customer_uuid,
                   discussions.discussion_uuid as discussion_uuid
            FROM discussion_events
                     JOIN discussions ON discussions.discussion_id = discussion_events.event_discussion
                     LEFT JOIN customers ON customers.customer_id = discussion_events.event_customer
            WHERE event_id > ${lastId}
              AND event_uuid <> ""
              AND discussion_uuid <> ""
              AND event_event NOT IN (${legacyEventString})
            ORDER BY event_id ASC LIMIT ${limit}
        `)

        return rows as IMonolithDiscussionEvent[]
    }

    async getEventCount(): Promise<number> {
        const legacyEventString = Object.values(LegacyMonolithDiscussionEvents).map(eventName => `'${eventName}'`).join(',')

        const [rows]: [RowDataPacket[], unknown] = await this.#pool.query(`
            SELECT COUNT(*) as eventCount
            FROM discussion_events
                     JOIN discussions ON discussions.discussion_id = discussion_events.event_discussion
            WHERE event_uuid <> ""
              AND discussion_uuid <> ""
              AND event_event NOT IN (${legacyEventString})
        `)

        return rows[0].eventCount
    }
}
