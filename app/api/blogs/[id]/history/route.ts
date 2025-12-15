import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getSession()
    if (!session || session.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    try {
        const { id } = await params
        const history = await prisma.postHistory.findMany({
            where: { postId: id },
            orderBy: { createdAt: 'desc' },
        })
        return NextResponse.json(history)
    } catch (error) {
        return NextResponse.json({ error: 'Error fetching history' }, { status: 500 })
    }
}
