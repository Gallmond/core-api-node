import {Pool, RowDataPacket} from 'mysql2/promise'
import {IMonolithTrip} from '../types/MonolithTrip'

export default class MonolithTripRepository {
    #pool: Pool

    constructor(pool: Pool) {
        this.#pool = pool
    }

    async chunkById(lastId: number, limit = 1000): Promise<IMonolithTrip[]> {
        const [rows]: [RowDataPacket[], unknown] = await this.#pool.query(`
            SELECT trip_id,
                   trip_uuid,
                   trip_discussion,
                   trip_guest,
                   trip_host,
                   trip_property,
                   trip_start,
                   trip_end,
                   trip_points_value,
                   trip_created,
                   discussions.discussion_uuid,
                   guest.customer_uuid as guest_uuid,
                   host.customer_uuid as host_uuid,
                   properties.property_uuid as property_uuid
            FROM trips
                     JOIN discussions ON discussions.discussion_id = trips.trip_discussion
                     JOIN customers AS guest ON guest.customer_id = trips.trip_guest
                     JOIN customers AS host ON host.customer_id = trips.trip_host
                     JOIN properties ON properties.property_id = trips.trip_property
            WHERE trip_id > ${lastId}
              AND trip_uuid <> ""
            ORDER BY trip_id ASC LIMIT ${limit}
        `)

        return rows as IMonolithTrip[]
    }

    async getTripCount(): Promise<number> {
        const [rows]: [RowDataPacket[], unknown] = await this.#pool.query(`
            SELECT COUNT(*) as tripCount
            FROM trips
                     JOIN discussions ON discussions.discussion_id = trips.trip_discussion
                     JOIN customers AS guest ON guest.customer_id = trips.trip_guest
                     JOIN customers AS host ON host.customer_id = trips.trip_host
                     JOIN properties ON properties.property_id = trips.trip_property
            WHERE trip_uuid <> ""
        `)

        return rows[0].tripCount
    }
}
