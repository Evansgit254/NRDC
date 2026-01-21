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
export function generateMetadata(params: SEOParams): Metadata {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'NRDC'
    // Use the dynamic route for the default image (defaulting to English)
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
    } = params

    const fullTitle = `${title} | ${siteName}`
    const imageUrl = image.startsWith('http') ? image : `${siteUrl}${image}`

    return {
        title: fullTitle,
        description,
        keywords: keywords.join(', '),
        authors: author ? [{ name: author }] : undefined,
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
            locale: 'en_US',
            type,
            publishedTime,
            modifiedTime,
        },
        twitter: {
            card: 'summary_large_image',
            title: fullTitle,
            description,
            images: [imageUrl],
            creator: '@NRDC',
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
