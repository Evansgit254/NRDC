import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function POST(request: Request) {
    const session = await getSession()
    if (!session || session.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    try {
        let count = 0

        // 1. Site Content Translations
        const siteContentTranslations = {
            'contact_email': {
                en: { value: 'nrdc@nrdc.africa' },
                fr: { value: 'nrdc@nrdc.africa' },
                es: { value: 'nrdc@nrdc.africa' },
                ar: { value: 'nrdc@nrdc.africa' }
            },
            'mission_statement': {
                es: { value: 'Proporcionar nutrición, programas de seguridad alimentaria, desarrollo de capacidades y apoyo a la salud comunitaria a refugiados y personas desplazadas, asegurando que cada individuo tenga la base para un futuro saludable.' },
                ar: { value: 'توفير التغذية وبرامج الأمن الغذائي وبناء القدرات ودعم صحة المجتمع للاجئين والنازحين، وضمان حصول كل فرد على الأساس لمستقبل صحي.' }
            },
            'vision_statement': {
                es: { value: 'Un mundo donde las comunidades desplazadas tengan los recursos y el apoyo para prosperar de manera independiente.' },
                ar: { value: 'عالم تمتلك فيه المجتمعات النازحة الموارد والدعم لتزدهر بشكل مستقل.' }
            },
            'core_values': {
                es: { value: 'Integridad, Compasión, Sostenibilidad, Responsabilidad, Empoderamiento' },
                ar: { value: 'النزاهة، التعاطف، الاستدامة، المساءلة، التمكين' }
            }
        }

        for (const [key, translations] of Object.entries(siteContentTranslations)) {
            const content = await prisma.siteContent.findUnique({ where: { key } })
            if (content) {
                for (const [locale, trans] of Object.entries(translations)) {
                    await prisma.siteContentTranslation.upsert({
                        where: { siteContentId_locale: { siteContentId: content.id, locale } },
                        update: trans,
                        create: { ...trans, siteContentId: content.id, locale }
                    })
                    count++
                }
            }
        }

        // 2. Program Translations
        const programTranslations = {
            'emergency-nutrition-packs': {
                fr: { title: 'Packs de Nutrition d\'Urgence', description: 'Kits denses en nutriments et culturellement appropriés pour les nourrissons, les femmes enceintes et les personnes âgées.' },
                es: { title: 'Packs de Nutrición de Emergencia', description: 'Kits nutricionales densos y culturalmente apropiados para lactantes, mujeres embarazadas y ancianos.' },
                ar: { title: 'عبوات التغذية الطارئة', description: 'مجموعات غذائية كثيفة ومناسبة ثقافياً للرضع والنساء الحوامل وكبار السن.' }
            },
            'mobile-health-clinics': {
                fr: { title: 'Cliniques de Santé Mobiles', description: 'Équipes proposant des dépistages, des suppléments et des références pour les cas de malnutrition sévère.' },
                es: { title: 'Clínicas de Salud Móviles', description: 'Equipos que ofrecen detecciones, suplementos y referencias para casos de desnutrición severa.' },
                ar: { title: 'العيادات الصحية المتنقلة', description: 'فرق تقدم فحوصات ومكملات وإحالات لحالات سوء التغذية الحاد.' }
            },
            'nutrition-education': {
                fr: { title: 'Éducation Nutritionnelle', description: 'Ateliers sur la planification des repas avec des ressources limitées, le soutien à l\'allaitement et l\'hygiène.' },
                es: { title: 'Educación Nutricional', description: 'Talleres sobre planificación de comidas con recursos limitados, apoyo a la lactancia materna e higiene.' },
                ar: { title: 'التثقيف التغذوي', description: 'ورش عمل حول تخطيط الوجبات بموارد محدودة، ودعم الرضاعة الطبيعية، والنظافة الصحية.' }
            },
            'school-feeding-programs': {
                fr: { title: 'Programmes d\'Alimentation Scolaire', description: 'Repas enrichis quotidiens pour les enfants en partenariat avec des écoles/ONG.' },
                es: { title: 'Programas de Alimentación Escolar', description: 'Comidas diarias fortalecidas para niños en asociación con escuelas/ONG.' },
                ar: { title: 'برامج تغذية المدارس', description: 'وجبات يومية مقواة للأطفال بالشراكة مع المدارس والمنظمات غير الحكومية.' }
            },
            'seed-tool-banks': {
                fr: { title: 'Banques de Semences et d\'Outils', description: 'Soutien à l\'agriculture urbaine dans les camps avec des semences résistantes à la sécheresse et une formation.' },
                es: { title: 'Bancos de Semillas y Herramientas', description: 'Apoyo a la agricultura urbana en campamentos con semillas resistentes a la sequía y capacitación.' },
                ar: { title: 'بنوك البذور والأدوات', description: 'دعم الزراعة الحضرية في المخيمات ببذور مقاومة للجفاف والتدريب.' }
            }
        }

        for (const [slug, translations] of Object.entries(programTranslations)) {
            const program = await prisma.program.findUnique({ where: { slug } })
            if (program) {
                for (const [locale, trans] of Object.entries(translations)) {
                    await prisma.programTranslation.upsert({
                        where: { programId_locale: { programId: program.id, locale } },
                        update: trans,
                        create: { ...trans, programId: program.id, locale }
                    })
                    count++
                }
            }
        }

        return NextResponse.json({
            success: true,
            message: `Successfully seeded ${count} translations`,
            details: 'Updated all site content and program translations'
        })
    } catch (error: any) {
        console.error('Error seeding all translations:', error)
        return NextResponse.json({
            error: 'Error seeding translations',
            details: error.message
        }, { status: 500 })
    }
}
