import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Starting targeted resource update...')

    const resources = [
        {
            title: 'Strategic Plan 2025-2030',
            description: 'Our comprehensive strategy for the next five years',
            fileUrl: '/docs/strategic-plan-2025.pdf',
            fileSize: '2.4 MB',
            fileType: 'PDF',
            category: 'Strategic Plan',
            active: true,
        },
        {
            title: 'Annual Report 2024',
            description: 'Complete overview of our impact in 2024',
            fileUrl: '/docs/annual-report-2024.pdf',
            fileSize: '3.1 MB',
            fileType: 'PDF',
            category: 'Annual Report',
            active: true,
        },
        {
            title: 'Donation Refund Policy',
            description: 'Terms and conditions for donation refunds',
            fileUrl: '/docs/donation-refund-policy.pdf',
            fileSize: '0.5 MB',
            fileType: 'PDF',
            category: 'Policy',
            active: true,
        },
        {
            title: 'Donation Utilization Policy',
            description: 'Policies and procedures for donation utilization',
            fileUrl: '/docs/donation-utilization-policy.pdf',
            fileSize: '0.6 MB',
            fileType: 'PDF',
            category: 'Policy',
            active: true,
        },
    ]

    for (const resource of resources) {
        const id = resource.title.toLowerCase().replace(/\s+/g, '-')
        await prisma.resource.upsert({
            where: { id },
            update: resource,
            create: { ...resource, id },
        })
        console.log(`✅ Upserted resource: ${resource.title}`)
    }

    const resourceTranslations: Record<string, Record<string, any>> = {
        'strategic-plan-2025-2030': {
            fr: { title: 'Plan Stratégique 2025-2030', description: 'Notre stratégie complète pour les cinq prochaines années' },
            sw: { title: 'Mpango Mkakati 2025-2030', description: 'Mkakati wetu kamili kwa miaka mitano ijayo' }
        },
        'annual-report-2024': {
            fr: { title: 'Rapport Annuel 2024', description: 'Aperçu complet de notre impact en 2024' },
            sw: { title: 'Ripoti ya Mwaka 2024', description: 'Muhtasari kamili wa athari zetu mnamo 2024' }
        },
        'donation-refund-policy': {
            fr: { title: 'Politique de Remboursement des Dons', description: 'Conditions générales pour le remboursement des dons' },
            sw: { title: 'Sera ya Kurejesha Michango', description: 'Sheria na masharti ya kurejesha michango' }
        },
        'donation-utilization-policy': {
            fr: { title: 'Politique d\'Utilisation des Dons', description: 'Politiques et procédures d\'utilisation des dons' },
            sw: { title: 'Sera ya Matumizi ya Michango', description: 'Sera na taratibu za matumizi ya michango' }
        }
    }

    for (const [id, translations] of Object.entries(resourceTranslations)) {
        const resource = await prisma.resource.findUnique({ where: { id } })
        if (resource) {
            for (const [locale, trans] of Object.entries(translations)) {
                await prisma.resourceTranslation.upsert({
                    where: { resourceId_locale: { resourceId: resource.id, locale } },
                    update: trans,
                    create: { ...trans, resourceId: resource.id, locale }
                })
            }
            console.log(`✅ Updated translations for: ${id}`)
        }
    }

    console.log('Targeted update finished successfully.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
