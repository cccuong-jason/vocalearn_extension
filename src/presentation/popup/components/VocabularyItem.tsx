// src/presentation/popup/components/VocabularyItem.tsx
import React, { useState } from 'react';
import { VocabularyWord } from '../../../core/domain/models/vocabulary';

interface VocabularyItemProps {
  word: VocabularyWord;
  onDelete: (id: number) => void;
  onUpdate: (word: VocabularyWord) => void;
}

export const VocabularyItem: React.FC<VocabularyItemProps> = ({ 
  word, 
  onDelete, 
  onUpdate 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedWord, setEditedWord] = useState(word);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedWord(word); // Reset to original
  };

  const handleSave = () => {
    onUpdate({
      ...editedWord,
      lastReviewed: new Date().toISOString()
    });
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedWord((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="vocabulary-item">
      {isEditing ? (
        <div className="edit-mode">
          <input
            type="text"
            name="word"
            value={editedWord.word}
            onChange={handleChange}
          />
          <textarea
            name="translation"
            value={editedWord.translation}
            onChange={handleChange}
          />
          <div className="actions">
            <button onClick={handleSave}>Save</button>
            <button onClick={handleCancel}>Cancel</button>
          </div>
        </div>
      ) : (
        <div className="view-mode">
          <h3>{word.word}</h3>
          <p>{word.translation}</p>
          <div className="actions">
            <button onClick={handleEdit}>Edit</button>
            <button onClick={() => word.id !== undefined ? onDelete(word.id) : null}>Delete</button>
          </div>
        </div>
      )}
    </div>
  );
};
