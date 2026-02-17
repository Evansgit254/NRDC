import { Metadata } from 'next'

interface SEOParams {
    title: string
    description: string
    keywords?: string[]
    image?: string
    url?: string
    type?: 'website' | 'article'
    publishedTime?: string
    modifiedTime?: string
    author?: string
}

/**
 * Generate comprehensive meta tags for a page
 */
export function generateMetadata(params: SEOParams & { locale?: string }): Metadata {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nrdc.africa'
    const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'NRDC.KENYA'
    const defaultImage = `${siteUrl}/en/opengraph-image`

    const {
        title,
        description,
        keywords = [],
        image = defaultImage,
        url = siteUrl,
        type = 'website',
        author,
        publishedTime,
        modifiedTime,
        locale = 'en'
    } = params

    const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`
    const imageUrl = image.startsWith('http') ? image : `${siteUrl}${image}`

    // Supported locales for hreflang
    const locales = ['en', 'fr', 'es', 'ar', 'sw']
    const languages: Record<string, string> = {}

    // Generate alternate localized URLs
    locales.forEach(l => {
        // Handle root path vs subpaths
        const path = url.replace(siteUrl, '').replace(/^\/[a-z]{2}(\/|$)/, '/')
        languages[l] = `${siteUrl}/${l}${path === '/' ? '' : path}`
    })

    return {
        title: {
            absolute: fullTitle,
        },
        description,
        keywords: keywords.join(', '),
        authors: author ? [{ name: author }] : [{ name: 'NRDC' }],
        openGraph: {
            title: fullTitle,
            description,
            url,
            siteName,
            images: [
                {
                    url: imageUrl,
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
            locale: locale === 'ar' ? 'ar_AR' : `${locale}_${locale.toUpperCase()}`,
            type,
            publishedTime,
            modifiedTime,
        },
        twitter: {
            card: 'summary_large_image',
            title: fullTitle,
            description,
            images: [imageUrl],
            creator: '@NRDC_KENYA',
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
        },
        alternates: {
            canonical: url,
            languages,
        },
    }
}

/**
 * Generate JSON-LD structured data for organization
 */
export function generateOrganizationSchema() {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

    return {
        '@context': 'https://schema.org',
        '@type': 'NGO',
        name: 'Nutrition for Refugees and Displaced Communities',
        alternateName: 'NRDC',
        url: siteUrl,
        logo: `${siteUrl}/images/nrdc-logo-v3.png`,
        description: 'Supporting refugee nutrition and health programs across East Africa',
        address: {
            '@type': 'PostalAddress',
            addressCountry: 'KE',
        },
        sameAs: [
            // Add social media links here
        ],
    }
}

/**
 * Generate JSON-LD structured data for articles/blog posts
 */
export function generateArticleSchema(params: {
    title: string
    description: string
    image?: string
    publishedTime: string
    modifiedTime: string
    author: string
    url: string
}) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const imageUrl = params.image || `${siteUrl}/en/opengraph-image`

    return {
        '@context': 'https://schema. org',
        '@type': 'Article',
        headline: params.title,
        description: params.description,
        image: imageUrl,
        datePublished: params.publishedTime,
        dateModified: params.modifiedTime,
        author: {
            '@type': 'Person',
            name: params.author,
        },
        publisher: {
            '@type': 'Organization',
            name: 'NRDC',
            logo: {
                '@type': 'ImageObject',
                url: `${siteUrl}/images/nrdc-logo-v3.png`,
            },
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': params.url,
        },
    }
}

/**
 * Default meta tags for the site
 */
export const defaultMetadata: Metadata = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
    title: {
        default: 'NRDC.KENYA - Nutrition for Refugees and Displaced Communities',
        template: '%s | NRDC.KENYA',
    },
    description: 'Supporting refugee nutrition and health programs across East Africa. Join us in making a difference.',
    keywords: ['NRDC', 'nutrition', 'relief', 'development', 'refugees', 'East Africa', 'charity', 'NGO', 'donate'],
    authors: [{ name: 'NRDC' }],
    creator: 'NRDC',
    publisher: 'NRDC',
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    icons: {
        icon: '/favicon.ico',
        apple: '/apple-touch-icon.png',
    },
    manifest: '/site.webmanifest',
}

/**
 * Generate JSON-LD structured data for breadcrumbs
 */
export function generateBreadcrumbSchema(items: { name: string; item: string }[]) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.item,
        })),
    }
}
