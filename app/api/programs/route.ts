import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const locale = searchParams.get('locale')

    try {
        const programs = await prisma.program.findMany({
            include: {
                translations: locale ? {
                    where: { locale }
                } : false
            },
            orderBy: { createdAt: 'desc' },
        })

        const translatedPrograms = programs.map(program => {
            if (!locale) return program;
            const translation = program.translations?.[0];
            return {
                ...program,
                title: translation?.title || program.title,
                description: translation?.description || program.description,
                translations: undefined // Remove translations from response
            }
        })

        return NextResponse.json(translatedPrograms)
    } catch (error) {
        console.error('Error fetching programs:', error)
        return NextResponse.json({ error: 'Failed to fetch programs' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    const session = await getSession()
    if (!session || session.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    try {
        const body = await request.json()
        const program = await prisma.program.create({
            data: {
                title: body.title,
                slug: body.slug,
                description: body.description,
                objectives: JSON.stringify(body.objectives?.split('\n').filter((o: string) => o.trim()) || []),
                photos: JSON.stringify(body.photos?.split('\n').filter((p: string) => p.trim()) || []),
                metrics: JSON.stringify(typeof body.metrics === 'string' ? JSON.parse(body.metrics || '{}') : body.metrics),
            },
        })
        return NextResponse.json(program)
    } catch (error) {
        console.error('Error creating program:', error)
        return NextResponse.json({ error: 'Error creating program' }, { status: 500 })
    }
}

export async function PUT(request: Request) {
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

        const body = await request.json()
        const program = await prisma.program.update({
            where: { id },
            data: {
                title: body.title,
                slug: body.slug,
                description: body.description,
                objectives: JSON.stringify(body.objectives?.split('\n').filter((o: string) => o.trim()) || []),
                photos: JSON.stringify(body.photos?.split('\n').filter((p: string) => p.trim()) || []),
                metrics: JSON.stringify(typeof body.metrics === 'string' ? JSON.parse(body.metrics || '{}') : body.metrics),
            },
        })
        return NextResponse.json(program)
    } catch (error) {
        console.error('Error updating program:', error)
        return NextResponse.json({ error: 'Error updating program' }, { status: 500 })
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

        await prisma.program.delete({ where: { id } })
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: 'Error deleting program' }, { status: 500 })
    }
}
