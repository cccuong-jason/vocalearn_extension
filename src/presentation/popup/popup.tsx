import React, { useState, useEffect, useCallback } from 'react';
import './styles/popup.css';
import LanguageSelector from './components/LanguageSelector';
import TranslationPanel from './components/TranslationPanel';
import NavigationBar from './components/NavigationBar';
import VocabularyList from './components/VocabularyList';
import SettingsPanel from './components/SettingsPanel';
import { VocabularyWord } from '../../core/domain/models/vocabulary';

// Language data
type LanguageKey = 'en' | 'vi';

const languages = {
  en: {
    code: 'en',
    name: 'English',
    flag: 'en.png'
  },
  vi: {
    code: 'vi',
    name: 'Vietnamese',
    flag: 'vn.png'
  }
};

// Navigation items
const navigationItems = [
  { id: 'translate', icon: 'fas fa-language', label: 'Translate' },
  { id: 'vocabulary', icon: 'fas fa-book', label: 'Vocabulary' },
  { id: 'history', icon: 'fas fa-history', label: 'History' },
  { id: 'settings', icon: 'fas fa-cog', label: 'Settings' }
];

const Popup: React.FC = () => {
  // State
  const [activeTab, setActiveTab] = useState('translate');
  const [sourceLanguage, setSourceLanguage] = useState<LanguageKey>('en');
  const [targetLanguage, setTargetLanguage] = useState<LanguageKey>('vi');
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);
  const [vocabularyWords, setVocabularyWords] = useState<VocabularyWord[]>([]);

  // Load saved state on initial render
  useEffect(() => {
    const loadSavedState = async () => {
      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.local.get('vocalearnState', (result) => {
          if (result.vocalearnState) {
            const { sourceLanguage: savedSourceLang, targetLanguage: savedTargetLang, sourceText: savedSourceText, translatedText: savedTranslatedText } = result.vocalearnState;
            
            if (savedSourceLang) setSourceLanguage(savedSourceLang);
            if (savedTargetLang) setTargetLanguage(savedTargetLang);
            if (savedSourceText) setSourceText(savedSourceText);
            if (savedTranslatedText) setTranslatedText(savedTranslatedText);
          }
        });
      }
    };
    
    loadSavedState();
  }, []);

  // Load vocabulary words on initial render
  useEffect(() => {
    const loadVocabulary = async () => {
      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.local.get('vocabulary', (result) => {
          if (result.vocabulary) {
            setVocabularyWords(result.vocabulary);
          }
        });
      }
    };
    
    loadVocabulary();
  }, []);

  // Save state when it changes
  useEffect(() => {
    const saveState = () => {
      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.local.set({
          vocalearnState: {
            sourceLanguage,
            targetLanguage,
            sourceText,
            translatedText
          }
        });
      }
    };
    
    saveState();
  }, [sourceLanguage, targetLanguage, sourceText, translatedText]);

  // Handle source text change with debounce
  const handleSourceTextChange = useCallback((text: string) => {
    setSourceText(text);

    // Clear previous debounce timer
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    // Set new debounce timer for translation
    const timer = setTimeout(() => {
      if (text.trim().length > 0) {
        translateText(text);
      } else {
        setTranslatedText('');
      }
    }, 500);

    setDebounceTimer(timer);
  }, [debounceTimer]);

  // Translate text function (mock implementation)
  const translateText = useCallback((text: string) => {
    setIsTranslating(true);

    // In a real implementation, you would call a translation API here
    setTimeout(() => {
      const translatedText = `[${languages[targetLanguage as keyof typeof languages].name} translation of: "${text}"]`;
      setTranslatedText(translatedText);
      setIsTranslating(false);
    }, 700);
  }, [targetLanguage]);

  // Swap languages
  const swapLanguages = useCallback(() => {
    setSourceLanguage(targetLanguage);
    setTargetLanguage(sourceLanguage);
    
    // Re-translate if there's text
    if (sourceText.trim().length > 0) {
      setTimeout(() => translateText(sourceText), 0);
    }
  }, [sourceLanguage, targetLanguage, sourceText, translateText]);

  // Clear text
  const clearText = useCallback(() => {
    setSourceText('');
    setTranslatedText('');
  }, []);

  // Copy translation to clipboard
  const copyTranslation = useCallback(() => {
    if (translatedText) {
      navigator.clipboard.writeText(translatedText);
      // Could add toast notification here
    }
  }, [translatedText]);

  // Text-to-speech functionality
  const speakText = useCallback((text: string, languageCode: string) => {
    if (text && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = languageCode;
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  // Handle navigation between tabs
  const handleNavigation = useCallback((tabId: string) => {
    setActiveTab(tabId);
  }, []);

  // Handle vocabulary word deletion
  const handleDeleteWord = useCallback((id: number) => {
    setVocabularyWords(prev => {
      const updatedWords = prev.filter(word => word.id !== id);
      
      // Save to storage
      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.local.set({ vocabulary: updatedWords });
      }
      
      return updatedWords;
    });
  }, []);

  // Handle vocabulary word update
  const handleUpdateWord = useCallback((updatedWord: VocabularyWord) => {
    setVocabularyWords(prev => {
      const updatedWords = prev.map(word => 
        word.id === updatedWord.id ? updatedWord : word
      );
      
      // Save to storage
      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.local.set({ vocabulary: updatedWords });
      }
      
      return updatedWords;
    });
  }, []);

  // Render active content based on selected tab
  const renderActiveContent = () => {
    switch (activeTab) {
      case 'translate':
        return (
          <>
            <LanguageSelector
              sourceLanguage={languages[sourceLanguage]}
              targetLanguage={languages[targetLanguage]}
              onSwapLanguages={swapLanguages}
            />
            
            <TranslationPanel
              isSource={true}
              languageName={languages[sourceLanguage].name}
              text={sourceText}
              charCount={sourceText.length}
              maxChars={2300}
              onChange={handleSourceTextChange}
              onClear={clearText}
              onSpeak={() => speakText(sourceText, sourceLanguage)}
            />
            
            <div className="divider" />
            
            <TranslationPanel
              isSource={false}
              languageName={languages[targetLanguage].name}
              text={translatedText}
              isTranslating={isTranslating}
              charCount={translatedText.length}
              maxChars={2300}
              onCopy={copyTranslation}
              onSpeak={() => speakText(translatedText, targetLanguage)}
            />
          </>
        );
      case 'vocabulary':
        return <VocabularyList 
          vocabularyWords={vocabularyWords}
          onDeleteWord={handleDeleteWord}
          onUpdateWord={handleUpdateWord}
        />;
      case 'settings':
        return <SettingsPanel />;
      default:
        return <div className="coming-soon">This feature is coming soon!</div>;
    }
  };

  return (
    <div className="popup">
      <header className="header">
        <h1 className="title">Vocalearn</h1>
        <button className="notification-btn">
          <i className="fas fa-bell"></i>
        </button>
      </header>
      
      <div className="content">
        {renderActiveContent()}
      </div>
      
      <NavigationBar
        items={navigationItems}
        activeItem={activeTab}
        onItemClick={handleNavigation}
      />
    </div>
  );
};

export default Popup;
