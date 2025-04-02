// src/content.ts
import browserAPI from './utils/browser-polyfill';
import { ConfigurationService } from './infra/services/configuration-service';

export function setupContentScript() {
  // Listen for text selection
  document.addEventListener('mouseup', handleTextSelection);
  
  // Listen for messages from background script
  browserAPI.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'translateSelection' && message.text) {
      handleTranslateSelection(message.text);
    }
    return false;
  });
}

async function handleTextSelection(e: MouseEvent) {
  const selection = window.getSelection();
  const selectedText = selection?.toString().trim() || '';
  
  if (selectedText.length > 0 && selectedText.length < 100) {
    // Check if auto-popup is enabled
    const configService = ConfigurationService.getInstance();
    const config = await configService.getConfig();
    
    if (config.autoPopup) {
      // Get translation and show popup
      const response = await browserAPI.runtime.sendMessage({
        action: 'getTranslation',
        text: selectedText
      });
      
      if (response && (response.translations || response.definition)) {
        showPopup(e.pageX, e.pageY, selectedText, response);
      }
    }
  }
}

async function handleTranslateSelection(text: string) {
  const response = await browserAPI.runtime.sendMessage({
    action: 'getTranslation',
    text: text
  });
  
  if (response && (response.translations || response.definition)) {
    const selection = window.getSelection();
    const range = selection?.getRangeAt(0);
    const rect = range?.getBoundingClientRect();
    
    if (rect) {
      showPopup(
        rect.left + window.scrollX, 
        rect.bottom + window.scrollY, 
        text, 
        response
      );
    }
  }
}

function showPopup(x: number, y: number, word: string, data: any) {
  // Implementation of popup UI
  // This can be extracted into a UI component class
  // ...
}

// Initialize the content script
setupContentScript();
