import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, Tag } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const post = await prisma.blogPost.findUnique({
        where: { slug },
    })

    if (!post) {
        notFound()
    }

    const tags = post.tags ? post.tags.split(',').map(t => t.trim()) : []

    return (
        <div className="pb-16">
            <section className="bg-gray-50 py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link href="/blog" className="inline-flex items-center text-gray-600 hover:text-[#6E8C82] mb-8">
                        <ArrowLeft size={16} className="mr-2" /> Back to News
                    </Link>

                    <div className="inline-block bg-[#6E8C82]/20 text-[#6E8C82] text-sm font-semibold px-4 py-1 rounded-full mb-4">
                        {post.category}
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">{post.title}</h1>

                    <div className="flex items-center gap-2 text-gray-600 mb-8">
                        <Calendar size={18} />
                        <time>
                            {new Date(post.createdAt).toLocaleDateString('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric'
                            })}
                        </time>
                    </div>
                </div>
            </section>

            {post.image && (
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 mb-12">
                    <div className="h-96 bg-gray-200 rounded-2xl overflow-hidden relative shadow-xl">
                        <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{ backgroundImage: `url("${post.image}")` }}
                        />
                    </div>
                </div>
            )}

            <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="prose max-w-none mb-12">
                    <div className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {post.content}
                    </div>
                </div>

                {tags.length > 0 && (
                    <div className="border-t border-gray-200 pt-8">
                        <div className="flex items-center gap-3 flex-wrap">
                            <Tag size={18} className="text-gray-500" />
                            {tags.map((tag, i) => (
                                <span key={i} className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </article>
        </div>
    )
}
