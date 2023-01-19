import MonolithCustomerRepository from "../repository/MonolithCustomerRepository";
import * as MonolithCustomerService from "../services/MonolithCustomerService";
import {PrismaClient} from "@prisma/client";
import {IMonolithCustomer} from "../types/MonolithCustomer";
import {pool} from "../repository/mysql";

async function main() {
    const prisma = new PrismaClient()
    const monolithCustomerRepository = new MonolithCustomerRepository(pool);

    const total = monolithCustomerRepository.getCustomerCount();

    let lastId = 0;
    let processed = 0;
    let process = true;

    while (process) {
        try {
            const monolithCustomerRows: IMonolithCustomer[] = await monolithCustomerRepository.chunkById(lastId);

            if (monolithCustomerRows.length === 0) {
                process = false;
                break;
            }

            const processedRows = await MonolithCustomerService.processRows(prisma, monolithCustomerRows);

            const highestIdInResultSet = monolithCustomerRows.at(-1)?.customer_id;
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
        console.log('Processed all customers')
        process.exit(0);
    })
    .catch(err => {
        console.error(err)
        process.exit(1);
    });