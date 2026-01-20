import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

// GET /api/testimonials - List testimonials
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const locale = searchParams.get('locale')

    try {
        const where = status && status !== 'ALL' ? { status } : status === 'ALL' ? {} : { status: 'APPROVED' }
        const testimonials = await prisma.testimonial.findMany({
            where,
            include: {
                translations: locale ? {
                    where: { locale }
                } : false
            },
            orderBy: { order: 'asc' }
        })

        const translatedTestimonials = testimonials.map(testimonial => {
            if (!locale) return testimonial;
            const translation = testimonial.translations?.[0];
            return {
                ...testimonial,
                message: translation?.message || (locale ? undefined : testimonial.message),
                role: translation?.role || (locale ? undefined : testimonial.role),
                translations: undefined // Remove translations from response
            }
        })

        return NextResponse.json(translatedTestimonials)
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

        revalidatePath('/[locale]')

        return NextResponse.json(testimonial, { status: 201 })
    } catch (error) {
        console.error('Error creating testimonial:', error)
        return NextResponse.json({ error: 'Failed to create testimonial' }, { status: 500 })
    }
}
