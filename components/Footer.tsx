'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin, Music2, Linkedin } from 'lucide-react'
import { useTranslations } from 'next-intl'

export default function Footer() {
    const t = useTranslations('footer')

    return (
        <footer className="bg-gray-50 text-gray-900 pt-12 pb-8 border-t border-gray-200">
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
                        <p className="text-gray-600 text-sm">
                            {t('aboutDesc')}
                        </p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">{t('quickLinks')}</h3>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li><Link href="/about" className="hover:text-[#6E8C82]">{t('aboutUs')}</Link></li>
                            <li><Link href="/programs" className="hover:text-[#6E8C82]">{t('ourPrograms')}</Link></li>
                            <li><Link href="/blog" className="hover:text-[#6E8C82]">{t('newsStories')}</Link></li>
                            <li><Link href="/contact" className="hover:text-[#6E8C82]">{t('contactUs')}</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">{t('contact')}</h3>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li className="flex items-center gap-2"><MapPin size={16} className="text-[#6E8C82]" /> Nairobi, Kenya</li>
                            <li className="flex items-center gap-2"><Phone size={16} className="text-[#6E8C82]" /> +254 727 001 702 / +254 702 121 310 / +254 726 319978</li>
                            <li className="flex items-center gap-2"><Mail size={16} className="text-[#6E8C82]" /> nrdc@nrdc.africa</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">{t('followUs')}</h3>
                        <div className="flex space-x-4">
                            <a href="https://facebook.com/nrdc.kenya" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#6E8C82] transition-colors"><Facebook size={20} /></a>
                            <a href="https://twitter.com/nrdc_kenya" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#6E8C82] transition-colors"><Twitter size={20} /></a>
                            <a href="https://instagram.com/nrdc.kenya" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#6E8C82] transition-colors"><Instagram size={20} /></a>
                            <a href="https://www.linkedin.com/company/nutrition-for-refuges-displaced-communities-nrdc/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#6E8C82] transition-colors"><Linkedin size={20} /></a>
                            <a href="https://www.tiktok.com/@nrdc8?_r=1&_t=ZS-938cuYIVMfN" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#6E8C82] transition-colors"><Music2 size={20} /></a>
                        </div>
                    </div>
                </div>
                <div className="border-t border-gray-200 mt-8 pt-8 text-center text-sm text-gray-500">
                    &copy; {new Date().getFullYear()} NRDC. {t('rights')} | <Link href="/privacy-policy" className="hover:text-[#6E8C82]">{t('privacyPolicy')}</Link> | <Link href="/admin/login" className="hover:text-[#6E8C82]">{t('adminLogin')}</Link>
                </div>
            </div>
        </footer>
    )
}
