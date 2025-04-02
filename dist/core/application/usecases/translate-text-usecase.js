export class TranslateTextUseCase {
    constructor(translationService, cacheService) {
        this.translationService = translationService;
        this.cacheService = cacheService;
    }
    async execute(text, targetLanguages) {
        const result = {};
        for (const lang of targetLanguages) {
            // Check cache first
            const cacheKey = `translation_${text.substring(0, 50)}_${lang}`;
            const cachedTranslation = await this.cacheService.get(cacheKey);
            if (cachedTranslation) {
                result[lang] = cachedTranslation.translatedText;
                continue;
            }
            // Get fresh translation
            try {
                const translation = await this.translationService.translateText(text, lang);
                result[lang] = translation.translatedText;
                // Cache the result
                await this.cacheService.set(cacheKey, translation, 86400); // 24 hours TTL
            }
            catch (error) {
                console.error(`Error translating to ${lang}:`, error);
            }
        }
        return result;
    }
}
