const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const members = await prisma.teamMember.findMany({
        where: {
            name: {
                contains: 'Arnold'
            }
        }
    })

    console.log('Found members:', members)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
