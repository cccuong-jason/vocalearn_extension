/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

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
/*!************************!*\
  !*** ./src/content.ts ***!
  \************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   setupContentScript: () => (/* binding */ setupContentScript)
/* harmony export */ });
/* harmony import */ var _utils_browser_polyfill__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils/browser-polyfill */ "./src/utils/browser-polyfill.ts");
/* harmony import */ var _infra_services_configuration_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./infra/services/configuration-service */ "./src/infra/services/configuration-service.ts");
// src/content.ts


function setupContentScript() {
    // Listen for text selection
    document.addEventListener('mouseup', handleTextSelection);
    // Listen for messages from background script
    _utils_browser_polyfill__WEBPACK_IMPORTED_MODULE_0__["default"].runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.action === 'translateSelection' && message.text) {
            handleTranslateSelection(message.text);
        }
        return false;
    });
}
async function handleTextSelection(e) {
    const selection = window.getSelection();
    const selectedText = selection?.toString().trim() || '';
    if (selectedText.length > 0 && selectedText.length < 100) {
        // Check if auto-popup is enabled
        const configService = _infra_services_configuration_service__WEBPACK_IMPORTED_MODULE_1__.ConfigurationService.getInstance();
        const config = await configService.getConfig();
        if (config.autoPopup) {
            // Get translation and show popup
            const response = await _utils_browser_polyfill__WEBPACK_IMPORTED_MODULE_0__["default"].runtime.sendMessage({
                action: 'getTranslation',
                text: selectedText
            });
            if (response && (response.translations || response.definition)) {
                showPopup(e.pageX, e.pageY, selectedText, response);
            }
        }
    }
}
async function handleTranslateSelection(text) {
    const response = await _utils_browser_polyfill__WEBPACK_IMPORTED_MODULE_0__["default"].runtime.sendMessage({
        action: 'getTranslation',
        text: text
    });
    if (response && (response.translations || response.definition)) {
        const selection = window.getSelection();
        const range = selection?.getRangeAt(0);
        const rect = range?.getBoundingClientRect();
        if (rect) {
            showPopup(rect.left + window.scrollX, rect.bottom + window.scrollY, text, response);
        }
    }
}
function showPopup(x, y, word, data) {
    // Implementation of popup UI
    // This can be extracted into a UI component class
    // ...
}
// Initialize the content script
setupContentScript();

})();

/******/ })()
;
//# sourceMappingURL=content.js.map