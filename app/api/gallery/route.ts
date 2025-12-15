import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET() {
    const images = await prisma.galleryImage.findMany({
        orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(images)
}

export async function POST(request: Request) {
    const session = await getSession()
    if (!session || session.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    try {
        const body = await request.json()
        const image = await prisma.galleryImage.create({
            data: {
                url: body.url,
                caption: body.caption,
                category: body.category,
            },
        })
        return NextResponse.json(image)
    } catch (error) {
        return NextResponse.json({ error: 'Error adding image' }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
    const session = await getSession()
    if (!session || session.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')
        if (!id) {
            return NextResponse.json({ error: 'ID required' }, { status: 400 })
        }

        await prisma.galleryImage.delete({ where: { id } })
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: 'Error deleting image' }, { status: 500 })
    }
}
