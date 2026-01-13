import type { Metadata } from 'next';
import { Inter, Open_Sans } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CookieConsent from '@/components/CookieConsent';
import '../globals.css';
import { defaultMetadata } from '@/lib/seo';
import { ToastProvider } from '@/components/Toast';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const openSans = Open_Sans({ subsets: ['latin'], variable: '--font-open-sans' });

export const metadata: Metadata = defaultMetadata;

export default async function LocaleLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    // Ensure that the incoming `locale` is valid
    if (!['en', 'fr', 'es', 'ar'].includes(locale)) {
        notFound();
    }

    // Providing all messages to the client
    const messages = await getMessages();

    // Determine direction
    const direction = locale === 'ar' ? 'rtl' : 'ltr';

    return (
        <html lang={locale} dir={direction} suppressHydrationWarning>
            <body className={`${inter.variable} ${openSans.variable} font-sans flex flex-col min-h-screen`} suppressHydrationWarning>
                <NextIntlClientProvider messages={messages}>
                    <ToastProvider>
                        <Navbar />
                        <main className="flex-grow">
                            {children}
                        </main>
                        <Footer />
                        <CookieConsent />
                    </ToastProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
