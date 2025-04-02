// src/core/domain/ports/translation-service.ts
import { Translation } from '../models/translation';

export interface TranslationService {
  translateText(text: string, targetLanguage: string): Promise<Translation>;
  getSupportedLanguages(): Promise<{code: string, name: string}[]>;
}
