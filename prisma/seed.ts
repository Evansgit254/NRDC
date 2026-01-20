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
            title: 'Emergency Nutrition Packs',
            slug: 'emergency-nutrition-packs',
            description: 'Culturally appropriate, nutrient-dense kits for infants, pregnant women, and the elderly.',
            objectives: JSON.stringify(['Immediate nutrition support', 'Targeted kits', 'Vulnerable group care']),
            photos: JSON.stringify(['/images/emergency-packs.png']),
            metrics: JSON.stringify({ kitsDistributed: 5000, familiesReached: 2500 }),
        },
        {
            title: 'Mobile Health Clinics',
            slug: 'mobile-health-clinics',
            description: 'Teams offering screenings, supplements, and referrals for severe malnutrition cases.',
            objectives: JSON.stringify(['Primary healthcare', 'Malnutrition screening', 'Remote access']),
            photos: JSON.stringify(['/images/mobile-clinic.png']),
            metrics: JSON.stringify({ screenings: 10000, referrals: 1500 }),
        },
        {
            title: 'Nutrition Education',
            slug: 'nutrition-education',
            description: 'Workshops on meal planning with limited resources, breastfeeding support, and hygiene.',
            objectives: JSON.stringify(['Community knowledge', 'Hygiene practices', 'Breastfeeding support']),
            photos: JSON.stringify(['https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800']),
            metrics: JSON.stringify({ workshopsHeld: 150, participants: 3000 }),
        },
        {
            title: 'School Feeding Programs',
            slug: 'school-feeding-programs',
            description: 'Daily fortified meals for children in partnership with schools/NGOs.',
            objectives: JSON.stringify(['Daily nutrition', 'School retention', 'Partner collaboration']),
            photos: JSON.stringify(['https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=800']),
            metrics: JSON.stringify({ childrenFed: 12000, schoolsPartnered: 15 }),
        },
        {
            title: 'Seed & Tool Banks',
            slug: 'seed-tool-banks',
            description: 'Support urban farming in camps with drought-resistant seeds and training.',
            objectives: JSON.stringify(['Sustainable farming', 'Drought resilience', 'Camp food security']),
            photos: JSON.stringify(['https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=800']),
            metrics: JSON.stringify({ seedDistributed: '500kg', toolsProvided: 800 }),
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
            label: 'Sustainable Farming',
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

    // Create/Update Bank Details
    const existingBank = await prisma.bankDetails.findFirst({
        where: { active: true }
    });

    if (existingBank) {
        await prisma.bankDetails.update({
            where: { id: existingBank.id },
            data: {
                accountName: 'NRDC',
                accountNumber: '01207150002',
                branch: 'Nairobi',
                bankCode: '19',
                branchCode: '000',
                swiftCode: 'AFRIKENX',
                phoneNumber: '972900',
                bankName: 'Bank of Africa',
            }
        });
    } else {
        await prisma.bankDetails.create({
            data: {
                accountName: 'NRDC',
                accountNumber: '01207150002',
                branch: 'Nairobi',
                bankCode: '19',
                branchCode: '000',
                swiftCode: 'AFRIKENX',
                phoneNumber: '972900',
                bankName: 'Bank of Africa',
                active: true
            }
        });
    }

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
        'emergency-nutrition-packs': {
            fr: { title: 'Packs de Nutrition d\'Urgence', description: 'Kits denses en nutriments et culturellement appropriés pour les nourrissons, les femmes enceintes et les personnes âgées.' },
            sw: { title: 'Vifurushi vya Lishe ya Dharura', description: 'Vifurushi vyenye virutubisho vingi na vinavyoendana na utamaduni kwa watoto wachanga, wanawake wajawazito, na wazee.' },
            es: { title: 'Packs de Nutrición de Emergencia', description: 'Kits densos en nutrientes y culturalmente apropiados para bebés, mujeres embarazadas y ancianos.' },
            ar: { title: 'حقائب التغذية الطارئة', description: 'حقائب غنية بالعناصر الغذائية ومناسبة ثقافياً للرضع والنساء الحوامل وكبار السن.' }
        },
        'mobile-health-clinics': {
            fr: { title: 'Cliniques de Santé Mobiles', description: 'Équipes proposant des dépistages, des suppléments et des références pour les cas de malnutrition sévère.' },
            sw: { title: 'Kliniki za Afya Zinazotembea', description: 'Timu zinazotoa uchunguzi, virutubisho, na rufaa kwa matukio makubwa ya utapiamlo.' },
            es: { title: 'Clínicas de Salud Móviles', description: 'Equipos que ofrecen exámenes, suplementos y remisiones para casos de desnutrición severa.' },
            ar: { title: 'العيادات الصحية المتنقلة', description: 'فرق تقدم الفحوصات والمكملات والإحالات لحالات سوء التغذية الحاد.' }
        },
        'nutrition-education': {
            fr: { title: 'Éducation Nutritionnelle', description: 'Ateliers sur la planification des repas avec des ressources limitées, le soutien à l\'allaitement et l\'hygiène.' },
            sw: { title: 'Elimu ya Lishe', description: 'Warsha kuhusu upangaji wa milo kwa rasilimali chache, usaidizi wa kunyonyesha, na usafi.' },
            es: { title: 'Educación Nutricional', description: 'Talleres sobre planificación de comidas con recursos limitados, apoyo a la lactancia materna e higiene.' },
            ar: { title: 'التثقيف التغذوي', description: 'ورش عمل حول تخطيط الوجبات بموارد محدودة، ودعم الرضاعة الطبيعية، والنظافة الصحية.' }
        },
        'school-feeding-programs': {
            fr: { title: 'Programmes d\'Alimentation Scolaire', description: 'Repas quotidiens fortifiés pour les enfants en partenariat avec des écoles/ONG.' },
            sw: { title: 'Mipango ya Kulisha Mashuleni', description: 'Milo ya kila siku iliyoongezwa virutubisho kwa watoto kwa ushirikiano na shule/NGOs.' },
            es: { title: 'Programas de Alimentación Escolar', description: 'Comidas diarias fortificadas para niños en asociación con escuelas/ONG.' },
            ar: { title: 'برامج التغذية المدرسية', description: 'وجبات يومية مدعمة للأطفال بالشراكة مع المدارس والمنظمات غير الحكومية.' }
        },
        'seed-tool-banks': {
            fr: { title: 'Banques de Semences et d\'Outils', description: 'Soutenir l\'agriculture urbaine dans les camps avec des semences résistantes à la sécheresse et des formations.' },
            sw: { title: 'Benki za Mbegu na Zana', description: 'Kusaidia kilimo cha mijini katika kambi kwa mbegu zinazostahimili ukame na mafunzo.' },
            es: { title: 'Bancos de Semillas y Herramientas', description: 'Apoyar la agricultura urbana en los campamentos con semillas resistentes a la sequía y capacitación.' },
            ar: { title: 'بنوك البذور والأدوات', description: 'دعم الزراعة الحضرية في المخيمات ببذور مقاومة للجفاف والتدريب.' }
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
    const blogTranslations: Record<string, Record<string, any>> = {
        'welcome-to-nrdc': {
            fr: {
                title: 'Bienvenue au NRDC',
                content: 'Nous sommes dédiés au soutien des réfugiés et des communautés déplacées grâce à nos programmes complets de nutrition et de santé.',
                excerpt: 'Introduction à notre mission et notre vision pour l\'avenir.'
            },
            sw: {
                title: 'Karibu NRDC',
                content: 'Tumejitolea kusaidia wakimbizi na jamii zilizohamishwa kupitia mipango yetu kamili ya lishe na afya.',
                excerpt: 'Utangulizi wa ujumbe na maono yetu ya baadaye.'
            }
        },
        'success-community-garden': {
            fr: {
                title: 'Histoire de Succès : Jardin Communautaire',
                content: 'Notre récolte récente a fourni des légumes frais à plus de 200 familles dans le camp.',
                excerpt: 'Comment l\'agriculture durable change des vies dans le camp.'
            },
            sw: {
                title: 'Hadithi ya Mafanikio: Bustani ya Jamii',
                content: 'Mavuno yetu ya hivi karibuni yametoa mboga mbichi kwa zaidi ya familia 200 kambini.',
                excerpt: 'Jinsi kilimo endelevu kinavyobadilisha maisha kambini.'
            }
        },
        'emergency-relief-update': {
            fr: {
                title: 'Mise à Jour des Secours d\'Urgence',
                content: 'Nous avons distribué avec succès plus de 5000 repas nutritifs ce mois-ci.',
                excerpt: 'Rapport mensuel sur nos efforts de nutrition d\'urgence.'
            },
            sw: {
                title: 'Taarifa ya Msaada wa Dharura',
                content: 'Tumefanikiwa kutoa zaidi ya milo 5000 yenye lishe mwezi huu.',
                excerpt: 'Ripoti ya kila mwezi kuhusu juhudi zetu za lishe ya dharura.'
            }
        }
    };

    for (const [slug, translations] of Object.entries(blogTranslations)) {
        const post = await prisma.blogPost.findUnique({ where: { slug } });
        if (post) {
            for (const [locale, trans] of Object.entries(translations)) {
                await prisma.blogPostTranslation.upsert({
                    where: {
                        postId_locale: {
                            postId: post.id,
                            locale
                        }
                    },
                    update: trans,
                    create: {
                        ...trans,
                        postId: post.id,
                        locale
                    }
                });
            }
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
    const statTranslations: Record<string, Record<string, any>> = {
        'lives-impacted': {
            fr: { label: 'Vies Impactées' },
            sw: { label: 'Maisha Yaliyofikiwa' }
        },
        'meals-provided': {
            fr: { label: 'Repas Fournis' },
            sw: { label: 'Milo Iliyotolewa' }
        },
        'sustainable-farming': {
            fr: { label: 'Agriculture Durable' },
            sw: { label: 'Kilimo Endelevu' }
        },
        'partner-organizations': {
            fr: { label: 'Organisations Partenaires' },
            sw: { label: 'Mashirika Washirika' }
        }
    };
    for (const [id, translations] of Object.entries(statTranslations)) {
        const stat = await prisma.statistic.findFirst({
            where: {
                label: id.replace(/-/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
            }
        });
        if (stat) {
            for (const [locale, trans] of Object.entries(translations)) {
                await prisma.statisticTranslation.upsert({
                    where: { statisticId_locale: { statisticId: stat.id, locale } },
                    update: trans,
                    create: { ...trans, statisticId: stat.id, locale }
                });
            }
        }
    }

    // Seed Translations for Resources
    console.log('Seeding Resource translations...');
    const resourceTranslations: Record<string, Record<string, any>> = {
        'strategic-plan-2025-2030': {
            fr: { title: 'Plan Stratégique 2025-2030', description: 'Notre stratégie complète pour les cinq prochaines années' },
            sw: { title: 'Mpango Mkakati 2025-2030', description: 'Mkakati wetu kamili kwa miaka mitano ijayo' }
        },
        'annual-report-2024': {
            fr: { title: 'Rapport Annuel 2024', description: 'Aperçu complet de notre impact en 2024' },
            sw: { title: 'Ripoti ya Mwaka 2024', description: 'Muhtasari kamili wa athari zetu mnamo 2024' }
        }
    };
    for (const [id, translations] of Object.entries(resourceTranslations)) {
        const resource = await prisma.resource.findFirst({ where: { id: { contains: id } } });
        if (resource) {
            for (const [locale, trans] of Object.entries(translations)) {
                await prisma.resourceTranslation.upsert({
                    where: { resourceId_locale: { resourceId: resource.id, locale } },
                    update: trans,
                    create: { ...trans, resourceId: resource.id, locale }
                });
            }
        }
    }

    // Seed Translations for Testimonials
    console.log('Seeding Testimonial translations...');
    const testimonialTranslations: Record<string, Record<string, any>> = {
        'amina-hassan': {
            fr: { message: 'Le programme de nutrition a transformé notre communauté. Mes enfants sont en meilleure santé et s\'épanouissent.', role: 'Membre de la Communauté' },
            sw: { message: 'Mpango wa lishe umebadilisha jamii yetu. Watoto wangu ni wenye afya bora na wanastawi.', role: 'Mwanajamii' }
        },
        'john-kamau': {
            fr: { message: 'Travailler avec le NRDC a été incroyablement gratifiant. L\'impact que nous avons est réel et durable.', role: 'Bénévole' },
            sw: { message: 'Kufanya kazi na NRDC kumekuwa na manufaa makubwa. Athari tunayotengeneza ni ya kweli na ya kudumu.', role: 'Mjitolea' }
        }
    };
    for (const [id, translations] of Object.entries(testimonialTranslations)) {
        const testimonial = await prisma.testimonial.findFirst({
            where: {
                name: id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
            }
        });
        if (testimonial) {
            for (const [locale, trans] of Object.entries(translations)) {
                await prisma.testimonialTranslation.upsert({
                    where: { testimonialId_locale: { testimonialId: testimonial.id, locale } },
                    update: trans,
                    create: { ...trans, testimonialId: testimonial.id, locale }
                });
            }
        }
    }

    // Seed Translations for Donation Tiers
    console.log('Seeding Donation Tier translations...');
    const tierTranslations: Record<number, Record<string, any>> = {
        500: {
            fr: { description: 'Fournit des repas pour une famille pendant 3 jours' },
            sw: { description: 'Hutoa milo kwa familia kwa siku 3' }
        },
        1000: {
            fr: { description: 'Fournit de l\'eau potable à une communauté pendant une semaine' },
            sw: { description: 'Hutoa maji safi kwa jamii kwa wiki moja' }
        },
        5000: {
            fr: { description: 'Soutient l\'éducation d\'un enfant pour un trimestre' },
            sw: { description: 'Husaidia elimu ya mtoto kwa muhula mmoja' }
        }
    };
    for (const [amount, translations] of Object.entries(tierTranslations)) {
        const tier = await prisma.donationTier.findFirst({ where: { amount: parseInt(amount) } });
        if (tier) {
            for (const [locale, trans] of Object.entries(translations)) {
                await prisma.donationTierTranslation.upsert({
                    where: { donationTierId_locale: { donationTierId: tier.id, locale } },
                    update: trans,
                    create: { ...trans, donationTierId: tier.id, locale }
                });
            }
        }
    }

    // Seed Translations for Site Content
    console.log('Seeding Site Content translations...');
    const contentTranslations: Record<string, Record<string, any>> = {
        'hero_title': {
            fr: { value: 'Nourrir l\'Espoir dans les Communautés Déplacées' },
            sw: { value: 'Kustawisha Tumaini katika Jamii Zilizohamishwa' }
        },
        'hero_subtitle': {
            fr: { value: 'Fournir une nutrition essentielle, une sécurité alimentaire et un soutien sanitaire à ceux qui en ont le plus besoin.' },
            sw: { value: 'Kutoa lishe muhimu, usalama wa chakula, na msaada wa afya kwa wale wanaohitaji zaidi.' }
        },
        'mission_statement': {
            fr: { value: 'Fournir des programmes de nutrition, de sécurité alimentaire, de renforcement des capacités et de soutien sanitaire communautaire aux réfugiés et aux personnes déplacées.' },
            sw: { value: 'Kutoa lishe, mipango ya usalama wa chakula, kujenga uwezo, na msaada wa afya ya jamii kwa wakimbizi na watu waliohamishwa.' }
        },
        'vision_statement': {
            fr: { value: 'Un monde où les communautés déplacées disposent des ressources et du soutien nécessaires pour prospérer de manière indépendante.' },
            sw: { value: 'Ulimwengu ambapo jamii zilizohamishwa zina rasilimali na msaada wa kustawi kwa kujitegemea.' }
        },
        'core_values': {
            fr: { value: 'Intégrité, Compassion, Durabilité, Responsabilité, Autonomisation' },
            sw: { value: 'Uadilifu, Huruma, Uendelevu, Uwajibikaji, Uwezeshaji' }
        }
    };
    for (const [key, translations] of Object.entries(contentTranslations)) {
        const content = await prisma.siteContent.findUnique({ where: { key } });
        if (content) {
            for (const [locale, trans] of Object.entries(translations)) {
                await prisma.siteContentTranslation.upsert({
                    where: { siteContentId_locale: { siteContentId: content.id, locale } },
                    update: trans,
                    create: { ...trans, siteContentId: content.id, locale }
                });
            }
        }
    }

    // Seed Translations for Donation Stats
    console.log('Seeding Donation Stat translations...');
    const donationStatTranslations: Record<string, Record<string, any>> = {
        'Goes directly to programs': {
            fr: { label: 'Va directement aux programmes' },
            sw: { label: 'Huenda moja kwa moja kwenye mipango' }
        },
        'People helped annually': {
            fr: { label: 'Personnes aidées annuellement' },
            sw: { label: 'Watu wanaosaidiwa kila mwaka' }
        },
        'Countries reached': {
            fr: { label: 'Pays atteints' },
            sw: { label: 'Nchi zilizofikiwa' }
        },
        'Transparency guaranteed': {
            fr: { label: 'Transparence garantie' },
            sw: { label: 'Uwazi umehakikishwa' }
        }
    };
    for (const [label, translations] of Object.entries(donationStatTranslations)) {
        const stat = await prisma.donationStat.findFirst({ where: { label } });
        if (stat) {
            for (const [locale, trans] of Object.entries(translations)) {
                await prisma.donationStatTranslation.upsert({
                    where: { donationStatId_locale: { donationStatId: stat.id, locale } },
                    update: trans,
                    create: { ...trans, donationStatId: stat.id, locale }
                });
            }
        }
    }

    // Seed Translations for Gallery Images
    console.log('Seeding Gallery Image translations...');
    const galleryTranslations: Record<string, Record<string, any>> = {
        'Community Support': { fr: 'Soutien Communautaire', sw: 'Msaada wa Jamii' },
        'Food Distribution': { fr: 'Distribution de Nourriture', sw: 'Usambazaji wa Chakula' },
        'Sustainable Farming': { fr: 'Agriculture Durable', sw: 'Kilimo Endelevu' },
        'Medical Checkups': { fr: 'Bilans Médicaux', sw: 'Uchunguzi wa Matibabu' },
        'Education Program': { fr: 'Programme d\'Éducation', sw: 'Mpango wa Elimu' },
        'Youth Activities': { fr: 'Activités pour la Jeunesse', sw: 'Shughuli za Vijana' },
        'Clean Water Project': { fr: 'Projet d\'Eau Potable', sw: 'Mradi wa Maji Safi' },
        'Women Empowerment': { fr: 'Autonomisation des Femmes', sw: 'Uwezeshaji wa Wanawake' },
        'Staff Meeting': { fr: 'Réunion du Personnel', sw: 'Mkutano wa Wafanyakazi' },
        'Community Elders': { fr: 'Aînés de la Communauté', sw: 'Wazee wa Jamii' },
        'Mobile Clinic Van': { fr: 'Fourgon de Clinique Mobile', sw: 'Gari la Kliniki Inayotembea' },
        'Cultural Celebration': { fr: 'Célébration Culturelle', sw: 'Sherehe za Kitamaduni' },
        'School Lunch Program': { fr: 'Programme de Déjeuner Scolaire', sw: 'Mpango wa Chakula cha Mchana Shuleni' },
        'Tree Planting': { fr: 'Plantation d\'Arbres', sw: 'Upandaji Miti' },
        'Joyful Moments': { fr: 'Moments de Joie', sw: 'Wakati wa Furaha' },
        'Skills Training': { fr: 'Formation aux Compétences', sw: 'Mafunzo ya Ujuzi' },
        'Distribution Center': { fr: 'Centre de Distribution', sw: 'Kituo cha Usambazaji' },
        'Mother and Child': { fr: 'Mère et Enfant', sw: 'Mama na Mtoto' }
    };
    for (const [caption, translations] of Object.entries(galleryTranslations)) {
        const image = await prisma.galleryImage.findFirst({ where: { caption } });
        if (image) {
            for (const [locale, translatedCaption] of Object.entries(translations)) {
                await prisma.galleryImageTranslation.upsert({
                    where: { galleryImageId_locale: { galleryImageId: image.id, locale } },
                    update: { caption: translatedCaption },
                    create: { caption: translatedCaption, galleryImageId: image.id, locale }
                });
            }
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
