import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Calendar, ArrowRight } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import AdSlot from '@/components/AdSlot'
import { generateMetadata as generateBaseMetadata, generateBreadcrumbSchema } from '@/lib/seo';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'blogPage' });
    const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'NRDC.KENYA';

    return generateBaseMetadata({
        title: `${t('title')} | ${siteName}`,
        description: t('subtitle'),
        locale,
        url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://nrdc.africa'}/${locale}/blog`,
    });
}

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const tNav = await getTranslations({ locale, namespace: 'nav' });
    const tBlog = await getTranslations({ locale, namespace: 'blogPage' });
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nrdc.africa';

    const breadcrumbSchema = generateBreadcrumbSchema([
        { name: tNav('home'), item: `${baseUrl}/${locale}` },
        { name: tBlog('title'), item: `${baseUrl}/${locale}/blog` },
    ]);

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
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            <section className="bg-[#6E8C82] text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">{tBlog('title')}</h1>
                    <p className="text-xl max-w-3xl mx-auto text-white/80">
                        {tBlog('subtitle')}
                    </p>
                </div>
            </section>

            {/* Ad Slot */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                <AdSlot placement="BLOG_TOP" className="w-full min-h-[90px] bg-gray-50 rounded-lg flex items-center justify-center" />
            </div>

            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="flex flex-wrap justify-center gap-8 md:gap-10">
                    {posts.map((post) => {
                        const translation = post.translations[0];
                        const title = translation?.title || post.title;
                        const excerpt = translation?.excerpt || post.excerpt;

                        return (
                            <article
                                key={post.id}
                                className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)] overflow-hidden transition-all duration-300 border border-gray-100 group flex flex-col w-full sm:w-[calc(50%-1.5rem)] lg:w-[calc(33.333%-2rem)] max-w-[380px]"
                            >
                                {post.image && (
                                    <div className="h-48 bg-gray-200 relative overflow-hidden">
                                        <div
                                            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                            style={{ backgroundImage: `url("${post.image}")` }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </div>
                                )}
                                <div className="p-6 flex flex-col flex-grow">
                                    <div className="flex items-center gap-4 text-sm mb-4">
                                        <div className="flex items-center gap-1.5 text-gray-500">
                                            <Calendar size={14} />
                                            {new Date(post.createdAt).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </div>
                                        <div className="bg-[#6E8C82]/10 text-[#6E8C82] text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wide">
                                            {post.category}
                                        </div>
                                    </div>
                                    <h2 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-[#6E8C82] transition-colors line-clamp-2">{title}</h2>
                                    {excerpt && (
                                        <p className="text-gray-600 mb-6 line-clamp-3 text-sm leading-relaxed">{excerpt}</p>
                                    )}
                                    <div className="mt-auto">
                                        <Link
                                            href={`/blog/${post.slug}`}
                                            className="inline-flex items-center text-[#2E8B57] font-bold hover:text-[#267347] hover:underline transition-colors group/link"
                                        >
                                            {tBlog('readMore')}
                                            <ArrowRight size={16} className="ml-1 transition-transform group-hover/link:translate-x-1" />
                                        </Link>
                                    </div>
                                </div>
                            </article>
                        )
                    })}
                </div>

                {posts.length === 0 && (
                    <div className="text-center text-gray-500 py-12 animate-fadeIn">
                        <p className="text-lg">{tBlog('noPosts')}</p>
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
