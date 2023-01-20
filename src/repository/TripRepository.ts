import {PrismaClient} from '@prisma/client'
import {ITripDTO} from '../types/TripDTO'

export default class TripRepository {
    #prisma: PrismaClient

    constructor(prisma: PrismaClient) {
        this.#prisma = prisma
    }

    async createManyFromDto(dtos: ITripDTO[]) {
        const result = await this.#prisma.trip.createMany({
            data: dtos.map(dto => ({
                id: dto.id,
                discussion_id: dto.discussionId,
                guest_id: dto.guestId,
                host_id: dto.hostId,
                property_id: dto.propertyId,
                start: dto.startDate,
                end: dto.endDate,
                points_value: dto.pointsValue,
                created_at: dto.createdAt,
            })),
            skipDuplicates: true,
        })


        this.#prisma.$disconnect()

        return result.count
    }
}
