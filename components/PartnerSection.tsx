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
        <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('title')}</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        {t('subtitle')}
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 items-center justify-items-center opacity-75 grayscale hover:grayscale-0 transition-all duration-500">
                    {partners.map((partner) => (
                        <div key={partner.id} className="w-full flex items-center justify-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow h-24">
                            {partner.logo ? (
                                <a
                                    href={partner.website || '#'}
                                    target={partner.website ? "_blank" : "_self"}
                                    rel={partner.website ? "noopener noreferrer" : ""}
                                    className="w-full h-full relative"
                                >
                                    <Image
                                        src={partner.logo}
                                        alt={partner.name}
                                        fill
                                        className="object-contain p-2"
                                    />
                                </a>
                            ) : (
                                <span className="text-sm font-semibold text-center text-gray-500">{partner.name}</span>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
