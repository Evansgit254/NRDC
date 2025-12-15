import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
    // Create Admin User
    const hashedPassword = await bcrypt.hash('admin123', 10)
    const admin = await prisma.user.upsert({
        where: { email: 'admin@nrdc.org' },
        update: {},
        create: {
            email: 'admin@nrdc.org',
            name: 'Admin User',
            password: hashedPassword,
            role: 'ADMIN',
        },
    })
    console.log({ admin })

    // Create Programs
    const programs = [
        {
            title: 'Emergency Nutrition Support',
            slug: 'emergency-nutrition-support',
            description: 'Providing immediate nutritional assistance to displaced families.',
            objectives: JSON.stringify(['Reduce malnutrition', 'Provide supplements']),
            photos: JSON.stringify([]),
            metrics: JSON.stringify({ beneficiaries: 5000, meals: 15000 }),
        },
        {
            title: 'Community Gardens',
            slug: 'community-gardens',
            description: 'Empowering communities to grow their own food.',
            objectives: JSON.stringify(['Sustainable food source', 'Skill building']),
            photos: JSON.stringify([]),
            metrics: JSON.stringify({ gardens: 10, families: 200 }),
        },
    ]

    for (const p of programs) {
        await prisma.program.upsert({
            where: { slug: p.slug },
            update: {},
            create: p,
        })
    }

    // Create Sample Blog Post
    await prisma.blogPost.upsert({
        where: { slug: 'welcome-to-nrdc' },
        update: {},
        create: {
            title: 'Welcome to NRDC',
            slug: 'welcome-to-nrdc',
            content: 'We are dedicated to supporting refugees and displaced communities.',
            category: 'News',
            published: true,
        },
    })

    // Create Team Members
    const teamMembers = [
        {
            name: 'Dr. Sarah Amina',
            title: 'Executive Director',
            bio: 'Over 15 years of experience in humanitarian work and nutrition programs.',
            imageUrl: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
            order: 1,
            active: true,
        },
        {
            name: 'James Ochieng',
            title: 'Program Director',
            bio: 'Specializes in community-based nutrition interventions.',
            imageUrl: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
            order: 2,
            active: true,
        },
        {
            name: 'Grace Wanjiku',
            title: 'Operations Manager',
            bio: 'Ensures efficient delivery of programs to communities in need.',
            imageUrl: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
            order: 3,
            active: true,
        },
    ]

    for (const member of teamMembers) {
        await prisma.teamMember.upsert({
            where: { id: member.name.toLowerCase().replace(/\s+/g, '-') },
            update: {},
            create: member,
        })
    }

    // Create Statistics
    const statistics = [
        {
            label: 'Lives Impacted',
            value: '50,000+',
            icon: 'Users',
            order: 1,
            active: true,
        },
        {
            label: 'Meals Provided',
            value: '1M+',
            icon: 'Utensils',
            order: 2,
            active: true,
        },
        {
            label: 'Community Gardens',
            value: '100+',
            icon: 'Sprout',
            order: 3,
            active: true,
        },
        {
            label: 'Partner Organizations',
            value: '25+',
            icon: 'Heart',
            order: 4,
            active: true,
        },
    ]

    for (const stat of statistics) {
        await prisma.statistic.upsert({
            where: { id: stat.label.toLowerCase().replace(/\s+/g, '-') },
            update: {},
            create: stat,
        })
    }

    // Create Resources
    const resources = [
        {
            title: 'Strategic Plan 2025-2030',
            description: 'Our comprehensive strategy for the next five years',
            fileUrl: 'https://example.com/strategic-plan.pdf',
            fileSize: '2.4 MB',
            fileType: 'PDF',
            category: 'Strategic Plan',
            active: true,
        },
        {
            title: 'Annual Report 2024',
            description: 'Complete overview of our impact in 2024',
            fileUrl: 'https://example.com/annual-report.pdf',
            fileSize: '3.1 MB',
            fileType: 'PDF',
            category: 'Annual Report',
            active: true,
        },
    ]

    for (const resource of resources) {
        await prisma.resource.upsert({
            where: { id: resource.title.toLowerCase().replace(/\s+/g, '-') },
            update: {},
            create: resource,
        })
    }

    // Create Testimonials
    const testimonials = [
        {
            name: 'Amina Hassan',
            role: 'Community Member',
            message: 'The nutrition program has transformed our community. My children are healthier and thriving.',
            rating: 5,
            status: 'APPROVED',
            order: 1,
        },
        {
            name: 'John Kamau',
            role: 'Volunteer',
            message: 'Working with NRDC has been incredibly rewarding. The impact we make is real and lasting.',
            rating: 5,
            status: 'APPROVED',
            order: 2,
        },
    ]

    for (const testimonial of testimonials) {
        await prisma.testimonial.upsert({
            where: { id: testimonial.name.toLowerCase().replace(/\s+/g, '-') },
            update: {},
            create: testimonial,
        })
    }

    // Create Site Content
    const siteContent = [
        {
            key: 'hero_title',
            value: 'Nutrition for Refugee & Displaced Communities',
            type: 'TEXT',
        },
        {
            key: 'hero_subtitle',
            value: 'Providing hope, health, and sustainable food security to those who need it most',
            type: 'TEXT',
        },
        {
            key: 'mission_statement',
            value: 'To provide nutrition, food security programs, capacity building, and community health support to refugees and displaced persons, ensuring every individual has the foundation for a healthy future.',
            type: 'TEXT',
        },
        {
            key: 'vision_statement',
            value: 'A world where every refugee and displaced person has access to adequate nutrition and the resources needed to rebuild their lives with dignity.',
            type: 'TEXT',
        },
        {
            key: 'contact_email',
            value: 'nrdcofficial12@gmail.com',
            type: 'TEXT',
        },
        {
            key: 'contact_phone',
            value: '+254 727 001 702 / +254 702 121 310',
            type: 'TEXT',
        },
        {
            key: 'contact_address',
            value: 'Nairobi, Kenya',
            type: 'TEXT',
        },
    ]

    for (const content of siteContent) {
        await prisma.siteContent.upsert({
            where: { key: content.key },
            update: {},
            create: content,
        })
    }

    console.log('Seeding finished.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
