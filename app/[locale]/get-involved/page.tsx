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
                                    <p className="text-gray-600">
                                        {t('volunteerDesc')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-8">{t('currentOpportunities')}</h2>
                            <div className="space-y-4">
                                {['bdm'].map((key) => (
                                    <div key={key} className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
                                        <div className="p-6">
                                            <div className="flex justify-between items-start gap-4">
                                                <h3 className="text-xl font-bold text-gray-900">{t(`vacancies.${key}.title`)}</h3>
                                                <button
                                                    onClick={() => {
                                                        const el = document.getElementById(`details-${key}`);
                                                        if (el) el.classList.toggle('hidden');
                                                    }}
                                                    className="text-sm font-semibold text-[#6E8C82] hover:underline whitespace-nowrap"
                                                >
                                                    {t('viewDetails')}
                                                </button>
                                            </div>

                                            <div id={`details-${key}`} className="mt-6 hidden space-y-6 border-t pt-6">
                                                <div>
                                                    <h4 className="font-bold text-gray-900 mb-2">{t('responsibilities')}</h4>
                                                    <ul className="list-disc pl-5 space-y-1 text-gray-600">
                                                        {(t.raw(`vacancies.${key}.responsibilities`) as string[]).map((item, i) => (
                                                            <li key={i}>{item}</li>
                                                        ))}
                                                    </ul>
                                                </div>

                                                <div>
                                                    <h4 className="font-bold text-gray-900 mb-2">{t('requirements')}</h4>
                                                    <div className="space-y-4">
                                                        <div>
                                                            <span className="text-sm font-semibold text-gray-700 block mb-1">{t('education')}</span>
                                                            <ul className="list-disc pl-5 space-y-1 text-gray-600">
                                                                {(t.raw(`vacancies.${key}.requirements.education`) as string[]).map((item, i) => (
                                                                    <li key={i}>{item}</li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                        <div>
                                                            <span className="text-sm font-semibold text-gray-700 block mb-1">{t('experience')}</span>
                                                            <ul className="list-disc pl-5 space-y-1 text-gray-600">
                                                                {(t.raw(`vacancies.${key}.requirements.experience`) as string[]).map((item, i) => (
                                                                    <li key={i}>{item}</li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div>
                                                    <h4 className="font-bold text-gray-900 mb-2">{t('skills')}</h4>
                                                    <ul className="list-disc pl-5 space-y-1 text-gray-600">
                                                        {(t.raw(`vacancies.${key}.skills`) as string[]).map((item, i) => (
                                                            <li key={i}>{item}</li>
                                                        ))}
                                                    </ul>
                                                </div>

                                                <button
                                                    onClick={() => document.getElementById(`details-${key}`)?.classList.add('hidden')}
                                                    className="text-sm font-semibold text-gray-400 hover:text-gray-600 underline"
                                                >
                                                    {t('hideDetails')}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('volunteerApp')}</h2>
                            <VolunteerForm />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

