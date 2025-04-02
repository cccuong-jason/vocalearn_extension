// src/infrastructure/services/libre-translate-service.ts
import { TranslationService } from '../../core/domain/ports/translation-service';
import { Translation } from '../../core/domain/models/translation';

export class LibreTranslateService implements TranslationService {
  private readonly API_URL = 'https://libretranslate.de';
  private supportedLanguages: {code: string, name: string}[] = [];
  
  constructor() {
    this.loadSupportedLanguages();
  }
  
  private async loadSupportedLanguages(): Promise<void> {
    try {
      const response = await fetch(`${this.API_URL}/languages`);
      if (response.ok) {
        this.supportedLanguages = await response.json();
      }
    } catch (error) {
      console.error('Failed to load supported languages:', error);
      // Fallback to common languages
      this.supportedLanguages = [
        { code: 'en', name: 'English' },
        { code: 'es', name: 'Spanish' },
        { code: 'fr', name: 'French' },
        { code: 'de', name: 'German' },
        { code: 'it', name: 'Italian' },
        { code: 'pt', name: 'Portuguese' },
        { code: 'ru', name: 'Russian' },
        { code: 'zh', name: 'Chinese' },
        { code: 'ja', name: 'Japanese' }
      ];
    }
  }
  
  async translateText(text: string, targetLanguage: string): Promise<Translation> {
    const response = await fetch(`${this.API_URL}/translate`, {
      method: 'POST',
      body: JSON.stringify({
        q: text,
        source: 'auto',
        target: targetLanguage,
        format: 'text'
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Translation API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    return {
      sourceText: text,
      targetLanguage,
      translatedText: data.translatedText
    };
  }
  
  async getSupportedLanguages(): Promise<{code: string, name: string}[]> {
    return this.supportedLanguages;
  }
}






