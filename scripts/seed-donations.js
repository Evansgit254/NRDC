const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
    console.log('Seeding donation data...')

    // Seed donation tiers
    const existingTiers = await prisma.donationTier.count()
    if (existingTiers === 0) {
        await prisma.donationTier.createMany({
            data: [
                {
                    amount: 25,
                    description: 'Provides nutritious meals for a family of 4 for one week',
                    isPopular: false,
                    order: 1
                },
                {
                    amount: 50,
                    description: 'Supplies emergency food packages for 3 families',
                    isPopular: false,
                    order: 2
                },
                {
                    amount: 100,
                    description: 'Funds a month of nutrition education for a community',
                    isPopular: true,
                    order: 3
                },
                {
                    amount: 250,
                    description: 'Equips a mobile health clinic for one week',
                    isPopular: false,
                    order: 4
                },
                {
                    amount: 500,
                    description: 'Supports a community garden project for one season',
                    isPopular: false,
                    order: 5
                },
                {
                    amount: 1000,
                    description: 'Sponsors comprehensive nutrition program for 50 children',
                    isPopular: false,
                    order: 6
                }
            ]
        })
        console.log('✓ Created 6 donation tiers')
    } else {
        console.log(`→ Skipping tiers (${existingTiers} already exist)`)
    }

    // Seed donation stats
    const existingStats = await prisma.donationStat.count()
    if (existingStats === 0) {
        await prisma.donationStat.createMany({
            data: [
                {
                    value: '95%',
                    label: 'Goes directly to programs',
                    order: 1
                },
                {
                    value: '50K+',
                    label: 'People helped annually',
                    order: 2
                },
                {
                    value: '12',
                    label: 'Countries reached',
                    order: 3
                },
                {
                    value: '100%',
                    label: 'Transparency guaranteed',
                    order: 4
                }
            ]
        })
        console.log('✓ Created 4 donation statistics')
    } else {
        console.log(`→ Skipping stats (${existingStats} already exist)`)
    }

    console.log('\n✅ Donation seeding complete!')
}

main()
    .catch((e) => {
        console.error('❌ Error seeding donations:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
