export class GetDefinitionUseCase {
    constructor(dictionaryService, cacheService) {
        this.dictionaryService = dictionaryService;
        this.cacheService = cacheService;
    }
    async execute(word) {
        // Check cache first
        const cacheKey = `definition_${word}`;
        const cachedDefinition = await this.cacheService.get(cacheKey);
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
        }
        catch (error) {
            console.error('Error fetching definition:', error);
            return null;
        }
    }
}
