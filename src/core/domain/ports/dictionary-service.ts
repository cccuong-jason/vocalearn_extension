// src/core/domain/ports/dictionary-service.ts
import { DictionaryEntry } from '../models/definition';

export interface DictionaryService {
  getDefinition(word: string): Promise<DictionaryEntry | null>;
  getSupportedLanguages(): string[];
}
