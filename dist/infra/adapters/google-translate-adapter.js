export class GoogleTranslateAdapter {
    constructor(apiKey) {
        this.API_URL = 'https://translation.googleapis.com/language/translate/v2';
        this.API_KEY = apiKey;
    }
    async translateText(text, targetLanguage) {
        try {
            const url = `${this.API_URL}?key=${this.API_KEY}`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    q: text,
                    target: targetLanguage
                })
            });
            if (!response.ok) {
                throw new Error(`Google Translate API error: ${response.status}`);
            }
            const data = await response.json();
            if (data &&
                data.data &&
                data.data.translations &&
                data.data.translations.length > 0) {
                return {
                    sourceText: text,
                    targetLanguage,
                    translatedText: data.data.translations[0].translatedText
                };
            }
            else {
                throw new Error('Invalid response from Google Translate API');
            }
        }
        catch (error) {
            console.error('Google Translate error:', error);
            throw error;
        }
    }
    async getSupportedLanguages() {
        try {
            const url = `${this.API_URL}/languages?key=${this.API_KEY}&target=en`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Google Translate API error: ${response.status}`);
            }
            const data = await response.json();
            if (data &&
                data.data &&
                data.data.languages) {
                return data.data.languages.map((lang) => ({
                    code: lang.language,
                    name: lang.name
                }));
            }
            else {
                throw new Error('Invalid response from Google Translate API');
            }
        }
        catch (error) {
            console.error('Error fetching supported languages:', error);
            // Return common languages as fallback
            return [
                { code: 'en', name: 'English' },
                { code: 'es', name: 'Spanish' },
                { code: 'fr', name: 'French' },
                { code: 'de', name: 'German' },
                { code: 'it', name: 'Italian' },
                { code: 'pt', name: 'Portuguese' },
                { code: 'ru', name: 'Russian' },
                { code: 'zh', name: 'Chinese' },
                { code: 'ja', name: 'Japanese' }
            ];
        }
    }
}
