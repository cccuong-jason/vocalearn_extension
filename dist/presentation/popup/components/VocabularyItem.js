// src/presentation/popup/components/VocabularyItem.tsx
import React, { useState } from 'react';
export const VocabularyItem = ({ word, onDelete, onUpdate }) => {
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
    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedWord((prev) => ({
            ...prev,
            [name]: value
        }));
    };
    return (React.createElement("div", { className: "vocabulary-item" }, isEditing ? (React.createElement("div", { className: "edit-mode" },
        React.createElement("input", { type: "text", name: "word", value: editedWord.word, onChange: handleChange }),
        React.createElement("textarea", { name: "translation", value: editedWord.translation, onChange: handleChange }),
        React.createElement("div", { className: "actions" },
            React.createElement("button", { onClick: handleSave }, "Save"),
            React.createElement("button", { onClick: handleCancel }, "Cancel")))) : (React.createElement("div", { className: "view-mode" },
        React.createElement("h3", null, word.word),
        React.createElement("p", null, word.translation),
        React.createElement("div", { className: "actions" },
            React.createElement("button", { onClick: handleEdit }, "Edit"),
            React.createElement("button", { onClick: () => word.id !== undefined ? onDelete(word.id) : null }, "Delete"))))));
};
