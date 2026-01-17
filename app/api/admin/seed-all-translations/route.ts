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

        return NextResponse.json({
            success: true,
            message: `Successfully seeded ${count} translations`,
            details: 'Spanish and Arabic translations added for site content (Mission, Vision, Core Values)'
        })
    } catch (error: any) {
        console.error('Error seeding all translations:', error)
        return NextResponse.json({
            error: 'Error seeding translations',
            details: error.message
        }, { status: 500 })
    }
}
