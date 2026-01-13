import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

// GET /api/resources - List all resources
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const locale = searchParams.get('locale')

    try {
        const resources = await prisma.resource.findMany({
            where: { active: true },
            include: {
                translations: locale ? {
                    where: { locale }
                } : false
            },
            orderBy: { createdAt: 'desc' }
        })

        const translatedResources = resources.map(resource => {
            if (!locale) return resource;
            const translation = resource.translations?.[0];
            return {
                ...resource,
                title: translation?.title || resource.title,
                description: translation?.description || resource.description,
                translations: undefined // Remove translations from response
            }
        })

        return NextResponse.json(translatedResources)
    } catch (error) {
        console.error('Error fetching resources:', error)
        return NextResponse.json({ error: 'Failed to fetch resources' }, { status: 500 })
    }
}

// POST /api/resources - Create new resource (Admin only)
export async function POST(request: Request) {
    const session = await getSession()
    if (!session || session.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    try {
        const body = await request.json()
        const { title, description, fileUrl, fileSize, fileType, category, active } = body

        const resource = await prisma.resource.create({
            data: {
                title,
                description,
                fileUrl,
                fileSize,
                fileType,
                category,
                active: active !== undefined ? active : true,
            },
        })

        return NextResponse.json(resource, { status: 201 })
    } catch (error) {
        console.error('Error creating resource:', error)
        return NextResponse.json({ error: 'Failed to create resource' }, { status: 500 })
    }
}
