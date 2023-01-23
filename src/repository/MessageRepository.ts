import {Message, PrismaClient} from '@prisma/client'
import {IMessageDTO} from '../types/MessageDTO'

export default class MessageRepository {
    #prisma: PrismaClient

    constructor(prisma: PrismaClient) {
        this.#prisma = prisma
    }

    async createManyFromDto(dtos: IMessageDTO[]) {
        const result = await this.#prisma.message.createMany({
            data: dtos.map(dto => ({
                id: dto.id,
                discussion_id: dto.discussionId,
                sender_id: dto.senderId,
                content: dto.content,
                content_redacted: dto.content_redacted,
                created_at: dto.created_at,
                read_at: dto.read_at,
            })),
            skipDuplicates: true,
        })


        this.#prisma.$disconnect()

        return result.count
    }

    async paginateForDiscussion(discussionId: string, limit = 15): Promise<Message[]> {
        const messages = await this.#prisma.message.findMany({
            where: {
                discussion_id: discussionId,
            },
            take: limit,
            orderBy: {
                created_at: 'desc',
            },
        })

        this.#prisma.$disconnect()

        return messages
    }
}
