import {PrismaClient} from "@prisma/client";
import {IMonolithCustomer} from "../types/MonolithCustomer";

export async function processRows(prisma: PrismaClient, rows: IMonolithCustomer[]): Promise<number> {
    try {
        await prisma.customer.createMany({
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

        prisma.$disconnect();
    } catch (err) {
        console.error(err);
        prisma.$disconnect();
    }

    return rows.length;
}