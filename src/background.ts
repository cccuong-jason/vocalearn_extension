// src/background.ts
import browserAPI from './utils/browser-polyfill';
import { ServiceLocator } from './infra/di/service-locator';
import { ConfigurationService } from './infra/services/configuration-service';
import { TranslationServiceFactory } from './infra/factories/translation-service-factory';

export function setupBackgroundScript() {
  // Initialize services based on user configuration
  initializeServices();
  
  // Set up context menu
  browserAPI.runtime.onInstalled.addListener(() => {
    browserAPI.contextMenus.create({
      id: 'translate-selection',
      title: 'Translate "%s"',
      contexts: ['selection']
    });
  });
  
  // Handle context menu clicks
  browserAPI.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === 'translate-selection' && info.selectionText && tab?.id) {
      browserAPI.tabs.sendMessage(tab.id, {
        action: 'translateSelection',
        text: info.selectionText
      });
    }
  });
  
  // Handle messages from content script
  browserAPI.runtime.onMessage.addListener((request, sender, sendResponse) => {
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
  const configService = ConfigurationService.getInstance();
  const config = await configService.getConfig();
  
  // Initialize translation service based on user preference
  const apiKey = await new Promise<string | undefined>(resolve => {
    browserAPI.storage.local.get(['apiKey'], result => {
      resolve(result.apiKey);
    });
  });
  
  TranslationServiceFactory.register(
    config.translationService as any, 
    apiKey
  );
}

async function handleTranslationRequest(request: any, sendResponse: (response: any) => void) {
  try {
    const configService = ConfigurationService.getInstance();
    const config = await configService.getConfig();
    
    const serviceLocator = ServiceLocator.getInstance();
    const translateUseCase = serviceLocator.getTranslateTextUseCase();
    
    // Get translations
    const translations = await translateUseCase.execute(
      request.text, 
      config.targetLanguages
    );
    
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
  } catch (error) {
    console.error('Error processing translation request:', error);
    sendResponse({ error: 'Failed to get translation' });
  }
}

async function handleSaveWordRequest(request: any, sendResponse: (response: any) => void) {
  try {
    const serviceLocator = ServiceLocator.getInstance();
    const saveWordUseCase = serviceLocator.getSaveVocabularyWordUseCase();
    
    await saveWordUseCase.execute(
      request.word,
      request.translation,
      request.notes || ''
    );
    
    sendResponse({ success: true });
  } catch (error) {
    console.error('Error saving word:', error);
    sendResponse({ success: false, error: (error as Error).message });
  }
}

// Initialize the background script
setupBackgroundScript();
