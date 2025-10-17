import React from 'react';
import { Globe, Languages } from 'lucide-react';
import './FileUpload.css';

const SettingsPanel = ({ settings, onSettingsChange }) => {
  const handleFromLanguageChange = (e) => {
    onSettingsChange({
      ...settings,
      from_language: e.target.value
    });
  };

  const handleToLanguageChange = (e) => {
    onSettingsChange({
      ...settings,
      to_language: e.target.value
    });
  };

  return (
    <div className="settings-panel">
      <div className="input-group">
        <label htmlFor="from_language">
          <Globe size={16} />
          Input Language
        </label>
        <select
          id="from_language"
          value={settings.from_language || 'auto'}
          onChange={handleFromLanguageChange}
        >
          <option value="auto">Auto-detect</option>
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
          <option value="hi">Hindi</option>
          <option value="ur">Urdu</option>
          <option value="ar">Arabic</option>
          <option value="zh">Chinese</option>
          <option value="ja">Japanese</option>
          <option value="pt">Portuguese</option>
          <option value="ru">Russian</option>
          <option value="it">Italian</option>
        </select>
      </div>

      <div className="input-group">
        <label htmlFor="to_language">
          <Languages size={16} />
          Output Language
        </label>
        <select
          id="to_language"
          value={settings.to_language || 'en'}
          onChange={handleToLanguageChange}
        >
          <option value="en">English</option>
          <option value="same">Same as input</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
          <option value="hi">Hindi</option>
          <option value="ur">Urdu</option>
          <option value="ar">Arabic</option>
          <option value="zh">Chinese</option>
          <option value="ja">Japanese</option>
          <option value="pt">Portuguese</option>
        </select>
      </div>
    </div>
  );
};

export default SettingsPanel;
