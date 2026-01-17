import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
    // Clear existing data to prevent duplicates
    console.log('Clearing existing data...')
    await prisma.teamMemberTranslation.deleteMany({})
    await prisma.teamMember.deleteMany({})
    await prisma.statisticTranslation.deleteMany({})
    await prisma.statistic.deleteMany({})
    await prisma.resourceTranslation.deleteMany({})
    await prisma.resource.deleteMany({})
    await prisma.testimonialTranslation.deleteMany({})
    await prisma.testimonial.deleteMany({})
    await prisma.siteContentTranslation.deleteMany({})
    await prisma.siteContent.deleteMany({})
    await prisma.donationTierTranslation.deleteMany({})
    await prisma.donationTier.deleteMany({})
    await prisma.donationStatTranslation.deleteMany({})
    await prisma.donationStat.deleteMany({})
    await prisma.bankDetails.deleteMany({})
    await prisma.program.deleteMany({})
    await prisma.programTranslation.deleteMany({})

    // Create Admin User
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@nrdc.org'
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'
    const hashedPassword = await bcrypt.hash(adminPassword, 10)
    const admin = await prisma.user.upsert({
        where: { email: adminEmail },
        update: {},
        create: {
            email: adminEmail,
            name: 'Admin User',
            password: hashedPassword,
            role: 'ADMIN',
        },
    })
    console.log({ admin })

    // Create Programs from en.json
    const programs = [
        {
            title: 'Emergency Nutrition',
            slug: 'emergency-nutrition',
            description: 'Immediate food assistance for families in crisis zones.',
            objectives: JSON.stringify(['Reduce malnutrition', 'Provide supplements', 'Emergency relief']),
            photos: JSON.stringify(['https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800']),
            metrics: JSON.stringify({ beneficiaries: 5000, meals: 15000 }),
        },
        {
            title: 'Community Gardens',
            slug: 'community-gardens',
            description: 'Teaching sustainable farming to ensure long-term food security.',
            objectives: JSON.stringify(['Sustainable food source', 'Skill building', 'Community resilience']),
            photos: JSON.stringify(['https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=800']),
            metrics: JSON.stringify({ gardens: 10, families: 200 }),
        },
        {
            title: 'Mobile Health Clinics',
            slug: 'mobile-health-clinics',
            description: 'Bringing essential medical care to remote displaced communities.',
            objectives: JSON.stringify(['Primary healthcare', 'Vaccinations', 'Maternal health']),
            photos: JSON.stringify(['https://images.unsplash.com/photo-1576091160550-217359f42f8c?auto=format&fit=crop&q=80&w=800']),
            metrics: JSON.stringify({ patients: 1200, villages: 8 }),
        }
    ]

    for (const p of programs) {
        await prisma.program.upsert({
            where: { slug: p.slug },
            update: p,
            create: p,
        })
    }

    // Create Blog Posts - Expanded
    const blogPosts = [
        {
            title: 'Welcome to NRDC',
            slug: 'welcome-to-nrdc',
            content: 'We are dedicated to supporting refugees and displaced communities through our comprehensive nutrition and health programs.',
            excerpt: 'Introduction to our mission and vision for the future.',
            image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800',
            category: 'News',
            published: true,
        },
        {
            title: 'Success Story: Community Garden',
            slug: 'success-community-garden',
            content: 'Our recent harvest has provided fresh vegetables for over 200 families in the camp.',
            excerpt: 'How sustainable farming is changing lives in the camp.',
            image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=800',
            category: 'Stories',
            published: true,
        },
        {
            title: 'Emergency Relief Update',
            slug: 'emergency-relief-update',
            content: 'We have successfully distributed over 5000 nutritious meals this month.',
            excerpt: 'Monthly report on our emergency nutrition efforts.',
            image: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&q=80&w=800',
            category: 'Updates',
            published: true,
        },
        {
            title: 'New Water Borehole Project',
            slug: 'water-borehole-project-launch',
            content: 'Access to clean water is a fundamental right. We are excited to announce the launch of our new borehole project in Turkana.',
            excerpt: 'Bringing clean water to 5,000 residents in arid regions.',
            image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&q=80&w=800',
            category: 'Projects',
            published: true,
        },
        {
            title: 'Maternal Health Awareness Week',
            slug: 'maternal-health-week',
            content: 'Join us as we conduct workshops and free checkups for expectant mothers in the refugee settlement.',
            excerpt: 'Empowering mothers with knowledge and healthcare support.',
            image: 'https://images.unsplash.com/photo-1576487248805-cf45f6bcc67f?auto=format&fit=crop&q=80&w=800',
            category: 'Events',
            published: true,
        },
        {
            title: 'Education for All: Scholarship Drive',
            slug: 'education-scholarship-drive',
            content: 'We are raising funds to send 50 bright students to secondary school this year. Your support changes futures.',
            excerpt: 'Help us send 50 children to school this term.',
            image: 'https://images.unsplash.com/photo-1509091873295-a3550a3c77ea?auto=format&fit=crop&q=80&w=800',
            category: 'Campaigns',
            published: true,
        },
        {
            title: 'Volunteer Spotlight: Sarah\'s Journey',
            slug: 'volunteer-spotlight-sarah',
            content: 'Sarah has been volunteering with our nutrition program for 2 years. Read about her inspiring work.',
            excerpt: 'Meet the people making a difference on the ground.',
            image: 'https://images.unsplash.com/photo-1556761175-5973cf0f32e7?auto=format&fit=crop&q=80&w=800',
            category: 'Stories',
            published: true,
        },
        {
            title: 'Climate Resilience Workshop',
            slug: 'climate-resilience-workshop',
            content: 'Training community leaders on adapting agriculture to changing weather patterns.',
            excerpt: 'Building long-term resilience against climate change.',
            image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800',
            category: 'News',
            published: true,
        },
        {
            title: 'Annual Health Checkup Drive',
            slug: 'annual-health-checkup',
            content: 'Our mobile clinics successfully screened over 1,000 individuals for common ailments last week.',
            excerpt: 'Mobile clinics reaching the most remote areas.',
            image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800',
            category: 'Health',
            published: true,
        },
        {
            title: 'Partnership Announcement: WHO',
            slug: 'partnership-announcement-who',
            content: 'We are proud to announce a new strategic partnership to enhance our disease prevention capabilities.',
            excerpt: 'Strengthening our impact through global collaboration.',
            image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=800',
            category: 'News',
            published: true,
        }
    ]

    for (const post of blogPosts) {
        await prisma.blogPost.upsert({
            where: { slug: post.slug },
            update: post,
            create: post,
        })
    }

    // Create Gallery Images - Expanded
    const galleryImages = [
        { url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800', caption: 'Community Support', category: 'Community' },
        { url: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=800', caption: 'Food Distribution', category: 'Field Work' },
        { url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800', caption: 'Sustainable Farming', category: 'Field Work' },
        { url: 'https://images.unsplash.com/photo-1584820927498-cfe5bae427d2?auto=format&fit=crop&q=80&w=800', caption: 'Medical Checkups', category: 'Health' },
        { url: 'https://images.unsplash.com/photo-1509091873295-a3550a3c77ea?auto=format&fit=crop&q=80&w=800', caption: 'Education Program', category: 'Education' },
        { url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=800', caption: 'Youth Activities', category: 'Events' },
        { url: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&q=80&w=800', caption: 'Clean Water Project', category: 'Field Work' },
        { url: 'https://images.unsplash.com/photo-1518105570919-e342af1a8275?auto=format&fit=crop&q=80&w=800', caption: 'Women Empowerment', category: 'Community' },
        { url: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=800', caption: 'Staff Meeting', category: 'Events' },
        { url: 'https://images.unsplash.com/photo-1529390003361-5ed482af75f2?auto=format&fit=crop&q=80&w=800', caption: 'Community Elders', category: 'Community' },
        { url: 'https://images.unsplash.com/photo-1576487248805-cf45f6bcc67f?auto=format&fit=crop&q=80&w=800', caption: 'Mobile Clinic Van', category: 'Health' },
        { url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=800', caption: 'Cultural Celebration', category: 'Events' },
        { url: 'https://images.unsplash.com/photo-1504159506876-f8338247a14a?auto=format&fit=crop&q=80&w=800', caption: 'School Lunch Program', category: 'Education' },
        { url: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=800', caption: 'Tree Planting', category: 'Field Work' },
        { url: 'https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?auto=format&fit=crop&q=80&w=800', caption: 'Joyful Moments', category: 'Community' },
        { url: 'https://images.unsplash.com/photo-1513682121497-80211f36a7d3?auto=format&fit=crop&q=80&w=800', caption: 'Skills Training', category: 'Education' },
        { url: 'https://images.unsplash.com/photo-1535796030582-8437f8841753?auto=format&fit=crop&q=80&w=800', caption: 'Distribution Center', category: 'Field Work' },
        { url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800', caption: 'Mother and Child', category: 'Health' },
    ]

    // Always clear old gallery images to avoid staleness when seeding bulk content
    await prisma.galleryImage.deleteMany({});
    await prisma.galleryImage.createMany({
        data: galleryImages
    });

    // Create Team Members with realistic placeholders
    const teamMembers = [
        {
            name: 'Dr. Sarah Amina',
            title: 'Executive Director',
            bio: 'Over 15 years of experience in humanitarian work and nutrition programs across East Africa.',
            imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
            order: 1,
            active: true,
        },
        {
            name: 'James Ochieng',
            title: 'Program Director',
            bio: 'Specializes in community-based nutrition interventions and sustainable agriculture.',
            imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400',
            order: 2,
            active: true,
        },
        {
            name: 'Grace Wanjiku',
            title: 'Operations Manager',
            bio: 'Ensures efficient delivery of programs to communities in need, managing logistics and partnerships.',
            imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400',
            order: 3,
            active: true,
        },
    ]

    for (const member of teamMembers) {
        await prisma.teamMember.create({
            data: {
                ...member,
                id: member.name.toLowerCase().replace(/\s+/g, '-')
            }
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
            fileUrl: '',
            fileSize: '2.4 MB',
            fileType: 'PDF',
            category: 'Strategic Plan',
            active: true,
        },
        {
            title: 'Annual Report 2024',
            description: 'Complete overview of our impact in 2024',
            fileUrl: '',
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

    // Create Site Content from en.json
    const siteContent = [
        {
            key: 'hero_title',
            value: 'Nourishing Hope in Displaced Communities',
            type: 'TEXT',
        },
        {
            key: 'hero_subtitle',
            value: 'Providing essential nutrition, food security, and health support to those who need it most.',
            type: 'TEXT',
        },
        {
            key: 'mission_statement',
            value: 'To provide nutrition, food security programs, capacity building, and community health support to refugees and displaced persons.',
            type: 'TEXT',
        },
        {
            key: 'vision_statement',
            value: 'A world where displaced communities have the resources and support to thrive independently.',
            type: 'TEXT',
        },
        {
            key: 'core_values',
            value: 'Integrity, Compassion, Sustainability, Accountability, Empowerment',
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

    // Create Bank Details
    await prisma.bankDetails.create({
        data: {
            accountName: 'NRDC',
            accountNumber: '01207150002',
            branch: 'Nairobi',
            bankCode: '19',
            branchCode: '000',
            swiftCode: 'AFRIKENX',
            phoneNumber: '972900',
            bankName: 'ABC Bank',
            active: true
        }
    })

    // Create Donation Tiers
    const tiers = [
        { amount: 500, description: 'Provides meals for a family for 3 days', isPopular: false, order: 1 },
        { amount: 1000, description: 'Provides clean water for a community for a week', isPopular: true, order: 2 },
        { amount: 5000, description: 'Supports a child\'s education for a term', isPopular: false, order: 3 },
    ]

    // Better Donation Tier Seeding Logic
    const existingTiers = await prisma.donationTier.count();
    if (existingTiers === 0) {
        await prisma.donationTier.createMany({
            data: tiers
        });
    }

    // Create Donation Stats
    const donationStats = [
        { value: '95%', label: 'Goes directly to programs', order: 1 },
        { value: '50K+', label: 'People helped annually', order: 2 },
        { value: '12', label: 'Countries reached', order: 3 },
        { value: '100%', label: 'Transparency guaranteed', order: 4 },
    ]

    await prisma.donationStat.createMany({
        data: donationStats
    });

    // Seed Translations for Programs
    console.log('Seeding Program translations...');
    const programTranslations = {
        'emergency-nutrition': {
            fr: {
                title: 'Nutrition d\'Urgence',
                description: 'Aide alimentaire immédiate pour les familles dans les zones de crise.'
            },
            es: {
                title: 'Nutrición de Emergencia',
                description: 'Asistencia alimentaria inmediata para familias en zonas de crisis.'
            },
            ar: {
                title: 'تغذية الطوارئ',
                description: 'مساعدة غذائية فورية للعائلات في مناطق الأزمات.'
            }
        },
        'community-gardens': {
            fr: {
                title: 'Jardins Communautaires',
                description: 'Enseigner l\'agriculture durable pour assurer la sécurité alimentaire à long terme.'
            },
            es: {
                title: 'Huertos Comunitarios',
                description: 'Enseñando agricultura sostenible para garantizar la seguridad alimentaria a largo plazo.'
            },
            ar: {
                title: 'الحدائق المجتمعية',
                description: 'تعليم الزراعة المستدامة لضمان الأمن الغذائي على المدى الطويل.'
            }
        },
        'mobile-health-clinics': {
            fr: {
                title: 'Cliniques Mobiles',
                description: 'Apporter des soins médicaux essentiels aux communautés déplacées isolées.'
            },
            es: {
                title: 'Clínicas Móviles de Salud',
                description: 'Llevando atención médica esencial a comunidades desplazadas remotas.'
            },
            ar: {
                title: 'العيادات الصحية المتنقلة',
                description: 'جلب الرعاية الطبية الأساسية إلى المجتمعات النازحة في المناطق النائية.'
            }
        }
    };

    for (const [slug, translations] of Object.entries(programTranslations)) {
        const program = await prisma.program.findUnique({ where: { slug } });
        if (program) {
            // Create translations for all languages
            for (const [locale, trans] of Object.entries(translations)) {
                await prisma.programTranslation.upsert({
                    where: {
                        programId_locale: {
                            programId: program.id,
                            locale: locale
                        }
                    },
                    update: trans,
                    create: {
                        ...trans,
                        programId: program.id,
                        locale: locale
                    }
                });
            }
        }
    }

    // Seed Translations for Blog Posts
    console.log('Seeding Blog Post translations...');
    const blogTranslations = {
        'welcome-to-nrdc': {
            title: 'Bienvenue au NRDC',
            content: 'Nous sommes dédiés au soutien des réfugiés et des communautés déplacées grâce à nos programmes complets de nutrition et de santé.',
            excerpt: 'Introduction à notre mission et notre vision pour l\'avenir.'
        },
        'success-community-garden': {
            title: 'Histoire de Succès : Jardin Communautaire',
            content: 'Notre récolte récente a fourni des légumes frais à plus de 200 familles dans le camp.',
            excerpt: 'Comment l\'agriculture durable change des vies dans le camp.'
        },
        'emergency-relief-update': {
            title: 'Mise à Jour des Secours d\'Urgence',
            content: 'Nous avons distribué avec succès plus de 5000 repas nutritifs ce mois-ci.',
            excerpt: 'Rapport mensuel sur nos efforts de nutrition d\'urgence.'
        }
    };

    for (const [slug, trans] of Object.entries(blogTranslations)) {
        const post = await prisma.blogPost.findUnique({ where: { slug } });
        if (post) {
            await prisma.blogPostTranslation.upsert({
                where: {
                    postId_locale: {
                        postId: post.id,
                        locale: 'fr'
                    }
                },
                update: trans,
                create: {
                    ...trans,
                    postId: post.id,
                    locale: 'fr'
                }
            });
        }
    }

    // Seed Translations for Team Members
    console.log('Seeding Team Member translations...');
    const teamTranslations = {
        'dr.-sarah-amina': { title: 'Directrice Exécutive', bio: 'Plus de 15 ans d\'expérience dans le travail humanitaire et les programmes de nutrition en Afrique de l\'Est.' },
        'james-ochieng': { title: 'Directeur de Programme', bio: 'Spécialisé dans les interventions nutritionnelles communautaires et l\'agriculture durable.' },
        'grace-wanjiku': { title: 'Responsable des Opérations', bio: 'Assure une livraison efficace des programmes aux communautés dans le besoin, gérant la logistique et les partenariats.' }
    };
    for (const [id, trans] of Object.entries(teamTranslations)) {
        const teamMember = await prisma.teamMember.findFirst({ where: { id: { contains: id } } }); // Loose match or exact if IDs are reliable
        if (teamMember) {
            await prisma.teamMemberTranslation.upsert({
                where: { teamMemberId_locale: { teamMemberId: teamMember.id, locale: 'fr' } },
                update: trans,
                create: { ...trans, teamMemberId: teamMember.id, locale: 'fr' }
            });
        }
    }

    // Seed Translations for Statistics
    console.log('Seeding Statistic translations...');
    const statTranslations = {
        'lives-impacted': { label: 'Vies Impactées' },
        'meals-provided': { label: 'Repas Fournis' },
        'community-gardens': { label: 'Jardins Communautaires' },
        'partner-organizations': { label: 'Organisations Partenaires' }
    };
    for (const [id, trans] of Object.entries(statTranslations)) {
        const stat = await prisma.statistic.findFirst({ where: { id: { contains: id } } });
        if (stat) {
            await prisma.statisticTranslation.upsert({
                where: { statisticId_locale: { statisticId: stat.id, locale: 'fr' } },
                update: trans,
                create: { ...trans, statisticId: stat.id, locale: 'fr' }
            });
        }
    }

    // Seed Translations for Resources
    console.log('Seeding Resource translations...');
    const resourceTranslations = {
        'strategic-plan-2025-2030': { title: 'Plan Stratégique 2025-2030', description: 'Notre stratégie complète pour les cinq prochaines années' },
        'annual-report-2024': { title: 'Rapport Annuel 2024', description: 'Aperçu complet de notre impact en 2024' }
    };
    for (const [id, trans] of Object.entries(resourceTranslations)) {
        const resource = await prisma.resource.findFirst({ where: { id: { contains: id } } });
        if (resource) {
            await prisma.resourceTranslation.upsert({
                where: { resourceId_locale: { resourceId: resource.id, locale: 'fr' } },
                update: trans,
                create: { ...trans, resourceId: resource.id, locale: 'fr' }
            });
        }
    }

    // Seed Translations for Testimonials
    console.log('Seeding Testimonial translations...');
    const testimonialTranslations = {
        'amina-hassan': { message: 'Le programme de nutrition a transformé notre communauté. Mes enfants sont en meilleure santé et s\'épanouissent.', role: 'Membre de la Communauté' },
        'john-kamau': { message: 'Travailler avec le NRDC a été incroyablement gratifiant. L\'impact que nous avons est réel et durable.', role: 'Bénévole' }
    };
    for (const [id, trans] of Object.entries(testimonialTranslations)) {
        const testimonial = await prisma.testimonial.findFirst({ where: { id: { contains: id } } });
        if (testimonial) {
            await prisma.testimonialTranslation.upsert({
                where: { testimonialId_locale: { testimonialId: testimonial.id, locale: 'fr' } },
                update: trans,
                create: { ...trans, testimonialId: testimonial.id, locale: 'fr' }
            });
        }
    }

    // Seed Translations for Donation Tiers
    console.log('Seeding Donation Tier translations...');
    const tierTranslations = {
        500: { description: 'Fournit des repas pour une famille pendant 3 jours' },
        1000: { description: 'Fournit de l\'eau potable à une communauté pendant une semaine' },
        5000: { description: 'Soutient l\'éducation d\'un enfant pour un trimestre' }
    };
    for (const [amount, trans] of Object.entries(tierTranslations)) {
        const tier = await prisma.donationTier.findFirst({ where: { amount: parseInt(amount) } });
        if (tier) {
            await prisma.donationTierTranslation.upsert({
                where: { donationTierId_locale: { donationTierId: tier.id, locale: 'fr' } },
                update: trans,
                create: { ...trans, donationTierId: tier.id, locale: 'fr' }
            });
        }
    }

    // Seed Translations for Site Content
    console.log('Seeding Site Content translations...');
    const contentTranslations = {
        'hero_title': { value: 'Nourrir l\'Espoir dans les Communautés Déplacées' },
        'hero_subtitle': { value: 'Fournir une nutrition essentielle, une sécurité alimentaire et un soutien sanitaire à ceux qui en ont le plus besoin.' },
        'mission_statement': { value: 'Fournir des programmes de nutrition, de sécurité alimentaire, de renforcement des capacités et de soutien sanitaire communautaire aux réfugiés et aux personnes déplacées.' },
        'vision_statement': { value: 'Un monde où les communautés déplacées disposent des ressources et du soutien nécessaires pour prospérer de manière indépendante.' },
        'core_values': { value: 'Intégrité, Compassion, Durabilité, Responsabilité, Autonomisation' }
    };
    for (const [key, trans] of Object.entries(contentTranslations)) {
        const content = await prisma.siteContent.findUnique({ where: { key } });
        if (content) {
            await prisma.siteContentTranslation.upsert({
                where: { siteContentId_locale: { siteContentId: content.id, locale: 'fr' } },
                update: trans,
                create: { ...trans, siteContentId: content.id, locale: 'fr' }
            });
        }
    }

    // Seed Translations for Donation Stats
    console.log('Seeding Donation Stat translations...');
    const donationStatTranslations = {
        'Goes directly to programs': { label: 'Va directement aux programmes' },
        'People helped annually': { label: 'Personnes aidées annuellement' },
        'Countries reached': { label: 'Pays atteints' },
        'Transparency guaranteed': { label: 'Transparence garantie' }
    };
    for (const [label, trans] of Object.entries(donationStatTranslations)) {
        const stat = await prisma.donationStat.findFirst({ where: { label } });
        if (stat) {
            await prisma.donationStatTranslation.upsert({
                where: { donationStatId_locale: { donationStatId: stat.id, locale: 'fr' } },
                update: trans,
                create: { ...trans, donationStatId: stat.id, locale: 'fr' }
            });
        }
    }

    // Seed Translations for Gallery Images
    console.log('Seeding Gallery Image translations...');
    const galleryTranslations = {
        'Community Support': 'Soutien Communautaire',
        'Food Distribution': 'Distribution de Nourriture',
        'Sustainable Farming': 'Agriculture Durable',
        'Medical Checkups': 'Bilans Médicaux',
        'Education Program': 'Programme d\'Éducation',
        'Youth Activities': 'Activités pour la Jeunesse',
        'Clean Water Project': 'Projet d\'Eau Potable',
        'Women Empowerment': 'Autonomisation des Femmes',
        'Staff Meeting': 'Réunion du Personnel',
        'Community Elders': 'Aînés de la Communauté',
        'Mobile Clinic Van': 'Fourgon de Clinique Mobile',
        'Cultural Celebration': 'Célébration Culturelle',
        'School Lunch Program': 'Programme de Déjeuner Scolaire',
        'Tree Planting': 'Plantation d\'Arbres',
        'Joyful Moments': 'Moments de Joie',
        'Skills Training': 'Formation aux Compétences',
        'Distribution Center': 'Centre de Distribution',
        'Mother and Child': 'Mère et Enfant'
    };
    for (const [caption, translatedCaption] of Object.entries(galleryTranslations)) {
        const image = await prisma.galleryImage.findFirst({ where: { caption } });
        if (image) {
            await prisma.galleryImageTranslation.upsert({
                where: { galleryImageId_locale: { galleryImageId: image.id, locale: 'fr' } },
                update: { caption: translatedCaption },
                create: { caption: translatedCaption, galleryImageId: image.id, locale: 'fr' }
            });
        }
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
