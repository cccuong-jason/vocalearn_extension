// src/presentation/popup/components/VocabularyList.tsx
import React from 'react';
import { VocabularyItem } from './VocabularyItem';
const VocabularyList = ({ vocabularyWords, onDeleteWord, onUpdateWord }) => {
    if (vocabularyWords.length === 0) {
        return React.createElement("div", { className: "empty-vocabulary-message" }, "No words saved yet. Translate and save words to see them here.");
    }
    return (React.createElement("div", { className: "vocabulary-list" }, vocabularyWords.map(word => (React.createElement(VocabularyItem, { key: word.id, word: word, onDelete: onDeleteWord, onUpdate: onUpdateWord })))));
};
export default VocabularyList;
