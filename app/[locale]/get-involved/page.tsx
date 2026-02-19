'use client'

import VolunteerForm from '@/components/VolunteerForm'
import { Heart, Handshake, Users } from 'lucide-react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

export default function GetInvolvedPage() {
    const t = useTranslations('getInvolved')

    return (
        <div className="pb-16">
            <section className="bg-[#2E8B57] text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">{t('title')}</h1>
                        <p className="text-xl max-w-3xl mx-auto text-green-100">
                            {t('subtitle')}
                        </p>
                    </div>
                </div>
            </section>

            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    <div>
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-8">{t('waysToSupport')}</h2>
                        </div>

                        <div className="space-y-8">
                            <div className="flex gap-4">
                                <div className="bg-[#6E8C82]/20 p-3 rounded-full text-[#6E8C82] h-fit">
                                    <Heart size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{t('donateTitle')}</h3>
                                    <p className="text-gray-600 mb-4">
                                        {t('donateDesc')}
                                    </p>
                                    <Link
                                        href="/donate"
                                        className="text-[#6E8C82] font-semibold hover:underline inline-flex items-center gap-1"
                                    >
                                        {t('donateLink')} &rarr;
                                    </Link>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="bg-green-100 p-3 rounded-full text-[#2E8B57] h-fit">
                                    <Handshake size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{t('partnerTitle')}</h3>
                                    <p className="text-gray-600 mb-4">
                                        {t('partnerDesc')}
                                    </p>
                                    <Link
                                        href="/contact"
                                        className="text-[#6E8C82] font-semibold hover:underline inline-flex items-center gap-1"
                                    >
                                        {t('partnerLink')} &rarr;
                                    </Link>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="bg-orange-100 p-3 rounded-full text-orange-600 h-fit">
                                    <Users size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{t('volunteerTitle')}</h3>
                                    <p className="text-gray-600 mb-6">
                                        {t('volunteerDesc')}
                                    </p>
                                    <div className="p-6 bg-gray-50 border border-[#6E8C82]/10 rounded-2xl">
                                        <p className="text-sm text-gray-600 mb-3 italic">{t('viewCareers')}</p>
                                        <Link
                                            href="/careers"
                                            className="inline-flex items-center gap-2 bg-[#6E8C82] text-white px-6 py-2 rounded-full text-sm font-bold transition-all hover:bg-[#587068] shadow-sm hover:shadow-md"
                                        >
                                            {t('careersLink')} &rarr;
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 h-fit">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('volunteerApp')}</h2>
                        <VolunteerForm />
                    </div>
                </div>
            </section>
        </div>
    )
}

