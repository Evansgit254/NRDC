import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const locale = searchParams.get('locale')

    try {
        const images = await prisma.galleryImage.findMany({
            include: {
                translations: locale ? {
                    where: { locale }
                } : false
            },
            orderBy: { createdAt: 'desc' },
        })

        const translatedImages = images.map(image => {
            if (!locale) return image;
            const translation = image.translations?.[0];
            return {
                ...image,
                caption: translation?.caption || image.caption,
                translations: undefined
            }
        })

        return NextResponse.json(translatedImages)
    } catch (error) {
        console.error('Error fetching gallery images:', error)
        return NextResponse.json({ error: 'Failed to fetch gallery images' }, { status: 500 })
    }
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
