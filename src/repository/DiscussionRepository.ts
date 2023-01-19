import {IMonolithDiscussion} from "../types/MonolithDiscussion";
import {PrismaClient} from "@prisma/client";

export default class DiscussionRepository {
    #prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.#prisma = prisma;
    }

    async createManyFromMonolithDiscussions(rows: IMonolithDiscussion[]) {
        const result = await this.#prisma.discussion.createMany({
            data: rows.map(row => ({
                id: row.discussion_uuid,
                initiator_id: row.discussion_sender_uuid,
                type: row.discussion_type,
                state: row.discussion_status,
                created_at: row.discussion_created,
            })),
            skipDuplicates: true,
        });


        this.#prisma.$disconnect();

        return result.count;
    }
}