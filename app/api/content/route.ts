import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

// GET /api/content - Get all site content or filter by keys
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const keys = searchParams.get('keys')?.split(',')

    try {
        const where = keys ? { key: { in: keys } } : {}
        const content = await prisma.siteContent.findMany({ where })

        // Convert array to object for easier access
        const contentMap = content.reduce((acc, item) => {
            acc[item.key] = item.value
            return acc
        }, {} as Record<string, string>)

        return NextResponse.json(contentMap)
    } catch (error) {
        console.error('Error fetching site content:', error)
        return NextResponse.json({ error: 'Failed to fetch site content' }, { status: 500 })
    }
}
