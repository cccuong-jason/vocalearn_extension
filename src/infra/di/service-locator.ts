// src/infrastructure/di/service-locator.ts
import { TranslationService } from '../../core/domain/ports/translation-service';
import { DictionaryService } from '../../core/domain/ports/dictionary-service';
import { StorageService } from '../../core/domain/ports/storage-service';
import { CacheService } from '../../core/domain/ports/cache-service';
import { AnalyticsService } from '../../core/domain/ports/analytic-service';

import { LibreTranslateService } from '../services/libre-translate-service';
import { FreeDictionaryService } from '../services/free-dictionary-service';
import { IndexedDBStorageService } from '../services/indexeddb-storage-service';
import { LocalStorageCacheService } from '../services/local-storage-cache-service';

import { TranslateTextUseCase } from '../../core/application/usecases/translate-text-usecase';
import { GetDefinitionUseCase } from '../../core/application/usecases/get-definition-usecase';
import { SaveVocabularyWordUseCase } from '../../core/application/usecases/save-vocabulary-word-usecase';

// Service registry to hold all service implementations
type ServiceRegistry = {
  translationService: TranslationService;
  dictionaryService: DictionaryService;
  storageService: StorageService;
  cacheService: CacheService;
  analyticsService?: AnalyticsService;
};

export class ServiceLocator {
  private static instance: ServiceLocator;
  private services: ServiceRegistry;
  
  private constructor() {
    // Initialize with default implementations
    this.services = {
      translationService: new LibreTranslateService(),
      dictionaryService: new FreeDictionaryService(),
      storageService: new IndexedDBStorageService(),
      cacheService: new LocalStorageCacheService()
    };
  }
  
  public static getInstance(): ServiceLocator {
    if (!ServiceLocator.instance) {
      ServiceLocator.instance = new ServiceLocator();
    }
    return ServiceLocator.instance;
  }
  
  // Get a service by its type
  public getService<K extends keyof ServiceRegistry>(serviceName: K): ServiceRegistry[K] {
    return this.services[serviceName];
  }
  
  // Register a new service implementation
  public registerService<K extends keyof ServiceRegistry>(serviceName: K, implementation: ServiceRegistry[K]): void {
    this.services[serviceName] = implementation;
  }
  
  // Get use cases with proper dependencies
  public getTranslateTextUseCase(): TranslateTextUseCase {
    return new TranslateTextUseCase(
      this.services.translationService,
      this.services.cacheService
    );
  }
  
  public getDefinitionUseCase(): GetDefinitionUseCase {
    return new GetDefinitionUseCase(
      this.services.dictionaryService,
      this.services.cacheService
    );
  }
  
  public getSaveVocabularyWordUseCase(): SaveVocabularyWordUseCase {
    return new SaveVocabularyWordUseCase(
      this.services.storageService
    );
  }
}
