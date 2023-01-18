import {chunkById, getCustomerCount} from '../repository/monolith-customer.repository';
import {processRows} from "../services/monolith-customer.service";
import {PrismaClient} from "@prisma/client";
import {IMonolithCustomer} from "../types/MonolithCustomer";

async function main() {
    const prisma = new PrismaClient()
    const total = await getCustomerCount()

    let lastId = 1000;
    let processed = 0;

    while (processed < total) {
        try {
            const monolithCustomerRows: IMonolithCustomer[] = await chunkById(lastId);
            const processedRows = await processRows(prisma, monolithCustomerRows);

            lastId += 1000;
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
    })
    .catch(err => {
        console.error(err)
    });