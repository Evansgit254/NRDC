'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

interface Partner {
    id: string
    name: string
    logo: string
    website: string | null
}

export default function PartnerSection() {
    const t = useTranslations('partners')
    const [partners, setPartners] = useState<Partner[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchPartners() {
            try {
                const res = await fetch('/api/partners')
                if (res.ok) {
                    const data = await res.json()
                    setPartners(data)
                }
            } catch (error) {
                console.error('Failed to fetch partners', error)
            } finally {
                setLoading(false)
            }
        }
        fetchPartners()
    }, [])

    if (loading) return <div data-testid="partner-loading">Loading partners...</div>
    if (partners.length === 0) return <div data-testid="partner-empty">No partners found. API Response likely empty or failed.</div>

    return (
        <section className="py-20 bg-gradient-to-b from-white to-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-[#2E8B57] mb-6 tracking-tight relative inline-block">
                        {t('title')}
                        <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-[#6E8C82] rounded-full mt-2"></span>
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
                        {t('subtitle')}
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 items-center justify-items-center">
                    {partners.map((partner) => (
                        <div
                            key={partner.id}
                            className="group w-full h-32 flex items-center justify-center p-6 bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
                        >
                            {partner.logo ? (
                                <a
                                    href={partner.website || '#'}
                                    target={partner.website ? "_blank" : "_self"}
                                    rel={partner.website ? "noopener noreferrer" : ""}
                                    className="w-full h-full relative flex items-center justify-center"
                                >
                                    <Image
                                        src={partner.logo}
                                        alt={partner.name}
                                        fill
                                        className="object-contain p-2 filter grayscale group-hover:grayscale-0 transition-all duration-500 opacity-80 group-hover:opacity-100 transform group-hover:scale-110"
                                    />
                                </a>
                            ) : (
                                <span className="text-sm font-semibold text-center text-gray-500 group-hover:text-[#2E8B57] transition-colors">
                                    {partner.name}
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
