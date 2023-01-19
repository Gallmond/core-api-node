import MonolithCustomerRepository from "../repository/MonolithCustomerRepository";
import MonolithCustomerService from "../services/MonolithCustomerService";
import {PrismaClient} from "@prisma/client";
import {IMonolithCustomer} from "../types/MonolithCustomer";
import {pool} from "../repository/mysql";
import CustomerRepository from "../repository/CustomerRepository";

async function main() {
    const prisma = new PrismaClient()

    const monolithCustomerRepository = new MonolithCustomerRepository(pool);
    const customerRepository = new CustomerRepository(prisma);
    const monolithCustomerService = new MonolithCustomerService(customerRepository);

    const total = await monolithCustomerRepository.getCustomerCount();

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

            const processedRows = await monolithCustomerService.processRows(monolithCustomerRows);

            const highestIdInResultSet = monolithCustomerRows.at(-1)?.customer_id;
            if (highestIdInResultSet) {
                lastId = highestIdInResultSet;
            }

            processed += monolithCustomerRows.length;

            console.log(`Processed ${processed}/${total} rows (${processedRows} inserts from batch)`);
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