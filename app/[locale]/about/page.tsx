import { getTranslations } from 'next-intl/server';
import AboutClient from './AboutClient';
import { generateMetadata as generateBaseMetadata, generateBreadcrumbSchema } from '@/lib/seo';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'aboutPage' });
    const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'NRDC.KENYA';

    return generateBaseMetadata({
        title: `${t('title')} | ${siteName}`,
        description: t('subtitle'),
        locale,
        url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://nrdc.africa'}/${locale}/about`,
    });
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const tNav = await getTranslations({ locale, namespace: 'nav' });
    const tAbout = await getTranslations({ locale, namespace: 'aboutPage' });
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nrdc.africa';

    const breadcrumbSchema = generateBreadcrumbSchema([
        { name: tNav('home'), item: `${baseUrl}/${locale}` },
        { name: tAbout('title'), item: `${baseUrl}/${locale}/about` },
    ]);

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            <AboutClient />
        </>
    );
}
