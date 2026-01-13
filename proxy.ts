import createMiddleware from 'next-intl/middleware';

export const proxy = createMiddleware({
    // A list of all locales that are supported
    locales: ['en', 'fr', 'es', 'ar'],

    // Used when no locale matches
    defaultLocale: 'en',

    // Don't show the locale prefix for the default locale
    localePrefix: 'as-needed'
});

export const config = {
    // Match only internationalized pathnames
    matcher: ['/((?!api|admin|_next|_vercel|site\\.webmanifest|.*\\..*).*)']
};
