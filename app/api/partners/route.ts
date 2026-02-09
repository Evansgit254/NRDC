
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET() {
    try {
        const partners = await prisma.partner.findMany({
            orderBy: { createdAt: 'desc' },
        })
        return NextResponse.json(partners)
    } catch (error) {
        return NextResponse.json({ error: 'Error fetching partners' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    const session = await getSession()
    if (!session || session.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    try {
        const body = await request.json()
        const { name, logo, website } = body

        if (!name || !logo) {
            return NextResponse.json({ error: 'Name and Logo are required' }, { status: 400 })
        }

        const partner = await prisma.partner.create({
            data: {
                name,
                logo,
                website,
            },
        })

        return NextResponse.json(partner)
    } catch (error) {
        return NextResponse.json({ error: 'Error creating partner' }, { status: 500 })
    }
}
