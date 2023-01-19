import {PrismaClient} from '@prisma/client'
import {IDiscussionDTO} from '../types/DiscussionDTO'

export default class DiscussionRepository {
    #prisma: PrismaClient

    constructor(prisma: PrismaClient) {
        this.#prisma = prisma
    }

    async createManyFromDto(dtos: IDiscussionDTO[]) {
        const result = await this.#prisma.discussion.createMany({
            data: dtos.map(dto => ({
                id: dto.id,
                initiator_id: dto.initiatorId,
                type: dto.type,
                state: dto.state,
                created_at: dto.createdAt,
            })),
            skipDuplicates: true,
        })


        this.#prisma.$disconnect()

        return result.count
    }
}
