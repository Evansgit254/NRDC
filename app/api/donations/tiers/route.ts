import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const locale = searchParams.get('locale')

    try {
        const tiers = await prisma.donationTier.findMany({
            include: {
                translations: locale ? {
                    where: { locale }
                } : false
            },
            orderBy: { order: 'asc' }
        })

        const translatedTiers = tiers.map(tier => {
            if (!locale) return tier;
            const translation = tier.translations?.[0];
            return {
                ...tier,
                description: translation?.description || tier.description,
                translations: undefined // Remove translations from response
            }
        })

        return NextResponse.json(translatedTiers)
    } catch (error) {
        return NextResponse.json({ error: 'Error fetching donation tiers' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    const session = await getSession()
    if (!session || !['ADMIN', 'EDITOR'].includes(session.role)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    try {
        const { amount, description, isPopular, order } = await request.json()

        const tier = await prisma.donationTier.create({
            data: {
                amount: parseFloat(amount),
                description,
                isPopular: isPopular || false,
                order: parseInt(order) || 0
            }
        })

        return NextResponse.json(tier)
    } catch (error) {
        return NextResponse.json({ error: 'Error creating donation tier' }, { status: 500 })
    }
}

export async function PUT(request: Request) {
    const session = await getSession()
    if (!session || !['ADMIN', 'EDITOR'].includes(session.role)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    try {
        const { id, amount, description, isPopular, order } = await request.json()

        const tier = await prisma.donationTier.update({
            where: { id },
            data: {
                amount: parseFloat(amount),
                description,
                isPopular,
                order: parseInt(order)
            }
        })

        return NextResponse.json(tier)
    } catch (error) {
        return NextResponse.json({ error: 'Error updating donation tier' }, { status: 500 })
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

        await prisma.donationTier.delete({
            where: { id }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: 'Error deleting donation tier' }, { status: 500 })
    }
}
