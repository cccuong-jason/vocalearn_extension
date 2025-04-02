// src/infrastructure/adapters/microsoft-translate-adapter.ts
import { TranslationService } from '../../core/domain/ports/translation-service';
import { Translation } from '../../core/domain/models/translation';

export class MicrosoftTranslateAdapter implements TranslationService {
  private readonly API_URL = 'https://api.cognitive.microsofttranslator.com/translate';
  private readonly API_KEY: string;
  private readonly REGION: string;
  
  constructor(apiKey: string, region: string = 'global') {
    this.API_KEY = apiKey;
    this.REGION = region;
  }
  
  async translateText(text: string, targetLanguage: string): Promise<Translation> {
    try {
      const url = `${this.API_URL}?api-version=3.0&to=${targetLanguage}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Ocp-Apim-Subscription-Key': this.API_KEY,
          'Ocp-Apim-Subscription-Region': this.REGION
        },
        body: JSON.stringify([{
          text
        }])
      });
      
      if (!response.ok) {
        throw new Error(`Microsoft Translate API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data && 
          data.length > 0 && 
          data[0].translations && 
          data[0].translations.length > 0) {
        return {
          sourceText: text,
          targetLanguage,
          translatedText: data[0].translations[0].text
        };
      } else {
        throw new Error('Invalid response from Microsoft Translate API');
      }
    } catch (error) {
      console.error('Microsoft Translate error:', error);
      throw error;
    }
  }
  
  async getSupportedLanguages(): Promise<{code: string, name: string}[]> {
    try {
      const url = 'https://api.cognitive.microsofttranslator.com/languages?api-version=3.0&scope=translation';
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Microsoft Translate API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data && data.translation) {
        return Object.entries(data.translation).map(([code, details]: [string, any]) => ({
          code,
          name: details.name
        }));
      } else {
        throw new Error('Invalid response from Microsoft Translate API');
      }
    } catch (error) {
      console.error('Error fetching supported languages:', error);
      
      // Return common languages as fallback
      return [
        { code: 'en', name: 'English' },
        { code: 'es', name: 'Spanish' },
        { code: 'fr', name: 'French' },
        { code: 'de', name: 'German' },
        { code: 'it', name: 'Italian' },
        { code: 'pt', name: 'Portuguese' },
        { code: 'ru', name: 'Russian' },
        { code: 'zh-Hans', name: 'Chinese (Simplified)' },
        { code: 'ja', name: 'Japanese' }
      ];
    }
  }
}