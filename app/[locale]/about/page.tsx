'use client'

import { useEffect, useState } from 'react'
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

    useEffect(() => {
        fetch('/api/team', { cache: 'no-store' }).then(res => res.json()).then(setTeamMembers)
        fetch('/api/resources').then(res => res.json()).then(setResources)
        fetch('/api/content?keys=mission_statement,vision_statement,core_values')
            .then(res => res.json())
            .then(setContent)
    }, [])

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
                            {content.mission_statement || 'To provide nutrition, food security programs, capacity building, and community health support to refugees and displaced persons.'}
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {teamMembers.map((member, index) => (
                        <div
                            key={index}
                            className="text-center"
                        >
                            {member.imageUrl ? (
                                <div className="w-48 h-48 mx-auto mb-4 rounded-full overflow-hidden relative">
                                    <Image
                                        src={member.imageUrl}
                                        alt={member.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            ) : (
                                <div className="w-48 h-48 mx-auto mb-4 rounded-full bg-gray-200 flex items-center justify-center">
                                    <Users size={64} className="text-gray-400" />
                                </div>
                            )}
                            <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                            <p className="text-[#6E8C82] mb-2">{member.title}</p>
                            {member.bio && (
                                <p className="text-gray-600 text-sm max-w-xs mx-auto">{member.bio}</p>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        {resources.map((resource, index) => (
                            <div
                                key={index}
                                onClick={() => trackDownload(resource.id, resource.fileUrl)}
                                className="bg-white/10 p-6 rounded-xl flex items-center justify-between transition-colors cursor-pointer"
                            >
                                <div>
                                    <h3 className="font-bold text-lg">{resource.title}</h3>
                                    <p className="text-sm opacity-80">{resource.fileType} - {resource.fileSize}</p>
                                    {resource.description && (
                                        <p className="text-sm opacity-70 mt-1">{resource.description}</p>
                                    )}
                                </div>
                                <Download size={24} />
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
