import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(request: Request) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query || query.length < 2) {
        return NextResponse.json({ results: [] });
    }

    try {
        // Search Blog Posts
        const blogs = await prisma.blogPost.findMany({
            where: {
                OR: [
                    { title: { contains: query } },
                    { content: { contains: query } },
                    { category: { contains: query } },
                ],
            },
            select: { id: true, title: true, category: true, published: true },
            take: 5,
        });

        // Search Programs
        const programs = await prisma.program.findMany({
            where: {
                OR: [
                    { title: { contains: query } },
                    { description: { contains: query } },
                ],
            },
            select: { id: true, title: true, slug: true },
            take: 5,
        });

        // Search Site Content
        const content = await prisma.siteContent.findMany({
            where: {
                OR: [
                    { key: { contains: query } },
                    { value: { contains: query } },
                ],
            },
            select: { id: true, key: true, value: true },
            take: 5,
        });

        // Format results
        const results = [
            ...blogs.map(blog => ({
                id: blog.id,
                type: 'Blog Post' as const,
                title: blog.title,
                subtitle: blog.category,
                url: `/admin/blog`,
                badge: blog.published ? 'Published' : 'Draft',
            })),
            ...programs.map(program => ({
                id: program.id,
                type: 'Program' as const,
                title: program.title,
                subtitle: program.slug,
                url: `/admin/programs`,
            })),
            ...content.map(item => ({
                id: item.id,
                type: 'Site Content' as const,
                title: item.key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                subtitle: item.value.substring(0, 50) + '...',
                url: `/admin/content`,
            })),
        ];

        return NextResponse.json({ results });
    } catch (error) {
        console.error('Search error:', error);
        return NextResponse.json({ error: 'Search failed' }, { status: 500 });
    }
}
