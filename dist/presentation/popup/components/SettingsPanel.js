import React, { useState, useEffect } from 'react';
const SettingsPanel = () => {
    const [settings, setSettings] = useState([
        {
            id: 'translationService',
            label: 'Translation Service',
            type: 'select',
            value: 'google',
            options: [
                { value: 'google', label: 'Google Translate' },
                { value: 'libre', label: 'LibreTranslate' },
                { value: 'deepl', label: 'DeepL' },
                { value: 'microsoft', label: 'Microsoft Translator' },
            ],
        },
        {
            id: 'saveHistory',
            label: 'Save Translation History',
            type: 'toggle',
            value: true,
        },
        {
            id: 'autoTranslate',
            label: 'Auto Translate Selected Text',
            type: 'toggle',
            value: false,
        },
        {
            id: 'maxVocabularyItems',
            label: 'Maximum Vocabulary Items',
            type: 'input',
            value: '100',
        },
    ]);
    // Load settings from storage on component mount
    useEffect(() => {
        const loadSettings = async () => {
            if (typeof chrome !== 'undefined' && chrome.storage) {
                chrome.storage.local.get('vocalearnSettings', (result) => {
                    if (result.vocalearnSettings) {
                        setSettings(prevSettings => prevSettings.map(setting => {
                            const savedSetting = result.vocalearnSettings.find((s) => s.id === setting.id);
                            return savedSetting ? { ...setting, value: savedSetting.value } : setting;
                        }));
                    }
                });
            }
        };
        loadSettings();
    }, []);
    // Save settings when they change
    const updateSetting = (id, newValue) => {
        const updatedSettings = settings.map(setting => setting.id === id ? { ...setting, value: newValue } : setting);
        setSettings(updatedSettings);
        // Save to storage
        if (typeof chrome !== 'undefined' && chrome.storage) {
            chrome.storage.local.set({ vocalearnSettings: updatedSettings });
        }
    };
    const renderSettingInput = (setting) => {
        switch (setting.type) {
            case 'toggle':
                return (React.createElement("div", { className: "toggle-switch" },
                    React.createElement("input", { type: "checkbox", id: setting.id, checked: setting.value, onChange: (e) => updateSetting(setting.id, e.target.checked) }),
                    React.createElement("label", { htmlFor: setting.id })));
            case 'select':
                return (React.createElement("select", { id: setting.id, value: setting.value, onChange: (e) => updateSetting(setting.id, e.target.value), className: "select-input" }, setting.options?.map(option => (React.createElement("option", { key: option.value, value: option.value }, option.label)))));
            case 'input':
                return (React.createElement("input", { type: "text", id: setting.id, value: setting.value, onChange: (e) => updateSetting(setting.id, e.target.value), className: "text-input" }));
            default:
                return null;
        }
    };
    return (React.createElement("div", { className: "settings-panel" },
        React.createElement("h2", { className: "settings-title" }, "Settings"),
        React.createElement("div", { className: "settings-list" }, settings.map((setting) => (React.createElement("div", { key: setting.id, className: "setting-item" },
            React.createElement("div", { className: "setting-label" }, setting.label),
            React.createElement("div", { className: "setting-control" }, renderSettingInput(setting)))))),
        React.createElement("div", { className: "settings-actions" },
            React.createElement("button", { className: "btn-reset" }, "Reset to Defaults"))));
};
export default SettingsPanel;
