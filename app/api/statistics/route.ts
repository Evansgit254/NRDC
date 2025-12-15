import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// GET /api/statistics - List all statistics
export async function GET() {
    try {
        const statistics = await prisma.statistic.findMany({
            where: { active: true },
            orderBy: { order: 'asc' }
        })
        return NextResponse.json(statistics)
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

        return NextResponse.json(statistic, { status: 201 })
    } catch (error) {
        console.error('Error creating statistic:', error)
        return NextResponse.json({ error: 'Failed to create statistic' }, { status: 500 })
    }
}
