// src/presentation/popup/components/VocabularyList.tsx
import React from 'react';
import { VocabularyWord } from '../../../core/domain/models/vocabulary';
import { VocabularyItem } from './VocabularyItem';

interface VocabularyListProps {
  vocabularyWords: VocabularyWord[];
  onDeleteWord: (id: number) => void;
  onUpdateWord: (word: VocabularyWord) => void;
}

const VocabularyList: React.FC<VocabularyListProps> = ({ 
  vocabularyWords, 
  onDeleteWord, 
  onUpdateWord 
}) => {
  if (vocabularyWords.length === 0) {
    return <div className="empty-vocabulary-message">No words saved yet. Translate and save words to see them here.</div>;
  }

  return (
    <div className="vocabulary-list">
      {vocabularyWords.map(word => (
        <VocabularyItem
          key={word.id}
          word={word}
          onDelete={onDeleteWord}
          onUpdate={onUpdateWord}
        />
      ))}
    </div>
  );
};

export default VocabularyList;
