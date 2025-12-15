import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

// GET /api/testimonials - List testimonials
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    try {
        const where = status && status !== 'ALL' ? { status } : status === 'ALL' ? {} : { status: 'APPROVED' }
        const testimonials = await prisma.testimonial.findMany({
            where,
            orderBy: { order: 'asc' }
        })
        return NextResponse.json(testimonials)
    } catch (error) {
        console.error('Error fetching testimonials:', error)
        return NextResponse.json({ error: 'Failed to fetch testimonials' }, { status: 500 })
    }
}

// POST /api/testimonials - Submit new testimonial (Public)
export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { name, role, message, imageUrl, rating } = body

        const testimonial = await prisma.testimonial.create({
            data: {
                name,
                role,
                message,
                imageUrl,
                rating,
                status: 'PENDING', // All new testimonials start as pending
                order: 0,
            },
        })

        return NextResponse.json(testimonial, { status: 201 })
    } catch (error) {
        console.error('Error creating testimonial:', error)
        return NextResponse.json({ error: 'Failed to create testimonial' }, { status: 500 })
    }
}
