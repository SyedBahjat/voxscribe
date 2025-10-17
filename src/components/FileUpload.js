import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileAudio, FileVideo, AlertCircle } from 'lucide-react';
import { transcribeAudio } from '../utils/api';
import './FileUpload.css';

const FileUpload = ({ onTranscriptionComplete, onError, onLoading, onFileUpload, settings }) => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [fileError, setFileError] = useState(null);

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    setFileError(null);

    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0];
      if (rejection.errors[0].code === 'file-too-large') {
        setFileError('File is too large. Maximum size is 500MB.');
      } else if (rejection.errors[0].code === 'file-invalid-type') {
        setFileError('Invalid file type. Please upload audio or video files (mp3, wav, m4a, ogg, flac, mp4, avi, mov, mkv).');
      } else {
        setFileError('File upload failed. Please try again.');
      }
      return;
    }

    const file = acceptedFiles[0];
    setUploadedFile(file);
    if (onFileUpload) {
      onFileUpload(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.mp3', '.wav', '.m4a', '.ogg', '.flac'],
      'video/*': ['.mp4', '.avi', '.mov', '.mkv', '.webm']
    },
    maxSize: 500 * 1024 * 1024, // 500MB
    multiple: false
  });

  const handleTranscribe = async () => {
    if (!uploadedFile) return;

    onLoading(true);
    try {
      const result = await transcribeAudio(uploadedFile, settings);
      onTranscriptionComplete(result);
    } catch (error) {
      onError(error.message || 'Transcription failed. Please try again.');
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const isVideoFile = (file) => {
    return file && file.type.startsWith('video/');
  };

  const getFileIcon = (file) => {
    return isVideoFile(file) ? FileVideo : FileAudio;
  };

  return (
    <div className="file-upload-container">
      <div
        {...getRootProps()}
        className={`dropzone ${isDragActive ? 'active' : ''}`}
      >
        <input {...getInputProps()} />
        <Upload size={48} className="upload-icon" />
        <h3>
          {isDragActive ? 'Drop the file here' : 'Drag & drop audio or video file here'}
        </h3>
        <p>or click to select a file</p>
        <p className="file-types">
          Supported: MP3, WAV, M4A, OGG, FLAC, MP4, AVI, MOV, MKV (max 500MB)
        </p>
      </div>

      {fileError && (
        <div className="error-message">
          <AlertCircle size={20} />
          {fileError}
        </div>
      )}

      {uploadedFile && (
        <div className="uploaded-file">
          <div className="file-info">
            {React.createElement(getFileIcon(uploadedFile), { size: 24 })}
            <div>
              <strong>{uploadedFile.name}</strong>
              <p>{formatFileSize(uploadedFile.size)}</p>
            </div>
          </div>

          {isVideoFile(uploadedFile) ? (
            <video
              controls
              className="media-player"
              src={URL.createObjectURL(uploadedFile)}
              preload="metadata"
            >
              Your browser does not support the video element.
            </video>
          ) : (
            <audio
              controls
              className="media-player"
              src={URL.createObjectURL(uploadedFile)}
            >
              Your browser does not support the audio element.
            </audio>
          )}

          <button
            className="btn"
            onClick={handleTranscribe}
          >
            {React.createElement(getFileIcon(uploadedFile), { size: 20 })}
            {isVideoFile(uploadedFile) ? 'Transcribe Video' : 'Transcribe Audio'}
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
