import { LibreTranslateService } from '../services/libre-translate-service';
import { FreeDictionaryService } from '../services/free-dictionary-service';
import { IndexedDBStorageService } from '../services/indexeddb-storage-service';
import { LocalStorageCacheService } from '../services/local-storage-cache-service';
import { TranslateTextUseCase } from '../../core/application/usecases/translate-text-usecase';
import { GetDefinitionUseCase } from '../../core/application/usecases/get-definition-usecase';
import { SaveVocabularyWordUseCase } from '../../core/application/usecases/save-vocabulary-word-usecase';
export class ServiceLocator {
    constructor() {
        // Initialize with default implementations
        this.services = {
            translationService: new LibreTranslateService(),
            dictionaryService: new FreeDictionaryService(),
            storageService: new IndexedDBStorageService(),
            cacheService: new LocalStorageCacheService()
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
        return new TranslateTextUseCase(this.services.translationService, this.services.cacheService);
    }
    getDefinitionUseCase() {
        return new GetDefinitionUseCase(this.services.dictionaryService, this.services.cacheService);
    }
    getSaveVocabularyWordUseCase() {
        return new SaveVocabularyWordUseCase(this.services.storageService);
    }
}
