import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { logAudit } from '@/lib/audit'
import { revalidatePath } from 'next/cache'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const locale = searchParams.get('locale')

    const session = await getSession()
    const isAdmin = session && session.role === 'ADMIN'

    const where = category ? { category, ...(isAdmin ? {} : { published: true }) } : (isAdmin ? {} : { published: true })

    try {
        const blogs = await prisma.blogPost.findMany({
            where,
            include: {
                translations: locale ? {
                    where: { locale }
                } : false
            },
            orderBy: { createdAt: 'desc' },
        })

        const translatedBlogs = blogs.map(post => {
            if (!locale) return post;
            const translation = post.translations?.[0];
            return {
                ...post,
                title: translation?.title || post.title,
                content: translation?.content || post.content,
                excerpt: translation?.excerpt || post.excerpt,
                translations: undefined // Remove translations from response
            }
        })

        return NextResponse.json(translatedBlogs)
    } catch (error) {
        console.error('Error fetching blog posts:', error)
        return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 })
    }
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

        revalidatePath('/[locale]/blog')
        revalidatePath('/[locale]')

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
        if (body.image !== undefined) updateData.image = body.image

        const blog = await prisma.blogPost.update({
            where: { id },
            data: updateData,
        })

        await logAudit('UPDATE', 'BlogPost', blog.id, { userId: session.userId, details: { title: blog.title, changes: Object.keys(updateData) } })

        revalidatePath('/[locale]/blog')
        revalidatePath('/[locale]')

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

        revalidatePath('/[locale]/blog')
        revalidatePath('/[locale]')

        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: 'Error deleting blog post' }, { status: 500 })
    }
}
