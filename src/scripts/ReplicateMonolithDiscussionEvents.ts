import {PrismaClient} from '@prisma/client'
import {pool} from '../repository/mysql'
import MonolithDiscussionEventRepository from "../repository/MonolithDiscussionEventRepository";
import {IMonolithDiscussionEvent} from "../types/MonolithDiscussionEvent";
import DiscussionEventRepository from "../repository/DiscussionEventRepository";
import MonolithDiscussionEventService from "../services/MonolithDiscussionEventService";

async function main() {
    const prisma = new PrismaClient()

    const monolithDiscussionEventRepository = new MonolithDiscussionEventRepository(pool)
    const discussionEventRepository = new DiscussionEventRepository(prisma)
    const monolithDiscussionEventService = new MonolithDiscussionEventService(discussionEventRepository)

    const total = await monolithDiscussionEventRepository.getEventCount()

    let lastId = 0
    let processed = 0
    let process = true

    while (process) {
        try {
            const monolithDiscussionEventRows: IMonolithDiscussionEvent[] = await monolithDiscussionEventRepository.chunkById(lastId)

            if (monolithDiscussionEventRows.length === 0) {
                process = false
                break
            }

            const processedRows = await monolithDiscussionEventService.processRows(monolithDiscussionEventRows)

            const highestIdInResultSet = monolithDiscussionEventRows.at(-1)?.event_id
            if (highestIdInResultSet) {
                lastId = highestIdInResultSet
            }

            processed += monolithDiscussionEventRows.length

            console.log(`Processed ${processed}/${total} rows (${processedRows} inserts from batch)`)
        } catch (err) {
            console.error(err)
        }
    }
}

main()
    .then(() => {
        console.log('Processed all discussion events')
        process.exit(0)
    })
    .catch(err => {
        console.error(err)
        process.exit(1)
    })
