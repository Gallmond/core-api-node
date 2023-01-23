const Prisma = require('../../dist/repository/Prisma').default

async function tearDown() {
    const deleteCustomerDiscussion = Prisma.client.customerDiscussion.deleteMany()
    const deleteMessage = Prisma.client.message.deleteMany()
    const deleteTrip = Prisma.client.trip.deleteMany()
    const deleteDiscussionEvent = Prisma.client.discussionEvent.deleteMany()
    const deleteDiscussion = Prisma.client.discussion.deleteMany()
    const deleteCustomer = Prisma.client.customer.deleteMany()

    await Prisma.client.$transaction([
        deleteCustomerDiscussion,
        deleteMessage,
        deleteTrip,
        deleteDiscussionEvent,
        deleteDiscussion,
        deleteCustomer,
    ])

    await Prisma.client.$disconnect()
}

module.exports = {
    tearDown
}