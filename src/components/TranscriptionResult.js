import React, { useState } from 'react';
import { Copy, Check, Globe, Clock } from 'lucide-react';
import './FileUpload.css';

const TranscriptionResult = ({ result }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(result.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Just now';
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div className="transcription-result">
      <div className="result-metadata">
        {result.language && (
          <div className="metadata-item">
            <Globe size={16} />
            <span>Language: <strong>{result.language.toUpperCase()}</strong></span>
          </div>
        )}
        {result.timestamp && (
          <div className="metadata-item">
            <Clock size={16} />
            <span>Processed: {formatTimestamp(result.timestamp)}</span>
          </div>
        )}
      </div>

      <div className="result-content">
        <div className="result-header">
          <h3>Transcription</h3>
          <button 
            className={`btn ${copied ? 'btn-success' : ''}`}
            onClick={copyToClipboard}
            title="Copy to clipboard"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        
        <div className="result-text">
          {result.text}
        </div>
      </div>

      {result.segments && result.segments.length > 0 && (
        <div className="segments-container">
          <h4>Detailed Segments</h4>
          <div className="segments-list">
            {result.segments.map((segment, index) => (
              <div key={index} className="segment-item">
                <div className="segment-time">
                  {formatTime(segment.start)} - {formatTime(segment.end)}
                </div>
                <div className="segment-text">
                  {segment.text}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export default TranscriptionResult;
