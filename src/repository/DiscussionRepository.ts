import {Discussion, PrismaClient} from '@prisma/client'
import {IDiscussionDTO} from '../types/DiscussionDTO'

export default class DiscussionRepository {
    #prisma: PrismaClient

    constructor(prisma: PrismaClient) {
        this.#prisma = prisma
    }

    async createManyFromDto(dtos: IDiscussionDTO[]): Promise<number> {
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

    async findForCustomerById(customerId: string, discussionId: string): Promise<Discussion | null> {
        const discussion = await this.#prisma.discussion.findFirst({
            where: {
                id: discussionId,
                customer_discussions: {
                    some: {
                        customer_id: customerId,
                    }
                }
            },
        })

        this.#prisma.$disconnect()

        return discussion
    }
}
