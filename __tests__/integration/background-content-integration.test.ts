// src/__tests__/integration/background-content-integration.test.ts

// Store the message handler as a module-scoped variable
let messageHandlerFn: any = null;

// Mock all dependencies before importing the module under test
jest.mock('../../src/utils/browser-polyfill', () => {
  // Create browser mock object
  const mockBrowser = {
    runtime: {
      onMessage: {
        addListener: jest.fn(callback => {
          // Store the callback for later access
          messageHandlerFn = callback;
        })
      },
      sendMessage: jest.fn(),
      onInstalled: {
        addListener: jest.fn(callback => {
          // Execute the callback right away
          callback();
        })
      }
    },
    contextMenus: {
      create: jest.fn(),
      onClicked: {
        addListener: jest.fn()
      }
    },
    tabs: {
      sendMessage: jest.fn()
    },
    storage: {
      local: {
        get: jest.fn((keys, callback) => {
          callback({});
        })
      }
    }
  };

  return {
    __esModule: true,
    default: mockBrowser
  };
});

// Mock the service locator
jest.mock('../../src/infra/di/service-locator', () => {
  const mockTranslateTextUseCase = {
    execute: jest.fn().mockResolvedValue({ es: 'Hola' })
  };
  
  const mockGetDefinitionUseCase = {
    execute: jest.fn().mockResolvedValue({
      word: 'hello',
      phonetic: '/həˈləʊ/',
      meanings: [{
        partOfSpeech: 'exclamation',
        definitions: [{
          definition: 'used as a greeting',
          example: 'hello there!'
        }]
      }]
    })
  };
  
  return {
    ServiceLocator: {
      getInstance: jest.fn().mockReturnValue({
        getTranslateTextUseCase: () => mockTranslateTextUseCase,
        getDefinitionUseCase: () => mockGetDefinitionUseCase,
        getSaveVocabularyWordUseCase: () => ({
          execute: jest.fn().mockResolvedValue(true)
        })
      })
    }
  };
});

// Mock ConfigurationService
jest.mock('../../src/infra/services/configuration-service', () => {
  return {
    ConfigurationService: {
      getInstance: jest.fn().mockReturnValue({
        getConfig: jest.fn().mockResolvedValue({
          targetLanguages: ['es'],
          includeDefinitions: true,
          translationService: 'libre'
        })
      })
    }
  };
});

// Mock TranslationServiceFactory
jest.mock('../../src/infra/factories/translation-service-factory', () => {
  return {
    TranslationServiceFactory: {
      register: jest.fn()
    }
  };
});

// Now import the module under test
import { setupBackgroundScript } from '../../src/background';
import { ServiceLocator } from '../../src/infra/di/service-locator';

describe('Background and Content Script Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    messageHandlerFn = null;
  });
  
  test('background script should handle translation requests from content script', async () => {
    // Setup the background script
    setupBackgroundScript();
    
    // Ensure the message handler was registered
    const browserPolyfill = require('../../src/utils/browser-polyfill').default;
    expect(browserPolyfill.runtime.onMessage.addListener).toHaveBeenCalled();
    expect(messageHandlerFn).not.toBeNull();
    
    // Mock a message from the content script
    const mockSendResponse = jest.fn();
    
    // Call the handler with a translation request
    messageHandlerFn(
      { action: 'getTranslation', text: 'hello' },
      { tab: { id: 1 } },
      mockSendResponse
    );
    
    // Wait for async operations
    await new Promise(resolve => setTimeout(resolve, 50));
    
    // Check that the use case was called and response sent
    const translateUseCase = ServiceLocator.getInstance().getTranslateTextUseCase();
    expect(translateUseCase.execute).toHaveBeenCalledWith('hello', expect.any(Array));
    expect(mockSendResponse).toHaveBeenCalledWith({
      translations: { es: 'Hola' },
      definition: expect.any(Object)
    });
  });
});
