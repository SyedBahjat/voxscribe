import React, { useState } from 'react';
import { Mic, FileAudio, Download } from 'lucide-react';
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
    to_language: 'en'
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

        <div className="main-content">
          <div className="transcription-interface">
            <div className="interface-header">
              <h2>🎵 Audio & Video Transcription</h2>
              <p>Upload files or record audio for AI-powered transcription</p>
            </div>

            <div className="language-settings-top">
              <SettingsPanel
                settings={settings}
                onSettingsChange={setSettings}
              />
            </div>

            <div className="input-methods">
              <div className="upload-area">
                <FileUpload
                  onTranscriptionComplete={handleTranscriptionComplete}
                  onError={handleError}
                  onLoading={handleLoading}
                  onFileUpload={handleFileUpload}
                  settings={settings}
                />
              </div>

              <div className="recording-area">
                <AudioRecorder
                  onTranscriptionComplete={handleTranscriptionComplete}
                  onError={handleError}
                  onLoading={handleLoading}
                  settings={settings}
                />
              </div>
            </div>
          </div>
        </div>

        {isLoading && (
          <div className="full-page-loading">
            <div className="loading-content">
              <div className="loading-spinner"></div>
              <h2>Transcribing your audio/video...</h2>
              <p>Almost there! Please wait while we process your file.</p>
              <div className="loading-progress">
                <div className="progress-bar">
                  <div className="progress-fill"></div>
                </div>
              </div>
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
          <div className="results-section">
            <div className="results-header-inline">
              <h2>
                <FileAudio className="section-icon" />
                Transcription Complete!
              </h2>
              <div className="download-buttons">
                <button
                  className="btn btn-success"
                  onClick={downloadTranscription}
                >
                  <Download size={20} />
                  Download TXT
                </button>
                <button
                  className="btn btn-primary"
                  onClick={downloadOriginalFile}
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

