import React, { useState, useEffect } from 'react';

interface SettingOption {
  id: string;
  label: string;
  type: 'toggle' | 'select' | 'input';
  value: any;
  options?: { value: string; label: string }[];
}

const SettingsPanel: React.FC = () => {
  const [settings, setSettings] = useState<SettingOption[]>([
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
            setSettings(prevSettings => 
              prevSettings.map(setting => {
                const savedSetting = result.vocalearnSettings.find((s: SettingOption) => s.id === setting.id);
                return savedSetting ? { ...setting, value: savedSetting.value } : setting;
              })
            );
          }
        });
      }
    };
    
    loadSettings();
  }, []);

  // Save settings when they change
  const updateSetting = (id: string, newValue: any) => {
    const updatedSettings = settings.map(setting => 
      setting.id === id ? { ...setting, value: newValue } : setting
    );
    
    setSettings(updatedSettings);
    
    // Save to storage
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.set({ vocalearnSettings: updatedSettings });
    }
  };

  const renderSettingInput = (setting: SettingOption) => {
    switch (setting.type) {
      case 'toggle':
        return (
          <div className="toggle-switch">
            <input
              type="checkbox"
              id={setting.id}
              checked={setting.value}
              onChange={(e) => updateSetting(setting.id, e.target.checked)}
            />
            <label htmlFor={setting.id}></label>
          </div>
        );
        
      case 'select':
        return (
          <select
            id={setting.id}
            value={setting.value}
            onChange={(e) => updateSetting(setting.id, e.target.value)}
            className="select-input"
          >
            {setting.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
        
      case 'input':
        return (
          <input
            type="text"
            id={setting.id}
            value={setting.value}
            onChange={(e) => updateSetting(setting.id, e.target.value)}
            className="text-input"
          />
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="settings-panel">
      <h2 className="settings-title">Settings</h2>
      
      <div className="settings-list">
        {settings.map((setting) => (
          <div key={setting.id} className="setting-item">
            <div className="setting-label">{setting.label}</div>
            <div className="setting-control">
              {renderSettingInput(setting)}
            </div>
          </div>
        ))}
      </div>
      
      <div className="settings-actions">
        <button className="btn-reset">Reset to Defaults</button>
      </div>
    </div>
  );
};

export default SettingsPanel;
