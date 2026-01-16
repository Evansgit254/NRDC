const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')

const prisma = new PrismaClient()

async function main() {
    console.log('Seeding admin user...')

    const email = process.env.ADMIN_EMAIL || 'admin@nrdc.org'
    const password = process.env.ADMIN_PASSWORD || 'admin123'
    const hashedPassword = await bcrypt.hash(password, 10)

    const existingUser = await prisma.user.findUnique({
        where: { email }
    })

    if (!existingUser) {
        await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name: 'Admin User',
                role: 'ADMIN'
            }
        })
        console.log(`✅ Admin user created: ${email}`)
    } else {
        console.log(`→ Admin user already exists: ${email}`)
        // Update password just in case
        await prisma.user.update({
            where: { email },
            data: { password: hashedPassword }
        })
        console.log('✓ Admin password updated')
    }
}

main()
    .catch((e) => {
        console.error('❌ Error seeding admin:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
