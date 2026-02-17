import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'
import { locales } from '@/i18n'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nrdc.africa'

    // Static page routes
    const staticRoutes = [
        '',
        '/about',
        '/programs',
        '/get-involved',
        '/blog',
        '/gallery',
        '/donate',
        '/contact',
    ]

    // Dynamic Programs
    const programs = await prisma.program.findMany({
        select: { slug: true, updatedAt: true },
    })

    // Dynamic Blog Posts
    const posts = await prisma.blogPost.findMany({
        where: { published: true },
        select: { slug: true, updatedAt: true },
    })

    const allRoutes: MetadataRoute.Sitemap = []

    // Generate entries for all locales
    locales.forEach((locale) => {
        // Static routes
        staticRoutes.forEach((route) => {
            allRoutes.push({
                url: `${baseUrl}/${locale}${route}`,
                lastModified: new Date(),
                changeFrequency: (route === '/blog' ? 'daily' : 'monthly') as 'daily' | 'monthly',
                priority: route === '' || route === '/donate' ? 1 : route === '/programs' || route === '/blog' ? 0.9 : 0.8,
            })
        })

        // Program routes
        programs.forEach((program) => {
            allRoutes.push({
                url: `${baseUrl}/${locale}/programs/${program.slug}`,
                lastModified: program.updatedAt,
                changeFrequency: 'weekly',
                priority: 0.7,
            })
        })

        // Blog post routes
        posts.forEach((post) => {
            allRoutes.push({
                url: `${baseUrl}/${locale}/blog/${post.slug}`,
                lastModified: post.updatedAt,
                changeFrequency: 'weekly',
                priority: 0.6,
            })
        })
    })

    return allRoutes
}
