import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

// PATCH /api/testimonials/[id] - Update testimonial details/status (Admin only)
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
        const testimonial = await prisma.testimonial.update({
            where: { id },
            data: body,
        })
        return NextResponse.json(testimonial)
    } catch (error) {
        console.error('Error updating testimonial:', error)
        return NextResponse.json({ error: 'Failed to update testimonial' }, { status: 500 })
    }
}

// DELETE /api/testimonials/[id] - Delete testimonial (Admin only)
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
        await prisma.testimonial.delete({
            where: { id },
        })
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting testimonial:', error)
        return NextResponse.json({ error: 'Failed to delete testimonial' }, { status: 500 })
    }
}
