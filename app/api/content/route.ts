import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

// GET /api/content - Get all site content or filter by keys
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const keys = searchParams.get('keys')?.split(',')
    const locale = searchParams.get('locale')

    try {
        const where = keys ? { key: { in: keys } } : {}
        const content = await prisma.siteContent.findMany({
            where,
            include: {
                translations: locale ? {
                    where: { locale }
                } : false
            }
        })

        // Convert array to object for easier access
        const contentMap = content.reduce((acc, item) => {
            const translation = item.translations?.[0];
            acc[item.key] = translation?.value || item.value
            return acc
        }, {} as Record<string, string>)

        return NextResponse.json(contentMap)
    } catch (error) {
        console.error('Error fetching site content:', error)
        return NextResponse.json({ error: 'Failed to fetch site content' }, { status: 500 })
    }
}
