'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X, Heart } from 'lucide-react'
import clsx from 'clsx'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import LanguageSwitcher from './LanguageSwitcher'

export default function Navbar() {
    const t = useTranslations('nav')
    const [isOpen, setIsOpen] = useState(false)
    const pathname = usePathname()

    const navLinks = [
        { name: t('home'), href: '/' },
        { name: t('about'), href: '/about' },
        { name: t('programs'), href: '/programs' },
        { name: t('getInvolved'), href: '/get-involved' },
        { name: t('blog'), href: '/blog' },
        { name: t('careers'), href: '/careers' },
        { name: t('gallery'), href: '/gallery' },
        { name: t('contact'), href: '/contact' },
    ]

    return (
        <nav className="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-gray-100">
            <div className="w-full px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-32">
                    {/* Logo - Top Left Corner, Large */}
                    <div className="flex-shrink-0">
                        <Link href="/" className="block transform transition-transform duration-300 hover:scale-105">
                            <Image
                                src="/images/nrdc-logo-v3.png"
                                alt="NRDC Logo"
                                width={400}
                                height={200}
                                className="h-28 w-auto rounded-2xl"
                                priority
                            />
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex md:items-center md:space-x-2">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href || (pathname !== '/' && pathname.endsWith(link.href))
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={clsx(
                                        "px-4 py-2.5 rounded-lg text-base font-medium transition-all duration-300 relative group",
                                        isActive
                                            ? "text-[#6E8C82] bg-[#6E8C82]/10"
                                            : "text-gray-700 hover:text-[#6E8C82] hover:bg-gray-50"
                                    )}
                                >
                                    {link.name}
                                    <span className={clsx(
                                        "absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-[#6E8C82] transition-all duration-300",
                                        isActive ? "w-1/2" : "w-0 group-hover:w-1/2"
                                    )} />
                                </Link>
                            )
                        })}

                        <LanguageSwitcher />

                        <Link
                            href="/donate"
                            className="bg-gradient-to-r from-[#2E8B57] to-[#267347] hover:from-[#267347] hover:to-[#1e5a33] text-white px-6 py-2.5 rounded-full text-base font-semibold flex items-center gap-2 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl ml-2"
                        >
                            <Heart size={18} className="animate-pulse" />
                            {t('donate')}
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex items-center gap-4 md:hidden">
                        <LanguageSwitcher />
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-3 rounded-lg text-gray-700 hover:text-[#6E8C82] hover:bg-gray-100 focus:outline-none transition-colors"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <div className={clsx(
                "md:hidden transition-all duration-300 ease-in-out overflow-hidden",
                isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
            )}>
                <div className="px-4 py-4 space-y-2 bg-gradient-to-b from-white to-gray-50 border-t border-gray-100">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href || (pathname !== '/' && pathname.endsWith(link.href))
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={clsx(
                                    "block px-4 py-3 rounded-lg text-base font-medium transition-all duration-300",
                                    isActive
                                        ? "text-[#6E8C82] bg-[#6E8C82]/10 border-l-4 border-[#6E8C82]"
                                        : "text-gray-700 hover:text-[#6E8C82] hover:bg-gray-50 hover:border-l-4 hover:border-[#6E8C82]"
                                )}
                                onClick={() => setIsOpen(false)}
                            >
                                {link.name}
                            </Link>
                        )
                    })}
                    <Link
                        href="/donate"
                        className="block bg-gradient-to-r from-[#2E8B57] to-[#267347] text-white px-4 py-3 rounded-lg text-base font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 shadow-lg mt-4"
                        onClick={() => setIsOpen(false)}
                    >
                        <Heart size={18} />
                        {t('donateNow')}
                    </Link>
                </div>
            </div>
        </nav>
    )
}
