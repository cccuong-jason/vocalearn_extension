// src/infrastructure/factories/translation-service-factory.ts
import { TranslationService } from '../../core/domain/ports/translation-service';
import { LibreTranslateService } from '../services/libre-translate-service';
import { ServiceLocator } from '../di/service-locator';

// Add more implementations as needed
export enum TranslationServiceType {
  LIBRE_TRANSLATE = 'libre_translate',
  GOOGLE_TRANSLATE = 'google_translate',
  MICROSOFT_TRANSLATE = 'microsoft_translate',
  DEEPL = 'deepl'
}

export class TranslationServiceFactory {
  static create(type: TranslationServiceType, apiKey?: string): TranslationService {
    switch (type) {
      case TranslationServiceType.LIBRE_TRANSLATE:
        return new LibreTranslateService();
      // Add more implementations as needed
      /*
      case TranslationServiceType.GOOGLE_TRANSLATE:
        return new GoogleTranslateService(apiKey);
      case TranslationServiceType.MICROSOFT_TRANSLATE:
        return new MicrosoftTranslateService(apiKey);
      case TranslationServiceType.DEEPL:
        return new DeepLTranslateService(apiKey);
      */
      default:
        return new LibreTranslateService();
    }
  }
  
  static register(type: TranslationServiceType, apiKey?: string): void {
    const service = this.create(type, apiKey);
    ServiceLocator.getInstance().registerService('translationService', service);
  }
}