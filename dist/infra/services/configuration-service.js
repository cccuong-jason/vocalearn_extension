// src/infrastructure/services/configuration-service.ts
import browserAPI from '../../utils/browser-polyfill';
export class ConfigurationService {
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
            browserAPI.storage.local.get(['config'], (result) => {
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
            browserAPI.storage.local.set({ config: newConfig }, () => {
                resolve(newConfig);
            });
        });
    }
    async resetConfig() {
        return new Promise((resolve) => {
            browserAPI.storage.local.set({ config: this.defaultConfig }, () => {
                resolve(this.defaultConfig);
            });
        });
    }
}
