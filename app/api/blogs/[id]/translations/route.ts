import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await getSession()
    if (!session || session.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    try {
        const translations = await prisma.blogPostTranslation.findMany({
            where: { postId: id },
        })
        return NextResponse.json(translations)
    } catch (error) {
        console.error('Error fetching blog translations:', error)
        return NextResponse.json({ error: 'Failed to fetch translations' }, { status: 500 })
    }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await getSession()
    if (!session || session.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    try {
        const body = await request.json()
        const { locale, title, content, excerpt } = body

        if (!locale || !title || !content) {
            return NextResponse.json({ error: 'Missing required translation fields' }, { status: 400 })
        }

        const translation = await prisma.blogPostTranslation.upsert({
            where: {
                postId_locale: {
                    postId: id,
                    locale,
                }
            },
            update: {
                title,
                content,
                excerpt,
            },
            create: {
                postId: id,
                locale,
                title,
                content,
                excerpt,
            }
        })

        return NextResponse.json(translation)
    } catch (error) {
        console.error('Error saving blog translation:', error)
        return NextResponse.json({ error: 'Failed to save translation' }, { status: 500 })
    }
}
