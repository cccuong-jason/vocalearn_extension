/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/core/application/usecases/get-definition-usecase.ts":
/*!*****************************************************************!*\
  !*** ./src/core/application/usecases/get-definition-usecase.ts ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   GetDefinitionUseCase: () => (/* binding */ GetDefinitionUseCase)
/* harmony export */ });
class GetDefinitionUseCase {
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


/***/ }),

/***/ "./src/core/application/usecases/save-vocabulary-word-usecase.ts":
/*!***********************************************************************!*\
  !*** ./src/core/application/usecases/save-vocabulary-word-usecase.ts ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SaveVocabularyWordUseCase: () => (/* binding */ SaveVocabularyWordUseCase)
/* harmony export */ });
class SaveVocabularyWordUseCase {
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


/***/ }),

/***/ "./src/core/application/usecases/translate-text-usecase.ts":
/*!*****************************************************************!*\
  !*** ./src/core/application/usecases/translate-text-usecase.ts ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TranslateTextUseCase: () => (/* binding */ TranslateTextUseCase)
/* harmony export */ });
class TranslateTextUseCase {
    constructor(translationService, cacheService) {
        this.translationService = translationService;
        this.cacheService = cacheService;
    }
    async execute(text, targetLanguages) {
        const result = {};
        for (const lang of targetLanguages) {
            // Check cache first
            const cacheKey = `translation_${text.substring(0, 50)}_${lang}`;
            const cachedTranslation = await this.cacheService.get(cacheKey);
            if (cachedTranslation) {
                result[lang] = cachedTranslation.translatedText;
                continue;
            }
            // Get fresh translation
            try {
                const translation = await this.translationService.translateText(text, lang);
                result[lang] = translation.translatedText;
                // Cache the result
                await this.cacheService.set(cacheKey, translation, 86400); // 24 hours TTL
            }
            catch (error) {
                console.error(`Error translating to ${lang}:`, error);
            }
        }
        return result;
    }
}


/***/ }),

/***/ "./src/infra/di/service-locator.ts":
/*!*****************************************!*\
  !*** ./src/infra/di/service-locator.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ServiceLocator: () => (/* binding */ ServiceLocator)
/* harmony export */ });
/* harmony import */ var _services_libre_translate_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../services/libre-translate-service */ "./src/infra/services/libre-translate-service.ts");
/* harmony import */ var _services_free_dictionary_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../services/free-dictionary-service */ "./src/infra/services/free-dictionary-service.ts");
/* harmony import */ var _services_indexeddb_storage_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../services/indexeddb-storage-service */ "./src/infra/services/indexeddb-storage-service.ts");
/* harmony import */ var _services_local_storage_cache_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../services/local-storage-cache-service */ "./src/infra/services/local-storage-cache-service.ts");
/* harmony import */ var _core_application_usecases_translate_text_usecase__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../core/application/usecases/translate-text-usecase */ "./src/core/application/usecases/translate-text-usecase.ts");
/* harmony import */ var _core_application_usecases_get_definition_usecase__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../core/application/usecases/get-definition-usecase */ "./src/core/application/usecases/get-definition-usecase.ts");
/* harmony import */ var _core_application_usecases_save_vocabulary_word_usecase__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../core/application/usecases/save-vocabulary-word-usecase */ "./src/core/application/usecases/save-vocabulary-word-usecase.ts");







class ServiceLocator {
    constructor() {
        // Initialize with default implementations
        this.services = {
            translationService: new _services_libre_translate_service__WEBPACK_IMPORTED_MODULE_0__.LibreTranslateService(),
            dictionaryService: new _services_free_dictionary_service__WEBPACK_IMPORTED_MODULE_1__.FreeDictionaryService(),
            storageService: new _services_indexeddb_storage_service__WEBPACK_IMPORTED_MODULE_2__.IndexedDBStorageService(),
            cacheService: new _services_local_storage_cache_service__WEBPACK_IMPORTED_MODULE_3__.LocalStorageCacheService()
        };
    }
    static getInstance() {
        if (!ServiceLocator.instance) {
            ServiceLocator.instance = new ServiceLocator();
        }
        return ServiceLocator.instance;
    }
    // Get a service by its type
    getService(serviceName) {
        return this.services[serviceName];
    }
    // Register a new service implementation
    registerService(serviceName, implementation) {
        this.services[serviceName] = implementation;
    }
    // Get use cases with proper dependencies
    getTranslateTextUseCase() {
        return new _core_application_usecases_translate_text_usecase__WEBPACK_IMPORTED_MODULE_4__.TranslateTextUseCase(this.services.translationService, this.services.cacheService);
    }
    getDefinitionUseCase() {
        return new _core_application_usecases_get_definition_usecase__WEBPACK_IMPORTED_MODULE_5__.GetDefinitionUseCase(this.services.dictionaryService, this.services.cacheService);
    }
    getSaveVocabularyWordUseCase() {
        return new _core_application_usecases_save_vocabulary_word_usecase__WEBPACK_IMPORTED_MODULE_6__.SaveVocabularyWordUseCase(this.services.storageService);
    }
}


/***/ }),

/***/ "./src/infra/factories/translation-service-factory.ts":
/*!************************************************************!*\
  !*** ./src/infra/factories/translation-service-factory.ts ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TranslationServiceFactory: () => (/* binding */ TranslationServiceFactory),
/* harmony export */   TranslationServiceType: () => (/* binding */ TranslationServiceType)
/* harmony export */ });
/* harmony import */ var _services_libre_translate_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../services/libre-translate-service */ "./src/infra/services/libre-translate-service.ts");
/* harmony import */ var _di_service_locator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../di/service-locator */ "./src/infra/di/service-locator.ts");


// Add more implementations as needed
var TranslationServiceType;
(function (TranslationServiceType) {
    TranslationServiceType["LIBRE_TRANSLATE"] = "libre_translate";
    TranslationServiceType["GOOGLE_TRANSLATE"] = "google_translate";
    TranslationServiceType["MICROSOFT_TRANSLATE"] = "microsoft_translate";
    TranslationServiceType["DEEPL"] = "deepl";
})(TranslationServiceType || (TranslationServiceType = {}));
class TranslationServiceFactory {
    static create(type, apiKey) {
        switch (type) {
            case TranslationServiceType.LIBRE_TRANSLATE:
                return new _services_libre_translate_service__WEBPACK_IMPORTED_MODULE_0__.LibreTranslateService();
            // Add more implementations as needed
            /*
            case TranslationServiceType.GOOGLE_TRANSLATE:
              return new GoogleTranslateService(apiKey);
            case TranslationServiceType.MICROSOFT_TRANSLATE:
              return new MicrosoftTranslateService(apiKey);
            case TranslationServiceType.DEEPL:
              return new DeepLTranslateService(apiKey);
            */
            default:
                return new _services_libre_translate_service__WEBPACK_IMPORTED_MODULE_0__.LibreTranslateService();
        }
    }
    static register(type, apiKey) {
        const service = this.create(type, apiKey);
        _di_service_locator__WEBPACK_IMPORTED_MODULE_1__.ServiceLocator.getInstance().registerService('translationService', service);
    }
}


/***/ }),

/***/ "./src/infra/services/configuration-service.ts":
/*!*****************************************************!*\
  !*** ./src/infra/services/configuration-service.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ConfigurationService: () => (/* binding */ ConfigurationService)
/* harmony export */ });
/* harmony import */ var _utils_browser_polyfill__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils/browser-polyfill */ "./src/utils/browser-polyfill.ts");
// src/infrastructure/services/configuration-service.ts

class ConfigurationService {
    constructor() {
        this.defaultConfig = {
            targetLanguages: ['es', 'fr', 'de'],
            autoPopup: true,
            includeDefinitions: true,
            translationService: 'libre_translate',
            dictionaryService: 'free_dictionary',
            theme: 'system'
        };
    }
    static getInstance() {
        if (!ConfigurationService.instance) {
            ConfigurationService.instance = new ConfigurationService();
        }
        return ConfigurationService.instance;
    }
    async getConfig() {
        return new Promise((resolve) => {
            _utils_browser_polyfill__WEBPACK_IMPORTED_MODULE_0__["default"].storage.local.get(['config'], (result) => {
                if (result.config) {
                    resolve({ ...this.defaultConfig, ...result.config });
                }
                else {
                    resolve(this.defaultConfig);
                }
            });
        });
    }
    async updateConfig(config) {
        const currentConfig = await this.getConfig();
        const newConfig = { ...currentConfig, ...config };
        return new Promise((resolve) => {
            _utils_browser_polyfill__WEBPACK_IMPORTED_MODULE_0__["default"].storage.local.set({ config: newConfig }, () => {
                resolve(newConfig);
            });
        });
    }
    async resetConfig() {
        return new Promise((resolve) => {
            _utils_browser_polyfill__WEBPACK_IMPORTED_MODULE_0__["default"].storage.local.set({ config: this.defaultConfig }, () => {
                resolve(this.defaultConfig);
            });
        });
    }
}


/***/ }),

/***/ "./src/infra/services/free-dictionary-service.ts":
/*!*******************************************************!*\
  !*** ./src/infra/services/free-dictionary-service.ts ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FreeDictionaryService: () => (/* binding */ FreeDictionaryService)
/* harmony export */ });
class FreeDictionaryService {
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


/***/ }),

/***/ "./src/infra/services/indexeddb-storage-service.ts":
/*!*********************************************************!*\
  !*** ./src/infra/services/indexeddb-storage-service.ts ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   IndexedDBStorageService: () => (/* binding */ IndexedDBStorageService)
/* harmony export */ });
class IndexedDBStorageService {
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


/***/ }),

/***/ "./src/infra/services/libre-translate-service.ts":
/*!*******************************************************!*\
  !*** ./src/infra/services/libre-translate-service.ts ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FreeDictionaryService: () => (/* binding */ FreeDictionaryService),
/* harmony export */   IndexedDBStorageService: () => (/* binding */ IndexedDBStorageService),
/* harmony export */   LibreTranslateService: () => (/* binding */ LibreTranslateService),
/* harmony export */   LocalStorageCacheService: () => (/* binding */ LocalStorageCacheService)
/* harmony export */ });
class LibreTranslateService {
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
class FreeDictionaryService {
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
class IndexedDBStorageService {
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
class LocalStorageCacheService {
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


/***/ }),

/***/ "./src/infra/services/local-storage-cache-service.ts":
/*!***********************************************************!*\
  !*** ./src/infra/services/local-storage-cache-service.ts ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LocalStorageCacheService: () => (/* binding */ LocalStorageCacheService)
/* harmony export */ });
class LocalStorageCacheService {
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


/***/ }),

/***/ "./src/utils/browser-polyfill.ts":
/*!***************************************!*\
  !*** ./src/utils/browser-polyfill.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// This polyfill ensures compatibility between Chrome and Firefox extension APIs
// The 'browser' object is used in Firefox extensions while 'chrome' is used in Chrome extensions
// Use browser if available (Firefox), otherwise use chrome (Chrome, Edge)
const browserAPI = (typeof browser !== 'undefined' ? browser : chrome);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (browserAPI);


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!***************************!*\
  !*** ./src/background.ts ***!
  \***************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   setupBackgroundScript: () => (/* binding */ setupBackgroundScript)
/* harmony export */ });
/* harmony import */ var _utils_browser_polyfill__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils/browser-polyfill */ "./src/utils/browser-polyfill.ts");
/* harmony import */ var _infra_di_service_locator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./infra/di/service-locator */ "./src/infra/di/service-locator.ts");
/* harmony import */ var _infra_services_configuration_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./infra/services/configuration-service */ "./src/infra/services/configuration-service.ts");
/* harmony import */ var _infra_factories_translation_service_factory__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./infra/factories/translation-service-factory */ "./src/infra/factories/translation-service-factory.ts");
// src/background.ts




function setupBackgroundScript() {
    // Initialize services based on user configuration
    initializeServices();
    // Set up context menu
    _utils_browser_polyfill__WEBPACK_IMPORTED_MODULE_0__["default"].runtime.onInstalled.addListener(() => {
        _utils_browser_polyfill__WEBPACK_IMPORTED_MODULE_0__["default"].contextMenus.create({
            id: 'translate-selection',
            title: 'Translate "%s"',
            contexts: ['selection']
        });
    });
    // Handle context menu clicks
    _utils_browser_polyfill__WEBPACK_IMPORTED_MODULE_0__["default"].contextMenus.onClicked.addListener((info, tab) => {
        if (info.menuItemId === 'translate-selection' && info.selectionText && tab?.id) {
            _utils_browser_polyfill__WEBPACK_IMPORTED_MODULE_0__["default"].tabs.sendMessage(tab.id, {
                action: 'translateSelection',
                text: info.selectionText
            });
        }
    });
    // Handle messages from content script
    _utils_browser_polyfill__WEBPACK_IMPORTED_MODULE_0__["default"].runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === 'getTranslation') {
            handleTranslationRequest(request, sendResponse);
            return true; // Keep the message channel open for the async response
        }
        if (request.action === 'saveWord') {
            handleSaveWordRequest(request, sendResponse);
            return true; // Keep the message channel open for the async response
        }
        return false;
    });
}
async function initializeServices() {
    const configService = _infra_services_configuration_service__WEBPACK_IMPORTED_MODULE_2__.ConfigurationService.getInstance();
    const config = await configService.getConfig();
    // Initialize translation service based on user preference
    const apiKey = await new Promise(resolve => {
        _utils_browser_polyfill__WEBPACK_IMPORTED_MODULE_0__["default"].storage.local.get(['apiKey'], result => {
            resolve(result.apiKey);
        });
    });
    _infra_factories_translation_service_factory__WEBPACK_IMPORTED_MODULE_3__.TranslationServiceFactory.register(config.translationService, apiKey);
}
async function handleTranslationRequest(request, sendResponse) {
    try {
        const configService = _infra_services_configuration_service__WEBPACK_IMPORTED_MODULE_2__.ConfigurationService.getInstance();
        const config = await configService.getConfig();
        const serviceLocator = _infra_di_service_locator__WEBPACK_IMPORTED_MODULE_1__.ServiceLocator.getInstance();
        const translateUseCase = serviceLocator.getTranslateTextUseCase();
        // Get translations
        const translations = await translateUseCase.execute(request.text, config.targetLanguages);
        // Get definition if enabled
        let definition = null;
        if (config.includeDefinitions) {
            const getDefinitionUseCase = serviceLocator.getDefinitionUseCase();
            definition = await getDefinitionUseCase.execute(request.text);
        }
        // Send response back to content script
        sendResponse({
            translations,
            definition
        });
    }
    catch (error) {
        console.error('Error processing translation request:', error);
        sendResponse({ error: 'Failed to get translation' });
    }
}
async function handleSaveWordRequest(request, sendResponse) {
    try {
        const serviceLocator = _infra_di_service_locator__WEBPACK_IMPORTED_MODULE_1__.ServiceLocator.getInstance();
        const saveWordUseCase = serviceLocator.getSaveVocabularyWordUseCase();
        await saveWordUseCase.execute(request.word, request.translation, request.notes || '');
        sendResponse({ success: true });
    }
    catch (error) {
        console.error('Error saving word:', error);
        sendResponse({ success: false, error: error.message });
    }
}
// Initialize the background script
setupBackgroundScript();

})();

/******/ })()
;
//# sourceMappingURL=background.js.map