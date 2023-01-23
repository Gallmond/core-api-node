const {v4: uuidv4} = require('uuid');
const Prisma = require('../../dist/repository/Prisma').default;
const {DiscussionState} = require('../../dist/enums/DiscussionState');
const {subMinutes} = require("date-fns");
const {createCustomer} = require("./CustomerFactory");

async function createDiscussionForCustomer(customer) {
    const now = new Date();

    const otherCustomer = await createCustomer()

    const discussion = await Prisma.client.discussion.create({
        data: {
            id: uuidv4(),
            state: DiscussionState.discuss,
            initiator: {
                connect: {
                    id: customer.id
                }
            },
            type: 'points',
            messages: {
                create: [
                    {
                        id: uuidv4(),
                        content: 'Hello',
                        content_redacted: 'Hello',
                        sender: {
                            connect: {
                                id: customer.id,
                            }
                        },
                        created_at: subMinutes(now, 1),
                    },
                    {
                        id: uuidv4(),
                        content: "Did you know that Tottenham Hotspur are the greatest team the world has ever seen?",
                        content_redacted: "Did you know that Tottenham Hotspur are the greatest team the world has ever seen?",
                        sender: {
                            connect: {
                                id: customer.id,
                            }
                        },
                        created_at: now,
                    }
                ],
            },
        }
    });

    await Prisma.client.customerDiscussion.createMany({
        data: [
            {
                id: uuidv4(),
                customer_id: customer.id,
                discussion_id: discussion.id,
                created_at: subMinutes(now, 1),
            },
            {
                id: uuidv4(),
                customer_id: otherCustomer.id,
                discussion_id: discussion.id,
                created_at: subMinutes(now, 1),
            }
        ],
    })

    await Prisma.client.trip.createMany({
        data: [
            {
                id: uuidv4(),
                discussion_id: discussion.id,
                guest_id: customer.id,
                host_id: otherCustomer.id,
                property_id: uuidv4(),
                start: now,
                end: now,
                created_at: now,
            },
            {
                id: uuidv4(),
                discussion_id: discussion.id,
                guest_id: otherCustomer.id,
                host_id: customer.id,
                property_id: uuidv4(),
                start: now,
                end: now,
                created_at: now,
            }
        ]
    })

    const messages = await Prisma.client.message.findMany({
        where: {
            discussion_id: discussion.id
        }
    });

    return {discussion, messages, otherCustomer};
}

module.exports = {
    createDiscussionForCustomer
}