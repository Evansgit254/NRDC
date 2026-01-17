import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export const dynamic = 'force-dynamic'

// GET /api/statistics - List all statistics
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const locale = searchParams.get('locale')

    try {
        const statistics = await prisma.statistic.findMany({
            where: { active: true },
            include: {
                translations: locale ? {
                    where: { locale }
                } : false
            },
            orderBy: { order: 'asc' }
        })

        const translatedStatistics = statistics.map(stat => {
            if (!locale) return stat;
            const translation = stat.translations?.[0];
            return {
                ...stat,
                label: translation?.label || stat.label,
                translations: undefined // Remove translations from response
            }
        })

        return NextResponse.json(translatedStatistics)
    } catch (error) {
        console.error('Error fetching statistics:', error)
        return NextResponse.json({ error: 'Failed to fetch statistics' }, { status: 500 })
    }
}

// POST /api/statistics - Create new statistic (Admin only)
export async function POST(request: Request) {
    const session = await getSession()
    if (!session || session.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    try {
        const body = await request.json()
        const { label, value, icon, order, active } = body

        const statistic = await prisma.statistic.create({
            data: {
                label,
                value,
                icon,
                order: order || 0,
                active: active !== undefined ? active : true,
            },
        })

        revalidatePath('/[locale]')

        return NextResponse.json(statistic, { status: 201 })
    } catch (error) {
        console.error('Error creating statistic:', error)
        return NextResponse.json({ error: 'Failed to create statistic' }, { status: 500 })
    }
}
