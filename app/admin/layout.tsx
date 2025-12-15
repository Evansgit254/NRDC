import type { Metadata } from 'next'
import { Inter, Open_Sans } from 'next/font/google'
import '../globals.css'
import { defaultMetadata } from '@/lib/seo'
import AdminShell from './AdminShell'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const openSans = Open_Sans({ subsets: ['latin'], variable: '--font-open-sans' })

export const metadata: Metadata = {
    ...defaultMetadata,
    title: 'NRDC Admin',
    robots: {
        index: false,
        follow: false,
    },
}

export default function AdminRootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${inter.variable} ${openSans.variable} font-sans flex flex-col min-h-screen`} suppressHydrationWarning>
                <AdminShell>
                    {children}
                </AdminShell>
            </body>
        </html>
    )
}
