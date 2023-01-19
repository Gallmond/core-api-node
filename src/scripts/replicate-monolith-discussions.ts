import * as MonolithDiscussionRepository from '../repository/monolith-discussion.repository';
import {PrismaClient} from "@prisma/client";
import {IMonolithDiscussion} from "../types/MonolithDiscussion";
import * as MonolithDiscussionService from "../services/monolith-discussion.service";

async function main() {
    const prisma = new PrismaClient()
    const total = await MonolithDiscussionRepository.getDiscussionCount();

    let lastId = 0;
    let processed = 0;
    let process = true;

    while (process) {
        try {
            const monolithDiscussionRows: IMonolithDiscussion[] = await MonolithDiscussionRepository.chunkById(lastId);

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