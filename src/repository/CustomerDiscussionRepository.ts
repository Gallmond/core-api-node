import {PrismaClient} from "@prisma/client";
import {IDiscussionDTO} from "../types/DiscussionDTO";
import {ICustomerDiscussionDTO} from "../types/CustomerDiscussionDTO";

export default class CustomerDiscussionRepository {
    #prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.#prisma = prisma;
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
        });


        this.#prisma.$disconnect();

        return result.count;
    }
}