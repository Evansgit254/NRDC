'use client'

import ContactForm from '@/components/ContactForm'
import { MapPin, Phone, Mail } from 'lucide-react'
import { useTranslations } from 'next-intl'

export default function ContactPage() {
    const t = useTranslations('contactPage')

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

            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-8">{t('getInTouch')}</h2>
                        <ContactForm />
                    </div>

                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-8">{t('info')}</h2>

                        <div className="space-y-6 mb-12">
                            <div className="flex gap-4 hover-slide">
                                <div className="bg-[#6E8C82]/20 p-3 rounded-full text-[#6E8C82] h-fit">
                                    <MapPin size={24} />
                                </div>
                                <div className="animate-fadeInRight">
                                    <h3 className="font-bold text-gray-900 mb-1">{t('address')}</h3>
                                    <p className="text-gray-600">
                                        Nairobi, Kenya<br />
                                        P.O. Box 12345-00100
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4 hover-slide">
                                <div className="bg-green-100 p-3 rounded-full text-[#2E8B57] h-fit">
                                    <Phone size={24} />
                                </div>
                                <div className="animate-fadeInRight animation-delay-100">
                                    <h3 className="font-bold text-gray-900 mb-1">{t('phone')}</h3>
                                    <p className="text-gray-600">+254 727 001 702 / +254 702 121 310</p>
                                </div>
                            </div>

                            <div className="flex gap-4 hover-slide">
                                <div className="bg-orange-100 p-3 rounded-full text-orange-600 h-fit">
                                    <Mail size={24} />
                                </div>
                                <div className="animate-fadeInRight animation-delay-200">
                                    <h3 className="font-bold text-gray-900 mb-1">{t('email')}</h3>
                                    <p className="text-gray-600">nrdcofficial12@gmail.com</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-200 rounded-xl overflow-hidden h-96 hover-scale">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d255281.19034933634!2d36.70730744999999!3d-1.3028617!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f1172d84d49a7%3A0xf7cf0254b297924c!2sNairobi!5e0!3m2!1sen!2ske!4v1234567890123"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                title="NRDC Location"
                            ></iframe>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
