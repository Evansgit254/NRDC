'use client'

import { useEffect, useState } from 'react'
import { Briefcase, ChevronDown, ChevronUp, MapPin, Clock, ArrowRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import clsx from 'clsx'

interface Vacancy {
    id: string
    title: string
    type: 'PRO' | 'VOLUNTEER'
    location: string
    duration: string
    responsibilities: string[]
    requirements: {
        education: string[]
        experience: string[]
    }
    skills: string[]
    active: boolean
}

export default function CareersPage() {
    const t = useTranslations('careers')
    const [vacancies, setVacancies] = useState<Vacancy[]>([])
    const [loading, setLoading] = useState(true)
    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

    useEffect(() => {
        fetchVacancies()
    }, [])

    async function fetchVacancies() {
        try {
            const res = await fetch('/api/content?keys=volunteer_vacancies')
            const data = await res.json()
            if (data.volunteer_vacancies) {
                const parsed = JSON.parse(data.volunteer_vacancies)
                setVacancies(Array.isArray(parsed) ? parsed : [])
            }
        } catch (error) {
            console.error('Error fetching vacancies:', error)
        } finally {
            setLoading(false)
        }
    }

    const toggleExpand = (id: string) => {
        const newExpanded = new Set(expandedIds)
        if (newExpanded.has(id)) {
            newExpanded.delete(id)
        } else {
            newExpanded.add(id)
        }
        setExpandedIds(newExpanded)
    }

    const activeVacancies = vacancies.filter(v => v.active)

    return (
        <div className="pb-16 min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="bg-[#6E8C82] text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 italic">{t('title')}</h1>
                    <p className="text-xl max-w-2xl mx-auto text-green-50 opacity-90">
                        {t('subtitle')}
                    </p>
                </div>
            </section>

            {/* Vacancies Section */}
            <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6E8C82] mx-auto"></div>
                        <p className="mt-4 text-gray-600 italic">Finding opportunities...</p>
                    </div>
                ) : activeVacancies.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center shadow-md border border-gray-100">
                        <Briefcase size={64} className="text-gray-200 mx-auto mb-6" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-2 italic">Current Openings</h2>
                        <p className="text-gray-500 max-w-md mx-auto">{t('noOpenings')}</p>
                        <Link
                            href="/get-involved"
                            className="mt-8 inline-flex items-center gap-2 text-[#6E8C82] font-semibold hover:underline"
                        >
                            General Volunteering <ArrowRight size={18} />
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-8 border-l-4 border-[#6E8C82] pl-4">
                            Current Openings
                        </h2>
                        {activeVacancies.map((vacancy) => (
                            <div
                                key={vacancy.id}
                                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md"
                            >
                                <div
                                    className="p-6 cursor-pointer"
                                    onClick={() => toggleExpand(vacancy.id)}
                                >
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className={clsx(
                                                    "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full",
                                                    vacancy.type === 'PRO' ? "bg-blue-100 text-blue-700" : "bg-green-100 text-[#2E8B57]"
                                                )}>
                                                    {vacancy.type === 'PRO' ? t('professional') : t('volunteer')}
                                                </span>
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900">{vacancy.title}</h3>
                                            <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
                                                <div className="flex items-center gap-1.5">
                                                    <MapPin size={16} className="text-[#6E8C82]" />
                                                    {vacancy.location}
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <Clock size={16} className="text-[#6E8C82]" />
                                                    {vacancy.duration}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <button
                                                className="text-[#6E8C82] hover:bg-[#6E8C82]/10 p-2 rounded-full transition-colors"
                                            >
                                                {expandedIds.has(vacancy.id) ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {expandedIds.has(vacancy.id) && (
                                    <div className="px-6 pb-8 pt-0 border-t border-gray-50 bg-gray-50/30">
                                        <div className="mt-8 space-y-8">
                                            <div>
                                                <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                                    <div className="w-1.5 h-6 bg-[#6E8C82] rounded-full"></div>
                                                    {t('responsibilities')}
                                                </h4>
                                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    {vacancy.responsibilities.map((item, i) => (
                                                        <li key={i} className="flex items-start gap-3 text-gray-600 text-sm">
                                                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#6E8C82] flex-shrink-0"></div>
                                                            {item}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <div>
                                                    <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                                        <div className="w-1.5 h-6 bg-[#6E8C82] rounded-full"></div>
                                                        {t('requirements')}
                                                    </h4>
                                                    <div className="space-y-4">
                                                        <div>
                                                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">{t('education')}</span>
                                                            <ul className="space-y-2">
                                                                {vacancy.requirements.education.map((item, i) => (
                                                                    <li key={i} className="text-sm text-gray-600">{item}</li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                        <div>
                                                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">{t('experience')}</span>
                                                            <ul className="space-y-2">
                                                                {vacancy.requirements.experience.map((item, i) => (
                                                                    <li key={i} className="text-sm text-gray-600">{item}</li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div>
                                                    <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                                        <div className="w-1.5 h-6 bg-[#6E8C82] rounded-full"></div>
                                                        {t('skills')}
                                                    </h4>
                                                    <ul className="space-y-3">
                                                        {vacancy.skills.map((item, i) => (
                                                            <li key={i} className="bg-white p-3 rounded-xl border border-gray-100 text-sm text-gray-600 shadow-sm font-medium">
                                                                {item}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>

                                            <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
                                                <p className="text-sm text-gray-500 italic">
                                                    Interested? Please use our application form as the first step.
                                                </p>
                                                <Link
                                                    href="/get-involved"
                                                    className="w-full md:w-auto bg-[#6E8C82] hover:bg-[#587068] text-white px-8 py-3 rounded-full font-bold transition-all duration-300 text-center shadow-lg hover:shadow-xl hover:scale-105"
                                                >
                                                    {t('applyNow')}
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    )
}
