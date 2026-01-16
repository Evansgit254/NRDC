const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    console.log('--- Latest Error Logs ---')
    const logs = await prisma.errorLog.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' }
    })
    console.log(JSON.stringify(logs, null, 2))

    console.log('\n--- Recent Audit Logs ---')
    const auditLogs = await prisma.auditLog.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' }
    })
    console.log(JSON.stringify(auditLogs, null, 2))
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
