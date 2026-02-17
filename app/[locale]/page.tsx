import { getTranslations } from 'next-intl/server';
import HomeClient from './HomeClient';
import { generateMetadata as generateBaseMetadata, generateOrganizationSchema } from '@/lib/seo';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'hero' });
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'NRDC.KENYA';

  return generateBaseMetadata({
    title: `${t('title')} | ${siteName}`,
    description: t('subtitle'),
    locale,
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://nrdc.africa'}/${locale}`,
  });
}

export default function Home() {
  const organizationSchema = generateOrganizationSchema();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <HomeClient />
    </>
  );
}
