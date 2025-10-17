import React from 'react';
import { Settings as SettingsIcon, Globe, FileText } from 'lucide-react';
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
          Source Language
        </label>
        <select
          id="from_language"
          value={settings.from_language || 'auto'}
          onChange={handleFromLanguageChange}
        >
          <option value="auto">Auto-detect (Recommended)</option>
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
          <option value="it">Italian</option>
          <option value="pt">Portuguese</option>
          <option value="ru">Russian</option>
          <option value="ja">Japanese</option>
          <option value="ko">Korean</option>
          <option value="zh">Chinese</option>
          <option value="ar">Arabic</option>
          <option value="hi">Hindi</option>
          <option value="ur">Urdu</option>
          <option value="tr">Turkish</option>
          <option value="nl">Dutch</option>
          <option value="sv">Swedish</option>
          <option value="no">Norwegian</option>
          <option value="da">Danish</option>
          <option value="fi">Finnish</option>
          <option value="pl">Polish</option>
          <option value="cs">Czech</option>
          <option value="hu">Hungarian</option>
          <option value="ro">Romanian</option>
          <option value="bg">Bulgarian</option>
          <option value="hr">Croatian</option>
          <option value="sk">Slovak</option>
          <option value="sl">Slovenian</option>
          <option value="et">Estonian</option>
          <option value="lv">Latvian</option>
          <option value="lt">Lithuanian</option>
          <option value="el">Greek</option>
          <option value="he">Hebrew</option>
          <option value="th">Thai</option>
          <option value="vi">Vietnamese</option>
          <option value="id">Indonesian</option>
          <option value="ms">Malay</option>
          <option value="tl">Filipino</option>
        </select>
        <small>
          Auto-detect works best for most cases. Choose a specific language for better accuracy.
        </small>
      </div>

      <div className="input-group">
        <label htmlFor="to_language">
          <FileText size={16} />
          Target Language
        </label>
        <select
          id="to_language"
          value={settings.to_language || 'same'}
          onChange={handleToLanguageChange}
        >
          <option value="same">Keep original language</option>
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
          <option value="it">Italian</option>
          <option value="pt">Portuguese</option>
          <option value="ru">Russian</option>
          <option value="ja">Japanese</option>
          <option value="ko">Korean</option>
          <option value="zh">Chinese</option>
          <option value="ar">Arabic</option>
          <option value="hi">Hindi</option>
          <option value="ur">Urdu</option>
          <option value="tr">Turkish</option>
          <option value="nl">Dutch</option>
          <option value="sv">Swedish</option>
          <option value="no">Norwegian</option>
          <option value="da">Danish</option>
          <option value="fi">Finnish</option>
          <option value="pl">Polish</option>
          <option value="cs">Czech</option>
          <option value="hu">Hungarian</option>
          <option value="ro">Romanian</option>
          <option value="bg">Bulgarian</option>
          <option value="hr">Croatian</option>
          <option value="sk">Slovak</option>
          <option value="sl">Slovenian</option>
          <option value="et">Estonian</option>
          <option value="lv">Latvian</option>
          <option value="lt">Lithuanian</option>
          <option value="el">Greek</option>
          <option value="he">Hebrew</option>
          <option value="th">Thai</option>
          <option value="vi">Vietnamese</option>
          <option value="id">Indonesian</option>
          <option value="ms">Malay</option>
          <option value="tl">Filipino</option>
        </select>
        <small>
          Choose "Keep original language" to transcribe only, or select a target language for translation.
        </small>
      </div>

      <div className="settings-info">
        <h4>
          <SettingsIcon size={16} />
          Processing Information
        </h4>
        <ul>
          <li><strong>Model:</strong> OpenAI Whisper</li>
          <li><strong>Supported formats:</strong> MP3, WAV, M4A, OGG, FLAC, MP4, AVI, MOV, MKV</li>
          <li><strong>Max file size:</strong> 500MB</li>
          <li><strong>Languages supported:</strong> 90+ languages</li>
          <li><strong>Translation modes:</strong> Whisper native + Text translation</li>
        </ul>
      </div>

      <div className="performance-tips">
        <h4>Performance Tips</h4>
        <ul>
          <li>Shorter audio files process faster</li>
          <li>Clear audio without background noise works best</li>
          <li>Auto-detect language is usually most accurate</li>
          <li>Translation to English uses Whisper's native translation</li>
          <li>Other language translations use text translation (may take longer)</li>
        </ul>
      </div>
    </div>
  );
};

export default SettingsPanel;
