const Prisma = require('../../dist/repository/Prisma').default
const {faker} = require('@faker-js/faker');

async function createCustomer() {
    return await Prisma.client.customer.create({
        data: {
            id: faker.datatype.uuid(),
            first_name: faker.name.firstName(),
            last_name: faker.name.lastName(),
            email: faker.internet.email(),
            password: '$2y$10$/Ufi5VoFh1c.SSYi/V0Oqulgf2/66HvsMfa4yTSZmvhd9/yWHJEza', // password
        }
    });
}

module.exports = {
    createCustomer,
}