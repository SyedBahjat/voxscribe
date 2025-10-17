import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Pause } from 'lucide-react';
import { transcribeAudio } from '../utils/api';
import './FileUpload.css';

const AudioRecorder = ({ onTranscriptionComplete, onError, onLoading, settings }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [hasPermission, setHasPermission] = useState(null);
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);

  useEffect(() => {
    // Check for microphone permission
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(() => setHasPermission(true))
      .catch(() => setHasPermission(false));

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setAudioBlob(audioBlob);
        setAudioUrl(URL.createObjectURL(audioBlob));
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setIsPaused(false);
      setRecordingTime(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (error) {
      onError('Failed to access microphone. Please check your permissions.');
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
        setIsPaused(false);
        // Resume timer
        timerRef.current = setInterval(() => {
          setRecordingTime(prev => prev + 1);
        }, 1000);
      } else {
        mediaRecorderRef.current.pause();
        setIsPaused(true);
        // Pause timer
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const handleTranscribe = async () => {
    if (!audioBlob) return;

    onLoading(true);
    try {
      // Create a File object from the blob
      const audioFile = new File([audioBlob], 'recording.wav', { type: 'audio/wav' });
      const result = await transcribeAudio(audioFile, settings);
      onTranscriptionComplete(result);
    } catch (error) {
      onError(error.message || 'Transcription failed. Please try again.');
    }
  };

  const clearRecording = () => {
    setAudioBlob(null);
    setAudioUrl(null);
    setRecordingTime(0);
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (hasPermission === false) {
    return (
      <div className="error-message">
        <strong>Microphone Access Required</strong>
        <p>Please allow microphone access to record audio.</p>
      </div>
    );
  }

  return (
    <div className="audio-recorder-container">
      {!audioBlob ? (
        <>
          {!isRecording ? (
            <div className="recording-setup">
              <div className="mic-icon">
                <Mic size={40} />
              </div>
              <h3>Ready to Record</h3>
              <p>Click to start recording</p>
              <button
                className="btn btn-danger"
                onClick={startRecording}
                disabled={hasPermission === null}
              >
                <Mic size={16} />
                Start Recording
              </button>
            </div>
          ) : (
            <div className="recording-active">
              <div className="recording-indicator">
                <div className="recording-dot"></div>
                <span>{formatTime(recordingTime)}</span>
              </div>

              <div className="recording-controls">
                <button
                  className="btn btn-sm"
                  onClick={pauseRecording}
                >
                  {isPaused ? <Play size={14} /> : <Pause size={14} />}
                  {isPaused ? 'Resume' : 'Pause'}
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={stopRecording}
                >
                  <Square size={14} />
                  Stop
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="recording-complete">
          <audio
            controls
            className="audio-player"
            src={audioUrl}
          >
            Your browser does not support the audio element.
          </audio>

          <div className="recording-actions">
            <button
              className="btn"
              onClick={handleTranscribe}
            >
              <Mic size={20} />
              Transcribe Recording
            </button>
            <button
              className="btn"
              onClick={clearRecording}
            >
              Record Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
