export class FreeDictionaryService {
    constructor() {
        this.API_URL = 'https://api.dictionaryapi.dev/api/v2/entries/en';
    }
    async getDefinition(word) {
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
            const result = {
                word: data[0].word,
                phonetic: data[0].phonetic || '',
                meanings: []
            };
            // Extract meanings, definitions and examples
            if (data[0].meanings && data[0].meanings.length > 0) {
                data[0].meanings.forEach((meaning) => {
                    const meaningObj = {
                        partOfSpeech: meaning.partOfSpeech,
                        definitions: []
                    };
                    meaning.definitions.forEach((def) => {
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
        }
        catch (error) {
            console.error('Error fetching definition:', error);
            return null;
        }
    }
    getSupportedLanguages() {
        return ['en']; // Only English is supported
    }
}
