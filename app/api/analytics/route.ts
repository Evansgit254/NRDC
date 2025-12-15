import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    try {
        // Get counts
        const [
            totalBlogs,
            publishedBlogs,
            totalPrograms,
            totalTeamMembers,
            totalGalleryImages,
            totalResources,
            totalTestimonials,
            approvedTestimonials,
            totalContacts,
            newContacts,
        ] = await Promise.all([
            prisma.blogPost.count(),
            prisma.blogPost.count({ where: { published: true } }),
            prisma.program.count(),
            prisma.teamMember.count({ where: { active: true } }),
            prisma.galleryImage.count(),
            prisma.resource.count({ where: { active: true } }),
            prisma.testimonial.count(),
            prisma.testimonial.count({ where: { status: 'APPROVED' } }),
            prisma.contactSubmission.count(),
            prisma.contactSubmission.count({ where: { status: 'NEW' } }),
        ]);

        // Get recent blog posts (for activity chart)
        const recentBlogs = await prisma.blogPost.findMany({
            select: { createdAt: true },
            orderBy: { createdAt: 'desc' },
            take: 30,
        });

        // Group by date
        const blogsByDate = recentBlogs.reduce((acc, blog) => {
            const date = new Date(blog.createdAt).toISOString().split('T')[0];
            acc[date] = (acc[date] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const activityData = Object.entries(blogsByDate)
            .map(([date, count]) => ({ date, count }))
            .reverse()
            .slice(-7); // Last 7 days

        // Get top categories
        const categories = await prisma.blogPost.groupBy({
            by: ['category'],
            _count: {
                category: true,
            },
            orderBy: {
                _count: {
                    category: 'desc',
                },
            },
            take: 5,
        });

        const topCategories = categories.map(c => ({
            name: c.category,
            value: c._count.category,
        }));

        return NextResponse.json({
            stats: {
                totalBlogs,
                publishedBlogs,
                totalPrograms,
                totalTeamMembers,
                totalGalleryImages,
                totalResources,
                totalTestimonials,
                approvedTestimonials,
                totalContacts,
                newContacts,
            },
            activityData,
            topCategories,
        });
    } catch (error) {
        console.error('Analytics error:', error);
        return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
    }
}
