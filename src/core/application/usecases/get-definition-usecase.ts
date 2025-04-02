// src/core/application/use-cases/get-definition-use-case.ts
import { DictionaryService } from '../../domain/ports/dictionary-service';
import { CacheService } from '../../domain/ports/cache-service';
import { DictionaryEntry } from '../../domain/models/definition';

export class GetDefinitionUseCase {
  constructor(
    private dictionaryService: DictionaryService,
    private cacheService: CacheService
  ) {}

  async execute(word: string): Promise<DictionaryEntry | null> {
    // Check cache first
    const cacheKey = `definition_${word}`;
    const cachedDefinition = await this.cacheService.get<DictionaryEntry>(cacheKey);
    
    if (cachedDefinition) {
      return cachedDefinition;
    }
    
    // Get fresh definition
    try {
      const definition = await this.dictionaryService.getDefinition(word);
      
      if (definition) {
        // Cache the result
        await this.cacheService.set(cacheKey, definition, 604800); // 7 days TTL
      }
      
      return definition;
    } catch (error) {
      console.error('Error fetching definition:', error);
      return null;
    }
  }
}
