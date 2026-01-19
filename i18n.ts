import { getRequestConfig } from 'next-intl/server';
import { prisma } from '@/lib/prisma';

export const locales = ['en', 'fr', 'es', 'ar', 'sw'];
export const defaultLocale = 'en';

export default getRequestConfig(async ({ requestLocale }) => {
    let locale = await requestLocale;

    if (!locale || !locales.includes(locale)) {
        locale = defaultLocale;
    }

    const fileMessages = (await import(`./messages/${locale}.json`)).default;

    let dbMessages = {};
    try {
        const translations = await prisma.translation.findMany({
            where: { locale }
        });

        // Convert flat structure to nested object based on namespace
        // Assuming structure: namespace.key
        // But my model has 'namespace' field.
        // My file structure is: { namespace: { key: value } }

        dbMessages = translations.reduce((acc: any, t) => {
            if (!acc[t.namespace]) acc[t.namespace] = {};
            acc[t.namespace][t.key] = t.value;
            return acc;
        }, {});

    } catch (e) {
        console.error("Failed to load translations from DB", e);
    }

    // Deep merge or just top level?
    // For simplicity, let's do a basic merge where DB overrides file
    // But we need deep merge for namespaces.

    const messages = { ...fileMessages };

    Object.keys(dbMessages).forEach(namespace => {
        messages[namespace] = {
            ...messages[namespace],
            ...(dbMessages as any)[namespace]
        };
    });

    return {
        locale,
        messages
    };
});
