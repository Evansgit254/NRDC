import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// GET /api/team - List all team members
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const locale = searchParams.get('locale')

    try {
        const teamMembers = await prisma.teamMember.findMany({
            where: { active: true },
            include: {
                translations: locale ? {
                    where: { locale }
                } : false
            },
            orderBy: { order: 'asc' }
        })

        const translatedTeamMembers = teamMembers.map(member => {
            if (!locale) return member;
            const translation = member.translations?.[0];
            return {
                ...member,
                title: translation?.title || member.title,
                bio: translation?.bio || member.bio,
                translations: undefined // Remove translations from response
            }
        })

        return NextResponse.json(translatedTeamMembers)
    } catch (error) {
        console.error('Error fetching team members:', error)
        return NextResponse.json({ error: 'Failed to fetch team members' }, { status: 500 })
    }
}

// POST /api/team - Create new team member (Admin only)
export async function POST(request: Request) {
    const session = await getSession()
    if (!session || session.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    try {
        const body = await request.json()
        const { name, title, bio, imageUrl, order, active } = body

        const teamMember = await prisma.teamMember.create({
            data: {
                name,
                title,
                bio,
                imageUrl,
                order: order || 0,
                active: active !== undefined ? active : true,
            },
        })

        return NextResponse.json(teamMember, { status: 201 })
    } catch (error) {
        console.error('Error creating team member:', error)
        return NextResponse.json({ error: 'Failed to create team member' }, { status: 500 })
    }
}
