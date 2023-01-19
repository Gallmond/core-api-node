import MonolithDiscussionRepository from "../repository/MonolithDiscussionRepository";
import {PrismaClient} from "@prisma/client";
import {IMonolithDiscussion} from "../types/MonolithDiscussion";
import MonolithDiscussionService from "../services/MonolithDiscussionService";
import {pool} from "../repository/mysql";
import DiscussionRepository from "../repository/DiscussionRepository";

async function main() {
    const prisma = new PrismaClient()

    const monolithDiscussionRepository = new MonolithDiscussionRepository(pool);
    const discussionRepository = new DiscussionRepository(prisma);
    const monolithDiscussionService = new MonolithDiscussionService(discussionRepository);

    const total = await monolithDiscussionRepository.getDiscussionCount();

    let lastId = 0;
    let processed = 0;
    let process = true;

    while (process) {
        try {
            const monolithDiscussionRows: IMonolithDiscussion[] = await monolithDiscussionRepository.chunkById(lastId);

            if (monolithDiscussionRows.length === 0) {
                process = false;
                break;
            }

            const processedRows = await monolithDiscussionService.processRows(monolithDiscussionRows);

            const highestIdInResultSet = monolithDiscussionRows.at(-1)?.discussion_id;
            if (highestIdInResultSet) {
                lastId = highestIdInResultSet;
            }

            processed += monolithDiscussionRows.length

            console.log(`Processed ${processed}/${total} rows (${processedRows} inserts from batch)`);
        } catch (err) {
            console.error(err);
        }
    }
}

main()
    .then(() => {
        console.log('Processed all discussions')
        process.exit(0);
    })
    .catch(err => {
        console.error(err)
        process.exit(1);
    });