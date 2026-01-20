import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Starting Swahili translation update (non-destructive)...')

    // 1. Site Content Translations
    const contentTranslations: Record<string, Record<string, any>> = {
        'hero_title': {
            sw: { value: 'Kustawisha Tumaini katika Jamii Zilizohamishwa' }
        },
        'hero_subtitle': {
            sw: { value: 'Kutoa lishe muhimu, usalama wa chakula, na msaada wa afya kwa wale wanaohitaji zaidi.' }
        },
        'mission_statement': {
            sw: { value: 'Kutoa lishe, mipango ya usalama wa chakula, kujenga uwezo, na msaada wa afya ya jamii kwa wakimbizi na watu waliohamishwa.' }
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

    // 2. Statistics Translations
    const statTranslations: Record<string, Record<string, any>> = {
        'Lives Reached': {
            sw: { label: 'Maisha Yaliyofikiwa' }
        },
        'Meals Provided': {
            sw: { label: 'Milo Iliyotolewa' }
        },
        'Sustainable Agriculture': {
            sw: { label: 'Kilimo Endelevu' }
        },
        'Partner Organizations': {
            sw: { label: 'Mashirika Washirika' }
        }
    };

    for (const [label, translations] of Object.entries(statTranslations)) {
        const stat = await prisma.statistic.findFirst({ where: { label } });
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

    // 3. Program Translations
    const programTranslations: Record<string, Record<string, any>> = {
        'emergency-nutrition-packs': {
            sw: { title: 'Vifurushi vya Lishe ya Dharura', description: 'Vifurushi vyenye virutubisho vingi na vinavyoendana na utamaduni kwa watoto wachanga, wanawake wajawazito, na wazee.' }
        },
        'seed-tool-banks': {
            sw: { title: 'Benki za Mbegu na Zana', description: 'Kusaidia kilimo cha mijini katika kambi kwa mbegu zinazostahimili ukame na mafunzo.' }
        },
        'school-feeding-programs': {
            sw: { title: 'Mipango ya Kulisha Mashuleni', description: 'Milo ya kila siku iliyoongezwa virutubisho kwa watoto kwa ushirikiano na shule/NGOs.' }
        },
        'nutrition-education': {
            sw: { title: 'Elimu ya Lishe', description: 'Warsha kuhusu upangaji wa milo kwa rasilimali chache, usaidizi wa kunyonyesha, na usafi.' }
        },
        'mobile-health-clinics': {
            sw: { title: 'Kliniki za Afya Zinazotembea', description: 'Timu zinazotoa uchunguzi, virutubisho, na rufaa kwa matukio makubwa ya utapiamlo.' }
        }
    };

    for (const [slug, translations] of Object.entries(programTranslations)) {
        const program = await prisma.program.findUnique({ where: { slug } });
        if (program) {
            for (const [locale, trans] of Object.entries(translations)) {
                await prisma.programTranslation.upsert({
                    where: { programId_locale: { programId: program.id, locale } },
                    update: trans,
                    create: { ...trans, programId: program.id, locale }
                });
            }
        }
    }

    console.log('Swahili translation update completed successfully.');
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
