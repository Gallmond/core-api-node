import {PrismaClient} from "@prisma/client";
import {IMonolithCustomer} from "../types/MonolithCustomer";

export default class CustomerRepository {
    #prisma: PrismaClient;

    constructor(prismaClient: PrismaClient) {
        this.#prisma = prismaClient;
    }

    async createManyFromMonolithCustomers(rows: IMonolithCustomer[]): Promise<number> {
        const result = await this.#prisma.customer.createMany({
            data: rows.map(row => ({
                id: row.customer_uuid,
                first_name: row.customer_firstname,
                last_name: row.customer_lastname,
                email: row.customer_email,
                password: row.customer_password,
                created_at: row.customer_created,
            })),
            skipDuplicates: true,
        });


        this.#prisma.$disconnect();

        return result.count;
    }
}