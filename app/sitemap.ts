import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

    // Static pages
    const routes = [
        '',
        '/about',
        '/programs',
        '/get-involved',
        '/blog',
        '/gallery',
        '/donate',
        '/contact',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: (route === '/blog' ? 'daily' : 'monthly') as 'daily' | 'monthly',
        priority: route === '' || route === '/donate' ? 1 : route === '/programs' || route === '/blog' ? 0.9 : 0.8,
    }))

    // Dynamic Programs
    const programs = await prisma.program.findMany({
        select: { slug: true, updatedAt: true },
    })

    const programRoutes = programs.map((program) => ({
        url: `${baseUrl}/programs/${program.slug}`,
        lastModified: program.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }))

    // Dynamic Blog Posts
    const posts = await prisma.blogPost.findMany({
        where: { published: true },
        select: { slug: true, updatedAt: true },
    })

    const blogRoutes = posts.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: post.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.6,
    }))

    return [...routes, ...programRoutes, ...blogRoutes]
}
