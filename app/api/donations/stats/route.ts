import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const locale = searchParams.get('locale')

    try {
        const stats = await prisma.donationStat.findMany({
            include: {
                translations: locale ? {
                    where: { locale }
                } : false
            },
            orderBy: { order: 'asc' }
        })

        const translatedStats = stats.map(stat => {
            if (!locale) return stat;
            const translation = stat.translations?.[0];
            return {
                ...stat,
                label: translation?.label || stat.label,
                translations: undefined
            }
        })

        return NextResponse.json(translatedStats)
    } catch (error) {
        return NextResponse.json({ error: 'Error fetching donation stats' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    const session = await getSession()
    if (!session || !['ADMIN', 'EDITOR'].includes(session.role)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    try {
        const { value, label, order } = await request.json()

        const stat = await prisma.donationStat.create({
            data: {
                value,
                label,
                order: parseInt(order) || 0
            }
        })

        return NextResponse.json(stat)
    } catch (error) {
        return NextResponse.json({ error: 'Error creating donation stat' }, { status: 500 })
    }
}

export async function PUT(request: Request) {
    const session = await getSession()
    if (!session || !['ADMIN', 'EDITOR'].includes(session.role)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    try {
        const { id, value, label, order } = await request.json()

        const stat = await prisma.donationStat.update({
            where: { id },
            data: {
                value,
                label,
                order: parseInt(order)
            }
        })

        return NextResponse.json(stat)
    } catch (error) {
        return NextResponse.json({ error: 'Error updating donation stat' }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
    const session = await getSession()
    if (!session || !['ADMIN', 'EDITOR'].includes(session.role)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 })
        }

        await prisma.donationStat.delete({
            where: { id }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: 'Error deleting donation stat' }, { status: 500 })
    }
}
