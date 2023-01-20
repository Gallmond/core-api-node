import {PrismaClient} from '@prisma/client'
import {pool} from '../repository/mysql'
import MonolithTripRepository from "../repository/MonolithTripRepository";
import TripRepository from "../repository/TripRepository";
import MonolithTripService from "../services/MonolithTripService";
import {IMonolithTrip} from "../types/MonolithTrip";

async function main() {
    const prisma = new PrismaClient()

    const monolithTripRepository = new MonolithTripRepository(pool)
    const tripRepository = new TripRepository(prisma)
    const monolithTripService = new MonolithTripService(tripRepository)

    const total = await monolithTripRepository.getTripCount()

    let lastId = 0
    let processed = 0
    let process = true

    while (process) {
        try {
            const monolithTripRows: IMonolithTrip[] = await monolithTripRepository.chunkById(lastId)

            if (monolithTripRows.length === 0) {
                process = false
                break
            }

            const processedRows = await monolithTripService.processRows(monolithTripRows)

            const highestIdInResultSet = monolithTripRows.at(-1)?.trip_id
            if (highestIdInResultSet) {
                lastId = highestIdInResultSet
            }

            processed += monolithTripRows.length

            console.log(`Processed ${processed}/${total} rows (${processedRows} inserts from batch)`)
        } catch (err) {
            console.error(err)
        }
    }
}

main()
    .then(() => {
        console.log('Processed all trips')
        process.exit(0)
    })
    .catch(err => {
        console.error(err)
        process.exit(1)
    })
