import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Calendar, ArrowRight } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import AdSlot from '@/components/AdSlot'

export const dynamic = 'force-dynamic'

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'blogPage' });

    const posts = await prisma.blogPost.findMany({
        where: { published: true },
        include: {
            translations: {
                where: { locale }
            }
        },
        orderBy: { createdAt: 'desc' },
    })

    return (
        <div className="pb-16">
            <section className="bg-[#6E8C82] text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fadeInUp">{t('title')}</h1>
                    <p className="text-xl max-w-3xl mx-auto text-white/80 animate-fadeInUp animation-delay-200">
                        {t('subtitle')}
                    </p>
                </div>
            </section>

            {/* Ad Slot */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                <AdSlot placement="BLOG_TOP" className="w-full min-h-[90px] bg-gray-50 rounded-lg flex items-center justify-center" />
            </div>

            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map((post) => {
                        const translation = post.translations[0];
                        const title = translation?.title || post.title;
                        const excerpt = translation?.excerpt || post.excerpt;

                        return (
                            <article key={post.id} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 h-full flex flex-col hover-lift">
                                {post.image && (
                                    <div className="h-48 bg-gray-200 relative image-zoom-container">
                                        <div
                                            className="absolute inset-0 bg-cover bg-center image-zoom"
                                            style={{ backgroundImage: `url("${post.image}")` }}
                                        />
                                    </div>
                                )}
                                <div className="p-6 flex flex-col flex-grow">
                                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                                        <Calendar size={16} />
                                        {new Date(post.createdAt).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', {
                                            month: 'long',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </div>
                                    <div className="inline-block bg-[#6E8C82]/20 text-[#6E8C82] text-xs font-semibold px-3 py-1 rounded-full mb-3 w-fit">
                                        {post.category}
                                    </div>
                                    <h2 className="text-xl font-bold mb-3 text-gray-900">{title}</h2>
                                    {excerpt && (
                                        <p className="text-gray-600 mb-4 line-clamp-3 flex-grow">{excerpt}</p>
                                    )}
                                    <Link
                                        href={`/blog/${post.slug}`}
                                        className="inline-flex items-center text-[#6E8C82] font-semibold hover:underline mt-auto"
                                    >
                                        {t('readMore')} <ArrowRight size={16} className="ml-1" />
                                    </Link>
                                </div>
                            </article>
                        )
                    })}
                </div>

                {posts.length === 0 && (
                    <div className="text-center text-gray-500 py-12 animate-fadeIn">
                        <p className="text-lg">{t('noPosts')}</p>
                    </div>
                )}
            </section>

            {/* Ad Slot */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
                <AdSlot placement="BLOG_BOTTOM" className="w-full min-h-[90px] bg-gray-50 rounded-lg flex items-center justify-center" />
            </div>
        </div>
    )
}
