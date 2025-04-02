import { LibreTranslateService } from '../services/libre-translate-service';
import { ServiceLocator } from '../di/service-locator';
// Add more implementations as needed
export var TranslationServiceType;
(function (TranslationServiceType) {
    TranslationServiceType["LIBRE_TRANSLATE"] = "libre_translate";
    TranslationServiceType["GOOGLE_TRANSLATE"] = "google_translate";
    TranslationServiceType["MICROSOFT_TRANSLATE"] = "microsoft_translate";
    TranslationServiceType["DEEPL"] = "deepl";
})(TranslationServiceType || (TranslationServiceType = {}));
export class TranslationServiceFactory {
    static create(type, apiKey) {
        switch (type) {
            case TranslationServiceType.LIBRE_TRANSLATE:
                return new LibreTranslateService();
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
                return new LibreTranslateService();
        }
    }
    static register(type, apiKey) {
        const service = this.create(type, apiKey);
        ServiceLocator.getInstance().registerService('translationService', service);
    }
}
