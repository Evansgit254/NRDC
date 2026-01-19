import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';

export const proxy = createMiddleware({
    // A list of all locales that are supported
    locales,

    // Used when no locale matches
    defaultLocale,

    // Explicitly disable locale prefix if preferred, but for this app we use it.
    localePrefix: 'always'
});

export const config = {
    // Match only internationalized pathnames
    matcher: ['/((?!api|admin|_next|_vercel|site\\.webmanifest|.*\\..*).*)']
};
