import MonolithDiscussionRepository from "../repository/MonolithDiscussionRepository";
import {PrismaClient} from "@prisma/client";
import {IMonolithDiscussion} from "../types/MonolithDiscussion";
import * as MonolithDiscussionService from "../services/MonolithDiscussionService";
import {pool} from "../repository/mysql";

async function main() {
    const prisma = new PrismaClient()
    const monolithDiscussionRepository = new MonolithDiscussionRepository(pool);

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

            const processedRows = await MonolithDiscussionService.processRows(prisma, monolithDiscussionRows);

            const highestIdInResultSet = monolithDiscussionRows.at(-1)?.discussion_id;
            if (highestIdInResultSet) {
                lastId = highestIdInResultSet;
            }

            processed += processedRows;

            console.log(`Processed ${processed}/${total} rows`);
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