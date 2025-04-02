// src/core/application/use-cases/save-vocabulary-word-use-case.ts
import { StorageService } from '../../domain/ports/storage-service';
import { VocabularyWord } from '../../domain/models/vocabulary';

export class SaveVocabularyWordUseCase {
  constructor(private storageService: StorageService) {}

  async execute(word: string, translation: string, notes: string = ''): Promise<VocabularyWord> {
    const vocabWord: VocabularyWord = {
      word,
      translation,
      notes,
      dateAdded: new Date().toISOString(),
      lastReviewed: new Date().toISOString()
    };
    
    return this.storageService.saveWord(vocabWord);
  }
}