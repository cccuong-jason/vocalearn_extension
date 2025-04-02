// src/infrastructure/services/free-dictionary-service.ts
import { DictionaryService } from '../../core/domain/ports/dictionary-service';
import { DictionaryEntry, Meaning, Definition } from '../../core/domain/models/definition';

export class FreeDictionaryService implements DictionaryService {
  private readonly API_URL = 'https://api.dictionaryapi.dev/api/v2/entries/en';
  
  async getDefinition(word: string): Promise<DictionaryEntry | null> {
    try {
      const response = await fetch(`${this.API_URL}/${encodeURIComponent(word)}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          return null; // Word not found
        }
        throw new Error('Dictionary API error');
      }
      
      const data = await response.json();
      
      if (!data || !data[0]) {
        return null;
      }
      
      // Process and format the definition data
      const result: DictionaryEntry = {
        word: data[0].word,
        phonetic: data[0].phonetic || '',
        meanings: []
      };
      
      // Extract meanings, definitions and examples
      if (data[0].meanings && data[0].meanings.length > 0) {
        data[0].meanings.forEach((meaning: any) => {
          const meaningObj: Meaning = {
            partOfSpeech: meaning.partOfSpeech,
            definitions: []
          };
          
          meaning.definitions.forEach((def: any) => {
            meaningObj.definitions.push({
              definition: def.definition,
              example: def.example || '',
              synonyms: def.synonyms || []
            });
          });
          
          result.meanings.push(meaningObj);
        });
      }
      
      return result;
    } catch (error) {
      console.error('Error fetching definition:', error);
      return null;
    }
  }
  
  getSupportedLanguages(): string[] {
    return ['en']; // Only English is supported
  }
}