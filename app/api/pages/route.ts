import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const key = searchParams.get('key')

    if (key) {
        const content = await prisma.pageContent.findUnique({
            where: { key },
        })
        return NextResponse.json(content)
    }

    const allContent = await prisma.pageContent.findMany()
    return NextResponse.json(allContent)
}

export async function POST(request: Request) {
    const session = await getSession()
    if (!session || session.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    try {
        const body = await request.json()
        const content = await prisma.pageContent.upsert({
            where: { key: body.key },
            update: { value: body.value, type: body.type },
            create: { key: body.key, value: body.value, type: body.type },
        })
        return NextResponse.json(content)
    } catch (error) {
        return NextResponse.json({ error: 'Error updating content' }, { status: 500 })
    }
}
