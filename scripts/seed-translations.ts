
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Checking for existing content...');

    // 1. Programs
    let programs = await prisma.program.findMany();
    if (programs.length === 0) {
        console.log('No programs found. Creating sample programs...');
        await prisma.program.createMany({
            data: [
                {
                    title: 'Emergency Nutrition',
                    description: 'Providing immediate food assistance to families in crisis zones.',
                    objectives: JSON.stringify(['Provide food aid', 'Reduce malnutrition', 'Support vulnerable families']),
                    photos: JSON.stringify(['/images/emergency-nutrition.jpg']),
                    metrics: JSON.stringify({ families: 500, meals: 10000 }),
                    slug: 'emergency-nutrition'
                },
                {
                    title: 'Community Gardens',
                    description: 'Teaching sustainable farming to ensure long-term food security.',
                    objectives: JSON.stringify(['Train farmers', 'Create gardens', 'Ensure food security']),
                    photos: JSON.stringify(['/images/community-gardens.jpg']),
                    metrics: JSON.stringify({ gardens: 50, farmers: 200 }),
                    slug: 'community-gardens'
                },
                {
                    title: 'Mobile Health Clinics',
                    description: 'Bringing essential medical care to remote displaced communities.',
                    objectives: JSON.stringify(['Provide healthcare', 'Vaccinations', 'Health education']),
                    photos: JSON.stringify(['/images/mobile-health.jpg']),
                    metrics: JSON.stringify({ patients: 1000, clinics: 10 }),
                    slug: 'mobile-health'
                }
            ]
        });
        programs = await prisma.program.findMany();
    }

    console.log(`Found ${programs.length} programs. Adding translations...`);

    for (const program of programs) {
        // Check if translation exists
        const existing = await prisma.programTranslation.findFirst({
            where: {
                programId: program.id,
                locale: 'fr'
            }
        });

        if (!existing) {
            let title = '';
            let description = '';

            if (program.title.includes('Emergency Nutrition')) {
                title = 'Nutrition d\'Urgence';
                description = 'Aide alimentaire immédiate pour les familles dans les zones de crise.';
            } else if (program.title.includes('Community Gardens')) {
                title = 'Jardins Communautaires';
                description = 'Enseigner l\'agriculture durable pour assurer la sécurité alimentaire à long terme.';
            } else if (program.title.includes('Mobile Health')) {
                title = 'Cliniques Mobiles';
                description = 'Apporter des soins médicaux essentiels aux communautés déplacées isolées.';
            } else {
                title = `[FR] ${program.title}`;
                description = `[FR] ${program.description}`;
            }

            await prisma.programTranslation.create({
                data: {
                    programId: program.id,
                    locale: 'fr',
                    title,
                    description
                }
            });
            console.log(`Added translation for program: ${program.title}`);
        }
    }

    // 2. Blog Posts
    let posts = await prisma.blogPost.findMany();
    if (posts.length === 0) {
        console.log('No blog posts found. Creating sample posts...');
        // Need an author first
        const user = await prisma.user.findFirst();
        if (user) {
            await prisma.blogPost.createMany({
                data: [
                    {
                        title: 'Success Story: Maria\'s Garden',
                        excerpt: 'How one woman transformed her community through sustainable farming.',
                        content: 'Full story content...',
                        image: '/images/blog-1.jpg',
                        slug: 'success-story-maria',
                        category: 'Stories',
                        published: true
                    },
                    {
                        title: 'New Health Initiative Launched',
                        excerpt: 'Expanding our reach to 5 new refugee camps.',
                        content: 'Full story content...',
                        image: '/images/blog-2.jpg',
                        slug: 'new-health-initiative',
                        category: 'News',
                        published: true
                    }
                ]
            });
            posts = await prisma.blogPost.findMany();
        } else {
            console.log('No user found to assign as author. Skipping blog posts.');
        }
    }

    console.log(`Found ${posts.length} blog posts. Adding translations...`);

    for (const post of posts) {
        const existing = await prisma.blogPostTranslation.findFirst({
            where: {
                postId: post.id,
                locale: 'fr'
            }
        });

        if (!existing) {
            let title = '';
            let excerpt = '';
            let content = '';

            if (post.title.includes('Maria')) {
                title = 'Histoire de Réussite : Le Jardin de Maria';
                excerpt = 'Comment une femme a transformé sa communauté grâce à l\'agriculture durable.';
                content = '[FR] Full story content...';
            } else if (post.title.includes('Health Initiative')) {
                title = 'Nouvelle Initiative de Santé Lancée';
                excerpt = 'Extension de notre portée à 5 nouveaux camps de réfugiés.';
                content = '[FR] Full story content...';
            } else {
                title = `[FR] ${post.title}`;
                excerpt = `[FR] ${post.excerpt}`;
                content = `[FR] ${post.content}`;
            }

            await prisma.blogPostTranslation.create({
                data: {
                    postId: post.id,
                    locale: 'fr',
                    title,
                    excerpt,
                    content
                }
            });
            console.log(`Added translation for post: ${post.title}`);
        }
    }

    console.log('Seeding complete!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
