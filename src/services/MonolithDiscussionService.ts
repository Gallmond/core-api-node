import {PrismaClient} from "@prisma/client";
import {IMonolithDiscussion} from "../types/MonolithDiscussion";

export async function processRows(prisma: PrismaClient, rows: IMonolithDiscussion[]): Promise<number> {
    try {
        await prisma.discussion.createMany({
            data: rows.map(row => ({
                id: row.discussion_uuid,
                initiator_id: row.discussion_sender_uuid,
                type: row.discussion_type,
                state: row.discussion_status,
                created_at: row.discussion_created,
            })),
            skipDuplicates: true,
        });

        prisma.$disconnect();
    } catch (err) {
        console.error(err);
        prisma.$disconnect();
    }

    return rows.length;
}