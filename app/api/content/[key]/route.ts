import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

// PATCH /api/content/[key] - Update site content by key (Admin only)
export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ key: string }> }
) {
    const session = await getSession()
    if (!session || session.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    try {
        const { key } = await params
        const body = await request.json()
        const { value } = body

        const content = await prisma.siteContent.upsert({
            where: { key },
            update: { value },
            create: { key, value },
        })
        return NextResponse.json(content)
    } catch (error) {
        console.error('Error updating content:', error)
        return NextResponse.json({ error: 'Failed to update content' }, { status: 500 })
    }
}
