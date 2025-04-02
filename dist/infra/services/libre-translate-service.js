export class LibreTranslateService {
    constructor() {
        this.API_URL = 'https://libretranslate.de';
        this.supportedLanguages = [];
        this.loadSupportedLanguages();
    }
    async loadSupportedLanguages() {
        try {
            const response = await fetch(`${this.API_URL}/languages`);
            if (response.ok) {
                this.supportedLanguages = await response.json();
            }
        }
        catch (error) {
            console.error('Failed to load supported languages:', error);
            // Fallback to common languages
            this.supportedLanguages = [
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
    async translateText(text, targetLanguage) {
        const response = await fetch(`${this.API_URL}/translate`, {
            method: 'POST',
            body: JSON.stringify({
                q: text,
                source: 'auto',
                target: targetLanguage,
                format: 'text'
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error(`Translation API error: ${response.status}`);
        }
        const data = await response.json();
        return {
            sourceText: text,
            targetLanguage,
            translatedText: data.translatedText
        };
    }
    async getSupportedLanguages() {
        return this.supportedLanguages;
    }
}
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
export class IndexedDBStorageService {
    constructor() {
        this.DB_NAME = 'vocalearn';
        this.DB_VERSION = 1;
        this.STORE_NAME = 'vocabulary';
    }
    async initDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);
            request.onerror = (event) => {
                reject('IndexedDB error: ' + event.target.error);
            };
            request.onsuccess = (event) => {
                resolve(event.target.result);
            };
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                // Create object store for vocabulary words
                if (!db.objectStoreNames.contains(this.STORE_NAME)) {
                    const store = db.createObjectStore(this.STORE_NAME, { keyPath: 'id', autoIncrement: true });
                    store.createIndex('word', 'word', { unique: false });
                    store.createIndex('dateAdded', 'dateAdded', { unique: false });
                }
            };
        });
    }
    async saveWord(word) {
        const db = await this.initDB();
        return new Promise((resolve, reject) => {
            // Check if word already exists (if it has an ID)
            const transaction = db.transaction([this.STORE_NAME], 'readwrite');
            const store = transaction.objectStore(this.STORE_NAME);
            if (word.id) {
                // Update existing word
                const updateRequest = store.put(word);
                updateRequest.onsuccess = () => {
                    resolve(word);
                };
                updateRequest.onerror = () => {
                    reject(new Error('Error updating word'));
                };
            }
            else {
                // Check if the word text already exists
                const wordIndex = store.index('word');
                const request = wordIndex.getAll(word.word);
                request.onsuccess = (event) => {
                    const matches = event.target.result;
                    if (matches.length > 0) {
                        // Update existing word
                        const existingWord = matches[0];
                        const updatedWord = {
                            ...existingWord,
                            translation: word.translation,
                            notes: word.notes,
                            lastReviewed: new Date().toISOString()
                        };
                        const updateRequest = store.put(updatedWord);
                        updateRequest.onsuccess = () => {
                            resolve(updatedWord);
                        };
                        updateRequest.onerror = () => {
                            reject(new Error('Error updating word'));
                        };
                    }
                    else {
                        // Add new word
                        const addRequest = store.add(word);
                        addRequest.onsuccess = (event) => {
                            const newWord = { ...word, id: event.target.result };
                            resolve(newWord);
                        };
                        addRequest.onerror = () => {
                            reject(new Error('Error adding word'));
                        };
                    }
                };
            }
        });
    }
    async getWords() {
        const db = await this.initDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([this.STORE_NAME], 'readonly');
            const store = transaction.objectStore(this.STORE_NAME);
            const request = store.getAll();
            request.onsuccess = (event) => {
                resolve(event.target.result);
            };
            request.onerror = () => {
                reject(new Error('Error fetching words'));
            };
        });
    }
    async getWordById(id) {
        const db = await this.initDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([this.STORE_NAME], 'readonly');
            const store = transaction.objectStore(this.STORE_NAME);
            const request = store.get(id);
            request.onsuccess = (event) => {
                const result = event.target.result;
                resolve(result || null);
            };
            request.onerror = () => {
                reject(new Error('Error fetching word'));
            };
        });
    }
    async deleteWord(id) {
        const db = await this.initDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([this.STORE_NAME], 'readwrite');
            const store = transaction.objectStore(this.STORE_NAME);
            const request = store.delete(id);
            request.onsuccess = () => {
                resolve(true);
            };
            request.onerror = () => {
                reject(new Error('Error deleting word'));
            };
        });
    }
    async searchWords(query) {
        const words = await this.getWords();
        const lowerQuery = query.toLowerCase();
        return words.filter(word => word.word.toLowerCase().includes(lowerQuery) ||
            word.translation.toLowerCase().includes(lowerQuery) ||
            word.notes.toLowerCase().includes(lowerQuery));
    }
}
export class LocalStorageCacheService {
    constructor() {
        this.PREFIX = 'vocalearn_cache_';
    }
    async get(key) {
        const cacheKey = this.PREFIX + key;
        const item = localStorage.getItem(cacheKey);
        if (!item) {
            return null;
        }
        try {
            const cacheItem = JSON.parse(item);
            // Check if expired
            if (cacheItem.expiry && cacheItem.expiry < Date.now()) {
                localStorage.removeItem(cacheKey);
                return null;
            }
            return cacheItem.value;
        }
        catch (error) {
            console.error('Error parsing cache item:', error);
            return null;
        }
    }
    async set(key, value, ttlSeconds) {
        const cacheKey = this.PREFIX + key;
        const cacheItem = {
            value
        };
        if (ttlSeconds) {
            cacheItem.expiry = Date.now() + (ttlSeconds * 1000);
        }
        localStorage.setItem(cacheKey, JSON.stringify(cacheItem));
    }
    async remove(key) {
        const cacheKey = this.PREFIX + key;
        localStorage.removeItem(cacheKey);
    }
    async clear() {
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(this.PREFIX)) {
                keysToRemove.push(key);
            }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));
    }
}
