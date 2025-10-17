import React, { useState } from 'react';
import { Mic, Upload, FileAudio, Settings, Download } from 'lucide-react';
import FileUpload from './components/FileUpload';
import AudioRecorder from './components/AudioRecorder';
import TranscriptionResult from './components/TranscriptionResult';
import SettingsPanel from './components/SettingsPanel';
import './App.css';

function App() {
  const [transcriptionResult, setTranscriptionResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [settings, setSettings] = useState({
    language: 'auto',
    task: 'transcribe'
  });

  const handleTranscriptionComplete = (result) => {
    setTranscriptionResult(result);
    setIsLoading(false);
    setError(null);
  };

  const handleError = (errorMessage) => {
    setError(errorMessage);
    setIsLoading(false);
  };

  const handleLoading = (loading) => {
    setIsLoading(loading);
    if (loading) {
      setError(null);
    }
  };

  const downloadTranscription = () => {
    if (transcriptionResult) {
      const blob = new Blob([transcriptionResult.text], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `transcription_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="App">
      <div className="container">
        <header className="app-header">
          <h1>
            <Mic className="header-icon" />
            Audio Transcribe
          </h1>
          <p>AI-powered audio transcription and translation</p>
        </header>

        <div className="grid">
          <div className="card">
            <h2>
              <Upload className="section-icon" />
              Upload Audio File
            </h2>
            <FileUpload
              onTranscriptionComplete={handleTranscriptionComplete}
              onError={handleError}
              onLoading={handleLoading}
              settings={settings}
            />
          </div>

          <div className="card">
            <h2>
              <Mic className="section-icon" />
              Record Audio
            </h2>
            <AudioRecorder
              onTranscriptionComplete={handleTranscriptionComplete}
              onError={handleError}
              onLoading={handleLoading}
              settings={settings}
            />
          </div>

          <div className="card">
            <h2>
              <Settings className="section-icon" />
              Settings
            </h2>
            <SettingsPanel
              settings={settings}
              onSettingsChange={setSettings}
            />
          </div>
        </div>

        {isLoading && (
          <div className="card">
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Processing your audio... This may take a few moments.</p>
            </div>
          </div>
        )}

        {error && (
          <div className="card">
            <div className="error-message">
              <strong>Error:</strong> {error}
            </div>
          </div>
        )}

        {transcriptionResult && (
          <div className="card">
            <div className="result-header">
              <h2>
                <FileAudio className="section-icon" />
                Transcription Result
              </h2>
              <button 
                className="btn btn-success"
                onClick={downloadTranscription}
              >
                <Download size={20} />
                Download
              </button>
            </div>
            <TranscriptionResult result={transcriptionResult} />
          </div>
        )}

        <footer className="app-footer">
          <p>
            💡 <strong>Tip:</strong> Supports 90+ languages with automatic detection and translation to English.
          </p>
          <p>
            Processing time varies: Short clips (~10-30s), Medium videos (~1-3min), Long videos (~5-15min)
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;

