'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react'
import { useTranslations } from 'next-intl'

export default function Footer() {
    const t = useTranslations('footer')

    return (
        <footer className="bg-[#0A0A0A] text-white pt-12 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <Image
                            src="/images/nrdc-logo-v3.png"
                            alt="NRDC Logo"
                            width={180}
                            height={90}
                            className="h-20 w-auto mb-4 rounded-xl"
                        />
                        <p className="text-gray-400 text-sm">
                            {t('aboutDesc')}
                        </p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">{t('quickLinks')}</h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><Link href="/about" className="hover:text-white">{t('aboutUs')}</Link></li>
                            <li><Link href="/programs" className="hover:text-white">{t('ourPrograms')}</Link></li>
                            <li><Link href="/blog" className="hover:text-white">{t('newsStories')}</Link></li>
                            <li><Link href="/contact" className="hover:text-white">{t('contactUs')}</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">{t('contact')}</h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li className="flex items-center gap-2"><MapPin size={16} /> Nairobi, Kenya</li>
                            <li className="flex items-center gap-2"><Phone size={16} /> +254 727 001 702 / +254 702 121 310</li>
                            <li className="flex items-center gap-2"><Mail size={16} /> info@nrdc.org</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">{t('followUs')}</h3>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-white"><Facebook size={20} /></a>
                            <a href="#" className="text-gray-400 hover:text-white"><Twitter size={20} /></a>
                            <a href="#" className="text-gray-400 hover:text-white"><Instagram size={20} /></a>
                        </div>
                    </div>
                </div>
                <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
                    &copy; {new Date().getFullYear()} NRDC. {t('rights')} | <Link href="/privacy-policy" className="hover:text-white">{t('privacyPolicy')}</Link> | <Link href="/admin/login" className="hover:text-white">{t('adminLogin')}</Link>
                </div>
            </div>
        </footer>
    )
}
