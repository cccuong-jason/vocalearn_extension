import React from 'react';
import '../styles/TranslationPanel.css';
const TranslationPanel = ({ isSource, languageName, text, isTranslating, charCount, maxChars, onChange, onClear, onCopy, onSpeak }) => {
    return (React.createElement("div", { className: `translation-section ${isSource ? 'source' : 'target'}` },
        React.createElement("p", { className: "section-label" }, isSource ? `Translate From (${languageName})` : `Translate To (${languageName})`),
        isSource ? (React.createElement("textarea", { className: "text-input", value: text, onChange: (e) => onChange && onChange(e.target.value), placeholder: "Enter text to translate" })) : (React.createElement("div", { className: "text-output" }, isTranslating ? 'Translating...' : text || 'Translation will appear here')),
        React.createElement("div", { className: "text-actions" },
            React.createElement("span", { className: "char-count" },
                charCount,
                "/",
                maxChars),
            React.createElement("div", { className: "action-buttons" },
                isSource ? (React.createElement("button", { className: "action-btn clear-btn", onClick: onClear },
                    React.createElement("i", { className: "fas fa-times" }))) : (React.createElement("button", { className: "action-btn copy-btn", onClick: onCopy },
                    React.createElement("i", { className: "fas fa-copy" }))),
                React.createElement("button", { className: "action-btn audio-btn", onClick: onSpeak },
                    React.createElement("i", { className: "fas fa-volume-up" }))))));
};
export default TranslationPanel;
