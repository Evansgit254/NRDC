/**
 * Utility function to translate text using the free Google Translate API.
 * 
 * Note: This uses the undocumented Google Translation API which is free but 
 * has rate limits. For production at large scale, a paid service is recommended.
 * 
 * @param text The text to translate. Can include HTML tags.
 * @param targetLanguage The target language code (e.g. 'sw', 'fr', 'es', 'ar').
 * @param sourceLanguage The source language code (defaults to 'en').
 * @returns The translated text.
 */
export async function translateText(text: string, targetLanguage: string, sourceLanguage: string = 'en'): Promise<string> {
    if (!text || text.trim() === '') return text;

    try {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLanguage}&tl=${targetLanguage}&dt=t&q=${encodeURIComponent(text)}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            console.error(`Google Translate API Error: ${response.status} ${response.statusText}`);
            return text; // Return original text on failure
        }

        const data = await response.json();

        // The API returns an array where the first element is an array of translation chunks
        // Example: [[[ "Bonjour le monde", "Hello world", null, null, 3 ]], null, "en"]
        let translatedText = '';
        if (data && data[0] && Array.isArray(data[0])) {
            for (let i = 0; i < data[0].length; i++) {
                if (data[0][i][0]) {
                    translatedText += data[0][i][0];
                }
            }
        }

        return translatedText || text;
    } catch (error) {
        console.error('Translation error:', error);
        return text; // Return original text on failure to prevent breaking the flow
    }
}

/**
 * Convenience function to translate a blog post's fields into multiple languages.
 * 
 * @param post The post content object to translate.
 * @param targetLanguages Array of target language codes.
 * @returns A map of { locale: { translatedFields } }
 */
export async function autoTranslatePost(
    post: { title: string; excerpt: string; content: string },
    targetLanguages: string[] = ['sw', 'fr', 'es', 'ar']
) {
    const translations: Record<string, { title: string; excerpt: string; content: string }> = {};

    for (const locale of targetLanguages) {
        try {
            // Translate each field sequentially or in parallel.
            // Be mindful of potential rate limits if doing too many simultaneously.
            const [translatedTitle, translatedExcerpt, translatedContent] = await Promise.all([
                translateText(post.title, locale),
                translateText(post.excerpt, locale),
                translateText(post.content, locale)
            ]);

            translations[locale] = {
                title: translatedTitle,
                excerpt: translatedExcerpt,
                content: translatedContent
            };
        } catch (error) {
            console.error(`Failed to auto-translate to ${locale}:`, error);
            // Fallback to English if translation fails for this specific language
            translations[locale] = { ...post };
        }
    }

    return translations;
}
