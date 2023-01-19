import {PrismaClient} from '@prisma/client'
import {pool} from '../repository/mysql'
import {IMonolithMessage} from '../types/MonolithMessage'
import MonolithMessageRepository from '../repository/MonolithMessageRepository'
import MessageRepository from '../repository/MessageRepository'
import MonolithMessageService from '../services/MonolithMessageService'

async function main() {
    const prisma = new PrismaClient()

    const monolithMessageRepository = new MonolithMessageRepository(pool)
    const messageRepository = new MessageRepository(prisma)
    const monolithMessageService = new MonolithMessageService(messageRepository)

    const total = await monolithMessageRepository.getMessageCount()

    let lastId = 0
    let processed = 0
    let process = true

    while (process) {
        try {
            const monolithMessageRows: IMonolithMessage[] = await monolithMessageRepository.chunkById(lastId)

            if (monolithMessageRows.length === 0) {
                process = false
                break
            }

            const processedRows = await monolithMessageService.processRows(monolithMessageRows)

            const highestIdInResultSet = monolithMessageRows.at(-1)?.message_id
            if (highestIdInResultSet) {
                lastId = highestIdInResultSet
            }

            processed += monolithMessageRows.length

            console.log(`Processed ${processed}/${total} rows (${processedRows} inserts from batch)`)
        } catch (err) {
            console.error(err)
        }
    }
}

main()
    .then(() => {
        console.log('Processed all messages')
        process.exit(0)
    })
    .catch(err => {
        console.error(err)
        process.exit(1)
    })
