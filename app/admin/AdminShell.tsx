'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
    LayoutDashboard,
    FileText,
    BookOpen,
    Image as ImageIcon,
    Mail,
    LogOut,
    Menu,
    X,
    Settings,
    Users,
    BarChart3,
    FileDown,
    MessageSquare,
    Edit3,
    AlertTriangle,
    Activity,
    Globe,
    Megaphone,
    Heart,
    Repeat,
    CreditCard,
} from 'lucide-react'
import clsx from 'clsx'
import { ToastProvider } from '@/components/Toast'
import { ConfirmDialogProvider } from '@/components/ConfirmDialog'
import GlobalSearch from '@/components/GlobalSearch'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const navItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard, adminOnly: false },
    { name: 'Programs', href: '/admin/programs', icon: FileText, adminOnly: false },
    { name: 'Blog Posts', href: '/admin/blog', icon: BookOpen, adminOnly: false },
    { name: 'Gallery', href: '/admin/gallery', icon: ImageIcon, adminOnly: false },
    { name: 'Team Members', href: '/admin/team', icon: Users, adminOnly: true },
    { name: 'Statistics', href: '/admin/statistics', icon: BarChart3, adminOnly: false },
    { name: 'Resources', href: '/admin/resources', icon: FileDown, adminOnly: false },
    { name: 'Testimonials', href: '/admin/testimonials', icon: MessageSquare, adminOnly: false },
    { name: 'Site Content', href: '/admin/content', icon: Edit3, adminOnly: false },
    { name: 'Contact Messages', href: '/admin/contact', icon: Mail, adminOnly: false },
    { name: 'Translations', href: '/admin/translations', icon: Globe, adminOnly: true },
    { name: 'Advertisements', href: '/admin/ads', icon: Megaphone, adminOnly: false },
    { name: 'Donations', href: '/admin/donations', icon: Heart, adminOnly: false },
    { name: 'Subscriptions', href: '/admin/subscriptions', icon: Repeat, adminOnly: false },
    { name: 'Bank & Payment', href: '/admin/bank-settings', icon: CreditCard, adminOnly: true },
    { name: 'System Logs', href: '/admin/logs', icon: AlertTriangle, adminOnly: true },
    { name: 'Audit Logs', href: '/admin/audit', icon: Activity, adminOnly: true },
    { name: 'User Management', href: '/admin/users', icon: Users, adminOnly: true },
    { name: 'Settings', href: '/admin/settings', icon: Settings, adminOnly: true },
]


export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(false)
    const [loading, setLoading] = useState(true)
    const [userRole, setUserRole] = useState<string | null>(null)

    useEffect(() => {
        // Public admin pages that don't require authentication
        const publicPages = ['/admin/login', '/admin/forgot-password', '/admin/reset-password']
        if (publicPages.includes(pathname) || pathname.startsWith('/admin/reset-password')) {
            setLoading(false)
            return
        }

        setLoading(true) // Ensure we show spinner while checking auth for protected pages

        async function checkAuth() {
            try {
                const res = await fetch('/api/auth/me')
                const data = await res.json()

                if (!data.user) {
                    router.push('/admin/login')
                } else {
                    setUserRole(data.user.role)
                    setLoading(false)
                }
            } catch (error) {
                console.error('Auth check failed:', error)
                setLoading(false)
            }
        }
        checkAuth()
    }, [pathname, router]) // Add dependencies

    async function handleLogout() {
        await fetch('/api/auth/me', { method: 'POST' })
        router.push('/admin/login')
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6E8C82]"></div>
            </div>
        )
    }

    const publicPages = ['/admin/login', '/admin/forgot-password', '/admin/reset-password']
    if (publicPages.includes(pathname) || pathname.startsWith('/admin/reset-password')) {
        // For admin auth pages, we need to provide minimal i18n context for Navbar
        // We'll use English as default
        const messages = require('@/messages/en.json')
        const { NextIntlClientProvider } = require('next-intl')

        return (
            <NextIntlClientProvider locale="en" messages={messages}>
                <Navbar />
                <main className="flex-grow">
                    {children}
                </main>
                <Footer />
            </NextIntlClientProvider>
        )
    }

    return (
        <ConfirmDialogProvider>
            <ToastProvider>
                <div className="min-h-screen bg-gray-50 flex">
                    {/* Sidebar */}
                    <aside className={clsx(
                        'fixed inset-y-0 left-0 z-50 w-64 bg-[#6E8C82] text-white transform transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0 flex flex-col',
                        isOpen ? 'translate-x-0' : '-translate-x-full'
                    )}>
                        <div className="p-6 border-b border-[#587068] flex-shrink-0">
                            <h2 className="text-xl font-bold text-white">Admin Panel</h2>
                        </div>
                        <nav className="flex-1 overflow-y-auto p-4">
                            {userRole === null ? (
                                // Show skeleton loading state while fetching user role
                                <div className="space-y-2">
                                    {[1, 2, 3, 4, 5, 6].map((i) => (
                                        <div key={i} className="h-12 bg-[#6E8C82] rounded-lg animate-pulse" />
                                    ))}
                                </div>
                            ) : (
                                navItems
                                    .filter(item => !item.adminOnly || userRole === 'ADMIN')
                                    .map((item) => (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            onClick={() => setIsOpen(false)}
                                            className={clsx(
                                                "flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#587068] transition-colors mb-2",
                                                pathname === item.href && "bg-[#587068]"
                                            )}
                                        >
                                            <item.icon size={20} />
                                            {item.name}
                                        </Link>
                                    ))
                            )}
                        </nav>
                        <div className="p-4 border-t border-[#587068] flex-shrink-0">
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#587068] transition-colors w-full"
                            >
                                <LogOut size={20} />
                                Logout
                            </button>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1 flex flex-col w-full">
                        <header className="bg-white shadow-sm p-4 lg:hidden">
                            <button onClick={() => setIsOpen(!isOpen)}>
                                {isOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </header>
                        <main className="flex-1 p-8">
                            {children}
                        </main>
                    </div>


                    {/* Overlay */}
                    {
                        isOpen && (
                            <div
                                className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                                onClick={() => setIsOpen(false)}
                            />
                        )
                    }
                </div>
                <GlobalSearch />
            </ToastProvider>
        </ConfirmDialogProvider>
    )
}
