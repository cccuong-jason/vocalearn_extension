// src/__tests__/use-cases/translate-text-use-case.test.ts
import { TranslateTextUseCase } from '../../../src/core/application/usecases/translate-text-usecase';
describe('TranslateTextUseCase', () => {
    let useCase;
    let mockTranslationService;
    let mockCacheService;
    beforeEach(() => {
        mockTranslationService = {
            translateText: jest.fn(),
            getSupportedLanguages: jest.fn()
        };
        mockCacheService = {
            get: jest.fn(),
            set: jest.fn(),
            remove: jest.fn(),
            clear: jest.fn()
        };
        useCase = new TranslateTextUseCase(mockTranslationService, mockCacheService);
    });
    test('should return cached translations when available', async () => {
        const cachedTranslation = {
            sourceText: 'Hello',
            targetLanguage: 'es',
            translatedText: 'Hola'
        };
        mockCacheService.get.mockImplementation((key) => {
            if (key === 'translation_Hello_es') {
                return Promise.resolve(cachedTranslation);
            }
            return Promise.resolve(null);
        });
        const result = await useCase.execute('Hello', ['es']);
        expect(result).toEqual({ es: 'Hola' });
        expect(mockCacheService.get).toHaveBeenCalledWith('translation_Hello_es');
        expect(mockTranslationService.translateText).not.toHaveBeenCalled();
    });
    test('should fetch translations when not in cache', async () => {
        mockCacheService.get.mockResolvedValue(null);
        mockTranslationService.translateText.mockImplementation((text, lang) => {
            return Promise.resolve({
                sourceText: text,
                targetLanguage: lang,
                translatedText: lang === 'es' ? 'Hola' : 'Bonjour'
            });
        });
        const result = await useCase.execute('Hello', ['es', 'fr']);
        expect(result).toEqual({ es: 'Hola', fr: 'Bonjour' });
        expect(mockCacheService.get).toHaveBeenCalledTimes(2);
        expect(mockTranslationService.translateText).toHaveBeenCalledTimes(2);
        expect(mockCacheService.set).toHaveBeenCalledTimes(2);
    });
    test('should handle errors from translation service', async () => {
        mockCacheService.get.mockResolvedValue(null);
        mockTranslationService.translateText.mockImplementation((text, lang) => {
            if (lang === 'es') {
                return Promise.resolve({
                    sourceText: text,
                    targetLanguage: lang,
                    translatedText: 'Hola'
                });
            }
            else {
                return Promise.reject(new Error('API error'));
            }
        });
        const result = await useCase.execute('Hello', ['es', 'fr']);
        expect(result).toEqual({ es: 'Hola' });
        expect(mockTranslationService.translateText).toHaveBeenCalledTimes(2);
        expect(mockCacheService.set).toHaveBeenCalledTimes(1);
    });
});
