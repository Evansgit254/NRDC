'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { Download, Target, Lightbulb, Users } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface TeamMember {
    id: string
    name: string
    title: string
    bio: string | null
    imageUrl: string | null
}

interface Resource {
    id: string
    title: string
    description: string | null
    fileUrl: string
    fileSize: string
    fileType: string
}

interface SiteContent {
    mission_statement?: string
    vision_statement?: string
    core_values?: string
}

export default function AboutPage() {
    const t = useTranslations('aboutPage')
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
    const [resources, setResources] = useState<Resource[]>([])
    const [content, setContent] = useState<SiteContent>({})

    const params = useParams()
    const locale = params.locale as string

    useEffect(() => {
        const localeQuery = locale ? `?locale=${locale}` : ''
        fetch(`/api/team${localeQuery}`, { cache: 'no-store' }).then(res => res.json()).then(setTeamMembers)
        fetch(`/api/resources${localeQuery}`).then(res => res.json()).then(setResources)
        const contentKeys = 'mission_statement,vision_statement,core_values'
        fetch(`/api/content?keys=${contentKeys}${locale ? `&locale=${locale}` : ''}`)
            .then(res => res.json())
            .then(setContent)
    }, [locale])

    async function trackDownload(id: string, url: string) {
        // Track download
        await fetch(`/api/resources/${id}`)
        // Download file
        window.open(url, '_blank')
    }

    return (
        <div className="pb-16">
            {/* Hero */}
            <section className="bg-[#6E8C82] text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">{t('title')}</h1>
                        <p className="text-xl max-w-3xl mx-auto text-white/80">
                            {t('subtitle')}
                        </p>
                    </div>
                </div>
            </section>

            {/* Mission & Vision - Dynamic */}
            <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 h-full">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="bg-[#6E8C82]/20 p-3 rounded-full text-[#6E8C82]">
                                <Target size={24} />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">{t('mission')}</h2>
                        </div>
                        <p className="text-gray-700 leading-relaxed text-lg">
                            {content.mission_statement || ''}
                        </p>
                    </div>

                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 h-full">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="bg-green-100 p-3 rounded-full text-[#2E8B57]">
                                <Lightbulb size={24} />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">{t('vision')}</h2>
                        </div>
                        <p className="text-gray-700 leading-relaxed text-lg">
                            {content.vision_statement || t('visionStatement')}
                        </p>
                    </div>

                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 h-full">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="bg-purple-100 p-3 rounded-full text-purple-600">
                                <Users size={24} />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">Core Values</h2>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {content.core_values ? (
                                content.core_values.split(',').map((value, i) => (
                                    <span key={i} className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                                        {value.trim()}
                                    </span>
                                ))
                            ) : (
                                <p className="text-gray-500 italic">Values not set</p>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Leadership - Dynamic */}
            <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">{t('leadership')}</h2>
                </div>
                <div className="flex flex-wrap justify-center gap-12 md:gap-16">
                    {teamMembers.map((member, index) => (
                        <div
                            key={index}
                            className="text-center group w-full sm:w-64"
                        >
                            {member.imageUrl ? (
                                <div className="w-48 h-48 mx-auto mb-6 rounded-full p-2 relative border-4 border-white shadow-xl bg-white ring-1 ring-gray-200/50 transition-all duration-300 group-hover:shadow-2xl group-hover:-translate-y-2">
                                    <div className="w-full h-full rounded-full overflow-hidden relative shadow-inner">
                                        <Image
                                            src={member.imageUrl}
                                            alt={member.name}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                            sizes="192px"
                                            priority={index < 3}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="w-48 h-48 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center border-4 border-white shadow-lg">
                                    <Users size={64} className="text-gray-300" />
                                </div>
                            )}
                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#6E8C82] transition-colors">{member.name}</h3>
                            <p className="text-[#6E8C82] font-medium mb-3 uppercase text-xs tracking-widest">{member.title}</p>
                            {member.bio && (
                                <p className="text-gray-600 text-sm leading-relaxed max-w-[240px] mx-auto">{member.bio}</p>
                            )}
                        </div>
                    ))}
                </div>
                {teamMembers.length === 0 && (
                    <p className="text-center text-gray-500">{t('noTeam')}</p>
                )}
            </section>

            {/* Downloads - Dynamic */}
            <section className="bg-[#6E8C82] text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div>
                        <h2 className="text-3xl font-bold mb-8 text-center">{t('resources')}</h2>
                    </div>
                    <div className="flex flex-wrap justify-center gap-6 max-w-5xl mx-auto">
                        {resources.map((resource, index) => (
                            <div
                                key={index}
                                onClick={() => trackDownload(resource.id, resource.fileUrl)}
                                className="bg-white/10 hover:bg-white/20 p-8 rounded-2xl flex items-center justify-between transition-all duration-300 cursor-pointer border border-white/10 group w-full md:w-[calc(50%-0.75rem)]"
                            >
                                <div className="flex-grow mr-4">
                                    <h3 className="font-bold text-lg mb-1 group-hover:text-white transition-colors">{resource.title}</h3>
                                    <div className="flex items-center gap-2 text-sm text-white/70">
                                        <span className="bg-white/10 px-2 py-0.5 rounded text-xs uppercase font-bold">{resource.fileType}</span>
                                        <span>{resource.fileSize}</span>
                                    </div>
                                    {resource.description && (
                                        <p className="text-sm text-white/60 mt-2 line-clamp-2 leading-relaxed">{resource.description}</p>
                                    )}
                                </div>
                                <div className="bg-white text-[#6E8C82] p-3 rounded-full transition-transform duration-300 group-hover:scale-110 shadow-lg">
                                    <Download size={20} />
                                </div>
                            </div>
                        ))}
                    </div>
                    {resources.length === 0 && (
                        <p className="text-center text-white/70">{t('noResources')}</p>
                    )}
                </div>
            </section>
        </div>
    )
}
