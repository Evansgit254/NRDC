const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const ads = await prisma.advertisement.findMany({
        where: { active: true }
    })

    console.log('Found ads:', ads.length)
    for (const ad of ads) {
        console.log('--- Ad: ' + ad.name + ' ---')
        console.log(ad.code)
        console.log('---------------------------')
    }
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
