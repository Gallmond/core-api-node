import {PrismaClient} from '@prisma/client'
import {IDiscussionEventDTO} from "../types/DiscussionEventDTO";

export default class DiscussionEventRepository {
    #prisma: PrismaClient

    constructor(prisma: PrismaClient) {
        this.#prisma = prisma
    }

    async createManyFromDto(dtos: IDiscussionEventDTO[]) {
        const result = await this.#prisma.discussionEvent.createMany({
            data: dtos.map(dto => ({
                id: dto.id,
                discussion_id: dto.discussionId,
                customer_id: dto.customerId,
                type: dto.type,
                parameters: dto.parameters,
                created_at: dto.createdAt,
            })),
            skipDuplicates: true,
        })


        this.#prisma.$disconnect()

        return result.count
    }
}
