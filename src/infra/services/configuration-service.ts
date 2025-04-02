// src/infrastructure/services/configuration-service.ts
import browserAPI from '../../utils/browser-polyfill';

export interface ExtensionConfig {
  targetLanguages: string[];
  autoPopup: boolean;
  includeDefinitions: boolean;
  translationService: string;
  dictionaryService: string;
  theme: 'light' | 'dark' | 'system';
}

export class ConfigurationService {
  private static instance: ConfigurationService;
  private defaultConfig: ExtensionConfig = {
    targetLanguages: ['es', 'fr', 'de'],
    autoPopup: true,
    includeDefinitions: true,
    translationService: 'libre_translate',
    dictionaryService: 'free_dictionary',
    theme: 'system'
  };
  
  private constructor() {}
  
  public static getInstance(): ConfigurationService {
    if (!ConfigurationService.instance) {
      ConfigurationService.instance = new ConfigurationService();
    }
    return ConfigurationService.instance;
  }
  
  async getConfig(): Promise<ExtensionConfig> {
    return new Promise((resolve) => {
      browserAPI.storage.local.get(['config'], (result) => {
        if (result.config) {
          resolve({...this.defaultConfig, ...result.config});
        } else {
          resolve(this.defaultConfig);
        }
      });
    });
  }
  
  async updateConfig(config: Partial<ExtensionConfig>): Promise<ExtensionConfig> {
    const currentConfig = await this.getConfig();
    const newConfig = {...currentConfig, ...config};
    
    return new Promise((resolve) => {
      browserAPI.storage.local.set({config: newConfig}, () => {
        resolve(newConfig);
      });
    });
  }
  
  async resetConfig(): Promise<ExtensionConfig> {
    return new Promise((resolve) => {
      browserAPI.storage.local.set({config: this.defaultConfig}, () => {
        resolve(this.defaultConfig);
      });
    });
  }
}
