import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

// GET /api/resources/[id] - Get single resource (for tracking downloads)
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const resource = await prisma.resource.update({
            where: { id },
            data: { downloads: { increment: 1 } },
        })
        return NextResponse.json(resource)
    } catch (error) {
        console.error('Error fetching resource:', error)
        return NextResponse.json({ error: 'Failed to fetch resource' }, { status: 500 })
    }
}

// PATCH /api/resources/[id] - Update resource (Admin only)
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
        const resource = await prisma.resource.update({
            where: { id },
            data: body,
        })
        return NextResponse.json(resource)
    } catch (error) {
        console.error('Error updating resource:', error)
        return NextResponse.json({ error: 'Failed to update resource' }, { status: 500 })
    }
}

// DELETE /api/resources/[id] - Delete resource (Admin only)
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
        await prisma.resource.delete({
            where: { id },
        })
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting resource:', error)
        return NextResponse.json({ error: 'Failed to delete resource' }, { status: 500 })
    }
}
