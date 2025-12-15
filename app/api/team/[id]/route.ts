import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

// PATCH /api/team/[id] - Update team member (Admin only)
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
        const member = await prisma.teamMember.update({
            where: { id },
            data: body,
        })
        return NextResponse.json(member)
    } catch (error) {
        console.error('Error updating team member:', error)
        return NextResponse.json({ error: 'Failed to update team member' }, { status: 500 })
    }
}

// DELETE /api/team/[id] - Delete team member (Admin only)
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
        await prisma.teamMember.delete({
            where: { id },
        })
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting team member:', error)
        return NextResponse.json({ error: 'Failed to delete team member' }, { status: 500 })
    }
}
