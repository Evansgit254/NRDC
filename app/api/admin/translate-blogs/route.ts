import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { autoTranslatePost } from '@/lib/translate'

export async function POST(request: Request) {
    const session = await getSession()
    if (!session || session.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    try {
        const posts = await prisma.blogPost.findMany({
            select: { id: true, title: true, excerpt: true, content: true }
        })

        let translated = 0
        let failed = 0

        for (const post of posts) {
            try {
                const translations = await autoTranslatePost({
                    title: post.title,
                    excerpt: post.excerpt || '',
                    content: post.content
                })

                for (const [locale, data] of Object.entries(translations)) {
                    await prisma.blogPostTranslation.upsert({
                        where: {
                            postId_locale: { postId: post.id, locale }
                        },
                        update: data,
                        create: {
                            postId: post.id,
                            locale,
                            title: data.title,
                            excerpt: data.excerpt,
                            content: data.content
                        }
                    })
                }
                translated++
            } catch (err) {
                console.error(`Failed to translate post ${post.id}:`, err)
                failed++
            }
        }

        return NextResponse.json({
            success: true,
            message: `Translated ${translated} posts. ${failed > 0 ? `${failed} failed.` : ''}`,
            translated,
            failed
        })
    } catch (error) {
        console.error('Backfill translation error:', error)
        return NextResponse.json({ error: 'Failed to run translation backfill' }, { status: 500 })
    }
}
