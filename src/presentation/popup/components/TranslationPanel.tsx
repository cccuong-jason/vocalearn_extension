import React from 'react';
import '../styles/TranslationPanel.css';

interface TranslationPanelProps {
  isSource: boolean;
  languageName: string;
  text: string;
  isTranslating?: boolean;
  charCount: number;
  maxChars: number;
  onChange?: (text: string) => void;
  onClear?: () => void;
  onCopy?: () => void;
  onSpeak: () => void;
}

const TranslationPanel: React.FC<TranslationPanelProps> = ({
  isSource,
  languageName,
  text,
  isTranslating,
  charCount,
  maxChars,
  onChange,
  onClear,
  onCopy,
  onSpeak
}) => {
  return (
    <div className={`translation-section ${isSource ? 'source' : 'target'}`}>
      <p className="section-label">
        {isSource ? `Translate From (${languageName})` : `Translate To (${languageName})`}
      </p>
      
      {isSource ? (
        <textarea
          className="text-input"
          value={text}
          onChange={(e) => onChange && onChange(e.target.value)}
          placeholder="Enter text to translate"
        />
      ) : (
        <div className="text-output">
          {isTranslating ? 'Translating...' : text || 'Translation will appear here'}
        </div>
      )}
      
      <div className="text-actions">
        <span className="char-count">{charCount}/{maxChars}</span>
        <div className="action-buttons">
          {isSource ? (
            <button className="action-btn clear-btn" onClick={onClear}>
              <i className="fas fa-times"></i>
            </button>
          ) : (
            <button className="action-btn copy-btn" onClick={onCopy}>
              <i className="fas fa-copy"></i>
            </button>
          )}
          <button className="action-btn audio-btn" onClick={onSpeak}>
            <i className="fas fa-volume-up"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TranslationPanel;
