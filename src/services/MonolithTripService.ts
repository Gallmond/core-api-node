import {ITripDTO} from '../types/TripDTO'
import {IMonolithTrip} from '../types/MonolithTrip'
import TripRepository from '../repository/TripRepository'

export default class MonolithTripService {
    #tripRepository: TripRepository

    constructor(tripRepository: TripRepository) {
        this.#tripRepository = tripRepository
    }

    async processRows(rows: IMonolithTrip[]): Promise<number> {
        const tripDTOs: ITripDTO[] = rows.map(row => {
            return {
                id: row.trip_uuid,
                discussionId: row.discussion_uuid,
                guestId: row.guest_uuid,
                hostId: row.host_uuid,
                propertyId: row.property_uuid,
                startDate: row.trip_start,
                endDate: row.trip_end,
                pointsValue: row.trip_points_value,
                createdAt: row.trip_created,
            }
        })

        return await this.#tripRepository.createManyFromDto(tripDTOs)
    }
}
