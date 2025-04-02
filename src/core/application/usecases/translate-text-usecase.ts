import { TranslationService } from '../../domain/ports/translation-service';
import { CacheService } from '../../domain/ports/cache-service';
import { Translation } from '../../domain/models/translation';

export class TranslateTextUseCase {
  constructor(
    private translationService: TranslationService,
    private cacheService: CacheService
  ) {}

  async execute(text: string, targetLanguages: string[]): Promise<Record<string, string>> {
    const result: Record<string, string> = {};
    
    for (const lang of targetLanguages) {
      // Check cache first
      const cacheKey = `translation_${text.substring(0, 50)}_${lang}`;
      const cachedTranslation = await this.cacheService.get<Translation>(cacheKey);
      
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
      } catch (error) {
        console.error(`Error translating to ${lang}:`, error);
      }
    }
    
    return result;
  }
}