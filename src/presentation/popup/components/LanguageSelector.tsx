import React from 'react';
import '../styles/LanguageSelector.css';

interface Language {
  code: string;
  name: string;
  flag: string;
}

interface LanguageSelectorProps {
  sourceLanguage: Language;
  targetLanguage: Language;
  onSwapLanguages: () => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  sourceLanguage,
  targetLanguage,
  onSwapLanguages
}) => {
  return (
    <div className="language-bar">
      <button className="language-btn source">
        <img 
          src={`/assets/flags/${sourceLanguage.flag}`} 
          alt={`${sourceLanguage.name} flag`} 
          className="flag"
        />
        <span className="lang-name">{sourceLanguage.name}</span>
      </button>
      
      <button className="swap-btn" onClick={onSwapLanguages}>
        <i className="fas fa-exchange-alt"></i>
      </button>
      
      <button className="language-btn target">
        <img 
          src={`/assets/flags/${targetLanguage.flag}`} 
          alt={`${targetLanguage.name} flag`} 
          className="flag"
        />
        <span className="lang-name">{targetLanguage.name}</span>
      </button>
    </div>
  );
};

export default LanguageSelector;
