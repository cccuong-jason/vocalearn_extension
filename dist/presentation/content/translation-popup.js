// src/presentation/content/translation-popup.ts
import browserAPI from '../../utils/browser-polyfill';
import { ConfigurationService } from '../../infra/services/configuration-service';
export class TranslationPopup {
    constructor() {
        this.popup = null;
        this.word = '';
        this.data = {};
        this.position = { x: 0, y: 0 };
        // Close popup when clicking outside
        document.addEventListener('mousedown', (e) => {
            if (this.popup && !this.popup.contains(e.target)) {
                this.close();
            }
        });
        // Close popup when pressing Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.close();
            }
        });
    }
    async show(x, y, word, data) {
        this.close(); // Close any existing popup
        this.word = word;
        this.data = data;
        this.position = { x, y };
        // Create popup element
        this.popup = document.createElement('div');
        this.popup.id = 'vocalearn-popup';
        this.popup.className = 'vocalearn-popup';
        // Position the popup near the selection
        this.popup.style.left = `${x + 10}px`;
        this.popup.style.top = `${y + 10}px`;
        // Apply theme
        const configService = ConfigurationService.getInstance();
        const config = await configService.getConfig();
        if (config.theme === 'dark' ||
            (config.theme === 'system' &&
                window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            this.popup.classList.add('vocalearn-dark');
        }
        // Create content
        await this.renderContent();
        // Add popup to page
        document.body.appendChild(this.popup);
        // Position adjustment if popup goes off-screen
        this.adjustPosition();
        // Add animation
        setTimeout(() => {
            if (this.popup) {
                this.popup.classList.add('vocalearn-popup-visible');
            }
        }, 10);
    }
    close() {
        if (this.popup) {
            // Add closing animation
            this.popup.classList.remove('vocalearn-popup-visible');
            // Remove after animation completes
            setTimeout(() => {
                if (this.popup && this.popup.parentNode) {
                    this.popup.parentNode.removeChild(this.popup);
                }
                this.popup = null;
            }, 300); // Match animation duration
        }
    }
    async renderContent() {
        if (!this.popup)
            return;
        let content = `
      <div class="vocalearn-header">
        <span class="vocalearn-word">${this.word}</span>
        <button class="vocalearn-close" aria-label="Close">×</button>
      </div>
      <div class="vocalearn-content">
    `;
        // Add translations
        if (this.data.translations && Object.keys(this.data.translations).length > 0) {
            content += '<div class="vocalearn-section"><h3>Translations</h3>';
            for (const [language, translation] of Object.entries(this.data.translations)) {
                content += `<div><strong>${language}:</strong> ${translation}</div>`;
            }
            content += '</div>';
        }
        // Add definition if available
        const configService = ConfigurationService.getInstance();
        const config = await configService.getConfig();
        if (config.includeDefinitions && this.data.definition) {
            content += '<div class="vocalearn-section"><h3>Definition</h3>';
            if (this.data.definition.phonetic) {
                content += `<div class="vocalearn-phonetic">${this.data.definition.phonetic}</div>`;
            }
            if (this.data.definition.meanings && this.data.definition.meanings.length > 0) {
                this.data.definition.meanings.forEach(meaning => {
                    content += `<div class="vocalearn-meaning">
            <div class="vocalearn-pos">${meaning.partOfSpeech}</div>`;
                    meaning.definitions.slice(0, 2).forEach(def => {
                        content += `<div class="vocalearn-definition">${def.definition}</div>`;
                        if (def.example) {
                            content += `<div class="vocalearn-example">"${def.example}"</div>`;
                        }
                        if (def.synonyms && def.synonyms.length > 0) {
                            content += `<div class="vocalearn-synonyms">
                <strong>Synonyms:</strong> ${def.synonyms.slice(0, 5).join(', ')}
              </div>`;
                        }
                    });
                    content += '</div>';
                });
            }
            content += '</div>';
        }
        // Add save button
        content += `
      <div class="vocalearn-actions">
        <button class="vocalearn-save">Save to Vocabulary</button>
      </div>
    `;
        content += '</div>'; // Close content div
        this.popup.innerHTML = content;
        // Add event listeners
        this.popup.querySelector('.vocalearn-close')?.addEventListener('click', () => {
            this.close();
        });
        this.popup.querySelector('.vocalearn-save')?.addEventListener('click', () => {
            this.saveWord();
        });
    }
    adjustPosition() {
        if (!this.popup)
            return;
        const rect = this.popup.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        // Adjust horizontal position if needed
        if (rect.right > viewportWidth) {
            const newLeft = Math.max(0, viewportWidth - rect.width - 10);
            this.popup.style.left = `${newLeft}px`;
        }
        // Adjust vertical position if needed
        if (rect.bottom > viewportHeight) {
            const newTop = Math.max(0, viewportHeight - rect.height - 10);
            this.popup.style.top = `${newTop}px`;
        }
    }
    async saveWord() {
        if (!this.popup)
            return;
        const saveBtn = this.popup.querySelector('.vocalearn-save');
        saveBtn.disabled = true;
        saveBtn.textContent = 'Saving...';
        // Get the first translation as default
        const translation = this.data.translations ?
            Object.values(this.data.translations)[0] : '';
        try {
            const response = await browserAPI.runtime.sendMessage({
                action: 'saveWord',
                word: this.word,
                translation: translation,
                notes: ''
            });
            if (response && response.success) {
                saveBtn.textContent = 'Saved!';
                // Close popup after a delay
                setTimeout(() => {
                    this.close();
                }, 1500);
            }
            else {
                throw new Error(response.error || 'Failed to save word');
            }
        }
        catch (error) {
            console.error('Error saving word:', error);
            saveBtn.textContent = 'Error!';
            saveBtn.disabled = false;
            // Show error message
            const errorMsg = document.createElement('div');
            errorMsg.className = 'vocalearn-error';
            errorMsg.textContent = 'Failed to save word. Please try again.';
            saveBtn.parentNode?.appendChild(errorMsg);
            // Remove error message after a delay
            setTimeout(() => {
                errorMsg.remove();
                saveBtn.textContent = 'Save to Vocabulary';
            }, 3000);
        }
    }
}
