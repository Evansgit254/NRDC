import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import AdSlot from '@/components/AdSlot'

export const dynamic = 'force-static'
export const revalidate = 60

export function generateStaticParams() {
    return [{ locale: 'en' }, { locale: 'fr' }, { locale: 'es' }, { locale: 'ar' }, { locale: 'sw' }];
}

export default async function ProgramsPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'programsPage' });

    const programs = await prisma.program.findMany({
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
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">{t('title')}</h1>
                    <p className="text-xl max-w-3xl mx-auto text-white/80">
                        {t('subtitle')}
                    </p>
                </div>
            </section>

            {/* Ad Slot */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                <AdSlot placement="PROGRAMS_TOP" className="w-full min-h-[90px] bg-gray-50 rounded-lg flex items-center justify-center" />
            </div>

            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="flex flex-wrap justify-center gap-8 md:gap-10">
                    {programs.map((program) => {
                        const translation = program.translations[0];
                        const title = translation?.title || program.title;
                        const description = translation?.description || program.description;

                        const photos = JSON.parse(program.photos || '[]')
                        const coverImage = photos[0] || 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=2070&auto=format&fit=crop'

                        return (
                            <div
                                key={program.id}
                                className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)] overflow-hidden transition-all duration-300 border border-gray-100 group flex flex-col w-full sm:w-[calc(50%-1.5rem)] lg:w-[calc(33.333%-2rem)] max-w-[380px]"
                            >
                                <div className="h-56 bg-gray-200 relative overflow-hidden">
                                    <div
                                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                        style={{ backgroundImage: `url("${coverImage}")` }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </div>
                                <div className="p-6 flex flex-col flex-grow">
                                    <h2 className="text-2xl font-bold mb-3 text-gray-900 group-hover:text-[#6E8C82] transition-colors">{title}</h2>
                                    <p className="text-gray-600 mb-6 line-clamp-3 flex-grow">{description}</p>
                                    <div className="mt-auto">
                                        <Link
                                            href={`/programs/${program.slug}`}
                                            className="inline-flex items-center text-[#2E8B57] font-semibold hover:text-[#267347] hover:underline transition-colors group/link"
                                        >
                                            {t('readMore')}
                                            <ArrowRight size={16} className="ml-1 transition-transform group-hover/link:translate-x-1" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </section>

            {/* Ad Slot */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
                <AdSlot placement="PROGRAMS_BOTTOM" className="w-full min-h-[90px] bg-gray-50 rounded-lg flex items-center justify-center" />
            </div>
        </div>
    )
}
