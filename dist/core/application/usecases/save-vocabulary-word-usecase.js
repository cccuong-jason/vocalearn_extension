export class SaveVocabularyWordUseCase {
    constructor(storageService) {
        this.storageService = storageService;
    }
    async execute(word, translation, notes = '') {
        const vocabWord = {
            word,
            translation,
            notes,
            dateAdded: new Date().toISOString(),
            lastReviewed: new Date().toISOString()
        };
        return this.storageService.saveWord(vocabWord);
    }
}
