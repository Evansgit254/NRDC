import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

// PATCH /api/statistics/[id] - Update statistic (Admin only)
export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getSession()
    if (!session || session.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    try {
        const { id } = await params
        const body = await request.json()
        const statistic = await prisma.statistic.update({
            where: { id },
            data: body,
        })
        return NextResponse.json(statistic)
    } catch (error) {
        console.error('Error updating statistic:', error)
        return NextResponse.json({ error: 'Failed to update statistic' }, { status: 500 })
    }
}

// DELETE /api/statistics/[id] - Delete statistic (Admin only)
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getSession()
    if (!session || session.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    try {
        const { id } = await params
        await prisma.statistic.delete({
            where: { id },
        })
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting statistic:', error)
        return NextResponse.json({ error: 'Failed to delete statistic' }, { status: 500 })
    }
}
