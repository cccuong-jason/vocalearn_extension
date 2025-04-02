// src/core/domain/ports/storage-service.ts
import { VocabularyWord } from '../models/vocabulary';

export interface StorageService {
  saveWord(word: VocabularyWord): Promise<VocabularyWord>;
  getWords(): Promise<VocabularyWord[]>;
  getWordById(id: number): Promise<VocabularyWord | null>;
  deleteWord(id: number): Promise<boolean>;
  searchWords(query: string): Promise<VocabularyWord[]>;
}

