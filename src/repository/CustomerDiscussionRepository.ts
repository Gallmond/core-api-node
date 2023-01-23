import {PrismaClient} from '@prisma/client'
import {ICustomerDiscussionDTO} from '../types/CustomerDiscussionDTO'

export default class CustomerDiscussionRepository {
    #prisma: PrismaClient

    constructor(prisma: PrismaClient) {
        this.#prisma = prisma
    }

    async getCustomerDiscussionsCountForCustomer(customerId: string): Promise<number> {
        return await this.#prisma.customerDiscussion.count({
            where: {
                customer_id: customerId
            }
        })
    }

    /**
     * Returns customerDiscussions from the context of a customer
     * ie: the included trip is only this customer's
     */
    async getCustomerDiscussionsForCustomer(customerId: string, skip = 0, take = 10){
        return await this.#prisma.customerDiscussion.findMany({
            skip,
            take,
            include: {
                discussion: {
                    include: {
                        initiator: true,
                        trips: {
                            where: {
                                guest_id: customerId
                            }
                        },
                        messages: true,
                        customer_discussions: {
                            include: {
                                customer: true
                            }
                        }
                    }
                }
            },
            where: {
                customer_id: customerId
            }
        })
    }

    async createManyFromDto(dtos: ICustomerDiscussionDTO[]) {
        const result = await this.#prisma.customerDiscussion.createMany({
            data: dtos.map(dto => ({
                id: dto.id,
                customer_id: dto.customerId,
                discussion_id: dto.discussionId,
                created_at: dto.createdAt,
                agreed_at: dto.agreedAt,
                deleted_at: dto.deletedAt,
            })),
            skipDuplicates: true,
        })


        this.#prisma.$disconnect()

        return result.count
    }
}
