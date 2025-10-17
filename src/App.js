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
  const [uploadedFile, setUploadedFile] = useState(null);
  const [settings, setSettings] = useState({
    from_language: 'auto',
    to_language: 'same'
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

  const handleFileUpload = (file) => {
    setUploadedFile(file);
  };

  const downloadTranscription = () => {
    if (transcriptionResult) {
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      const blob = new Blob([transcriptionResult.text], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `transcription_${timestamp}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const downloadOriginalFile = () => {
    if (uploadedFile) {
      const url = URL.createObjectURL(uploadedFile);
      const a = document.createElement('a');
      a.href = url;
      a.download = uploadedFile.name;
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
            Audio & Video Transcribe
          </h1>
          <p>AI-powered audio and video transcription and translation</p>
        </header>

        <div className="grid">
          <div className="card">
            <h2>
              <Upload className="section-icon" />
              Upload Audio/Video File
            </h2>
            <FileUpload
              onTranscriptionComplete={handleTranscriptionComplete}
              onError={handleError}
              onLoading={handleLoading}
              onFileUpload={handleFileUpload}
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
              <p>Processing your audio/video... This may take a few moments.</p>
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
              <div className="download-buttons">
                <button
                  className="btn btn-success"
                  onClick={downloadTranscription}
                  disabled={!transcriptionResult}
                >
                  <Download size={20} />
                  Download TXT
                </button>
                <button
                  className="btn btn-primary"
                  onClick={downloadOriginalFile}
                  disabled={!uploadedFile}
                >
                  <Download size={20} />
                  Download Original
                </button>
              </div>
            </div>
            <TranscriptionResult result={transcriptionResult} />
          </div>
        )}

        <footer className="app-footer">
          <p>
            💡 <strong>Tip:</strong> Supports 90+ languages with automatic detection and translation capabilities.
          </p>
          <p>
            Processing time varies: Short clips (~10-30s), Medium files (~1-3min), Long files (~5-15min)
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;

