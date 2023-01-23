//@ts-check
const { randomBytes } = require('node:crypto')
const Prisma = require('../dist/repository/Prisma').default
const DiscussionState = require('../dist/enums/DiscussionState')

const createTestDiscussionWithMessages = async () => {

    const randomIdentifier = randomBytes(10).toString('hex') 

    // create two users
    const aliceData = {
        email: `alice@${randomIdentifier}.com`,
        first_name: 'somehashedstring',
        password: 'somehashedstring'
    }
    const alice = await Prisma.client.customer.create({
        data: aliceData
    })

    const bobData = {
        email: `alice@${randomIdentifier}.com`,
        first_name: 'somehashedstring',
        password: 'somehashedstring'
    }
    const bob = await Prisma.client.customer.create({
        data: bobData
    })

    // create a discussion
    const discussionData = {
        initiator_id: bob.id,
        state: DiscussionState['discuss'],
    }
    const discussion = await Prisma.client.discussion.create({
        data: discussionData
    })

    // create the pivot table links
    const alicePivot = await Prisma.client.customerdiscussion.create({
        //TODO write this
    })

    // add one message each

}

module.exports = {

}
