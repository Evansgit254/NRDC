const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
    console.log('Checking admin user...')

    const email = process.env.ADMIN_EMAIL || 'admin@nrdc.org'
    const user = await prisma.user.findUnique({
        where: { email }
    })

    if (user) {
        console.log('✅ Admin user found:')
        console.log(`- ID: ${user.id}`)
        console.log(`- Email: ${user.email}`)
        console.log(`- Role: ${user.role}`)
        console.log(`- Name: ${user.name}`)
    } else {
        console.error('❌ Admin user NOT found!')
    }
}

main()
    .catch((e) => {
        console.error('Error checking admin:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
