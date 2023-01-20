import { PrismaClient } from '@prisma/client'

class Prisma{
    private static clientInstance: PrismaClient | null = null

    static get client(): PrismaClient
    {
        if(Prisma.clientInstance === null){
            Prisma.clientInstance = new PrismaClient()
        }

        return Prisma.clientInstance
    }
}

export default Prisma
