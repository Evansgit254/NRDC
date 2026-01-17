import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function POST(request: Request) {
    const session = await getSession()
    if (!session || session.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    try {
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

        let createdCount = 0;

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
                    createdCount++;
                }
            }
        }

        return NextResponse.json({
            success: true,
            message: `Successfully seeded ${createdCount} program translations`,
            details: 'French, Spanish, and Arabic translations added for all programs'
        })
    } catch (error: any) {
        console.error('Error seeding translations:', error)
        return NextResponse.json({
            error: 'Error seeding translations',
            details: error.message
        }, { status: 500 })
    }
}
