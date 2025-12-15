import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { logAudit } from '@/lib/audit'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')

    const session = await getSession()
    const isAdmin = session && session.role === 'ADMIN'

    const where = category ? { category, ...(isAdmin ? {} : { published: true }) } : (isAdmin ? {} : { published: true })

    const blogs = await prisma.blogPost.findMany({
        where,
        orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(blogs)
}

export async function POST(request: Request) {
    const session = await getSession()
    if (!session || session.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    try {
        const body = await request.json()
        const blog = await prisma.blogPost.create({
            data: {
                title: body.title,
                slug: body.slug,
                content: body.content,
                excerpt: body.excerpt,
                category: body.category,
                image: body.image,
                tags: body.tags,
                published: body.published || false,
            },
        })

        await logAudit('CREATE', 'BlogPost', blog.id, { userId: session.userId, details: { title: blog.title } })

        return NextResponse.json(blog)
    } catch (error) {
        return NextResponse.json({ error: 'Error creating blog post' }, { status: 500 })
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

        // Fetch current post to save history
        const currentPost = await prisma.blogPost.findUnique({ where: { id } })

        if (currentPost) {
            await prisma.postHistory.create({
                data: {
                    postId: currentPost.id,
                    title: currentPost.title,
                    content: currentPost.content,
                    excerpt: currentPost.excerpt,
                    image: currentPost.image,
                    category: currentPost.category,
                    tags: currentPost.tags,
                    editorId: session.userId,
                }
            })
        }

        // Allow partial updates
        const updateData: any = {}
        if (body.title !== undefined) updateData.title = body.title
        if (body.slug !== undefined) updateData.slug = body.slug
        if (body.content !== undefined) updateData.content = body.content
        if (body.excerpt !== undefined) updateData.excerpt = body.excerpt
        if (body.category !== undefined) updateData.category = body.category
        if (body.tags !== undefined) updateData.tags = body.tags
        if (body.published !== undefined) updateData.published = body.published

        const blog = await prisma.blogPost.update({
            where: { id },
            data: updateData,
        })

        await logAudit('UPDATE', 'BlogPost', blog.id, { userId: session.userId, details: { title: blog.title, changes: Object.keys(updateData) } })

        return NextResponse.json(blog)
    } catch (error) {
        return NextResponse.json({ error: 'Error updating blog post' }, { status: 500 })
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

        await prisma.blogPost.delete({ where: { id } })
        await logAudit('DELETE', 'BlogPost', id, { userId: session.userId })

        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: 'Error deleting blog post' }, { status: 500 })
    }
}
