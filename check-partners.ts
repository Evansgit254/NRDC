
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const partners = await prisma.partner.findMany()
    console.log('Partners count:', partners.length)
    console.log('Partners:', JSON.stringify(partners, null, 2))
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())
