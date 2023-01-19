import {PrismaClient} from "@prisma/client";
import {pool} from "../repository/mysql";
import MonolithCustomerDiscussionRepository from "../repository/MonolithCustomerDiscussionRepository";
import CustomerDiscussionRepository from "../repository/CustomerDiscussionRepository";
import MonolithCustomerDiscussionService from "../services/MonolithCustomerDiscussionService";
import {IMonolithCustomerDiscussion} from "../types/MonolithCustomerDiscussion";

async function main() {
    const prisma = new PrismaClient()

    const monolithCustomerDiscussionRepository = new MonolithCustomerDiscussionRepository(pool);
    const customerDiscussionRepository = new CustomerDiscussionRepository(prisma);
    const monolithCustomerDiscussionService = new MonolithCustomerDiscussionService(customerDiscussionRepository);

    const total = await monolithCustomerDiscussionRepository.getCustomerDiscussionCount();

    let lastId = 0;
    let processed = 0;
    let process = true;

    while (process) {
        try {
            const monolithCustomerDiscussions: IMonolithCustomerDiscussion[] = await monolithCustomerDiscussionRepository.chunkById(lastId);

            if (monolithCustomerDiscussions.length === 0) {
                process = false;
                break;
            }

            const processedRows = await monolithCustomerDiscussionService.processRows(monolithCustomerDiscussions);

            const highestIdInResultSet = monolithCustomerDiscussions.at(-1)?.link_id;
            if (highestIdInResultSet) {
                lastId = highestIdInResultSet;
            }

            processed += monolithCustomerDiscussions.length

            console.log(`Processed ${processed}/${total} rows (${processedRows} inserts from batch)`);
        } catch (err) {
            console.error(err);
        }
    }
}

main()
    .then(() => {
        console.log('Processed all customer discussions')
        process.exit(0);
    })
    .catch(err => {
        console.error(err)
        process.exit(1);
    });