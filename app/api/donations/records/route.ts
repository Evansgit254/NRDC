import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET(request: Request) {
    try {
        // Verify admin authentication
        const session = await getSession()
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const status = searchParams.get('status')
        const method = searchParams.get('method')
        const limit = parseInt(searchParams.get('limit') || '50')
        const offset = parseInt(searchParams.get('offset') || '0')

        // Build filter conditions
        const where: any = {}
        if (status) where.paymentStatus = status
        if (method) where.paymentMethod = method

        // Fetch donations with filters
        const [donations, total] = await Promise.all([
            prisma.donation.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                take: limit,
                skip: offset,
            }),
            prisma.donation.count({ where }),
        ])

        return NextResponse.json({
            donations,
            total,
            limit,
            offset,
        })
    } catch (error) {
        console.error('Error fetching donations:', error)
        return NextResponse.json(
            { error: 'Failed to fetch donations' },
            { status: 500 }
        )
    }
}

// Update donation status (for manual intervention)
export async function PATCH(request: Request) {
    try {
        const session = await getSession()
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id, status } = await request.json()

        if (!id || !status) {
            return NextResponse.json(
                { error: 'Missing id or status' },
                { status: 400 }
            )
        }

        const validStatuses = ['pending', 'completed', 'failed', 'refunded']
        if (!validStatuses.includes(status)) {
            return NextResponse.json(
                { error: 'Invalid status' },
                { status: 400 }
            )
        }

        const donation = await prisma.donation.update({
            where: { id },
            data: { paymentStatus: status },
        })

        return NextResponse.json(donation)
    } catch (error) {
        console.error('Error updating donation:', error)
        return NextResponse.json(
            { error: 'Failed to update donation' },
            { status: 500 }
        )
    }
}
