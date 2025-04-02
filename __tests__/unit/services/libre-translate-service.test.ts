// src/__tests__/services/libre-translate-service.test.ts
import { LibreTranslateService } from '../../../src/infra/services/libre-translate-service';
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

describe('LibreTranslateService', () => {
  let service: LibreTranslateService;
  
  beforeEach(() => {
    fetchMock.resetMocks();
    service = new LibreTranslateService();
  });
  
  test('translateText should return a translation', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ translatedText: 'Hola mundo' }));
    
    const result = await service.translateText('Hello world', 'es');
    
    expect(result).toEqual({
      sourceText: 'Hello world',
      targetLanguage: 'es',
      translatedText: 'Hola mundo'
    });
    
    expect(fetchMock).toHaveBeenCalledWith(
      'https://libretranslate.de/translate',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          q: 'Hello world',
          source: 'auto',
          target: 'es',
          format: 'text'
        })
      })
    );
  });
  
  test('translateText should throw an error when API fails', async () => {
    fetchMock.mockResponseOnce('', { status: 500 });
    
    await expect(service.translateText('Hello world', 'es')).rejects.toThrow('Translation API error: 500');
  });
  
  test('getSupportedLanguages should return languages', async () => {
    const mockLanguages = [
      { code: 'en', name: 'English' },
      { code: 'es', name: 'Spanish' }
    ];
    
    fetchMock.mockResponseOnce(JSON.stringify(mockLanguages));
    
    // Force reload of languages
    service = new LibreTranslateService();
    
    // Let the constructor's async call complete
    await new Promise(resolve => setTimeout(resolve, 0));
    
    const languages = await service.getSupportedLanguages();
    expect(languages).toEqual(mockLanguages);
  });
});