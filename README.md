# Audio Transcribe Frontend

A modern React-based frontend for the Audio Transcription Application. This frontend provides a beautiful, responsive interface for uploading audio files, recording live audio, and viewing transcription results.

## Features

- 🎵 **File Upload**: Drag & drop or click to upload audio files (MP3, WAV, M4A, OGG, FLAC)
- 🎤 **Live Recording**: Record audio directly in the browser with pause/resume functionality
- 🌍 **Multi-language Support**: Auto-detect or manually select from 90+ languages
- 🔄 **Translation Mode**: Transcribe in original language or translate to English
- 📱 **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- ⚡ **Real-time Feedback**: Progress indicators and status updates
- 📋 **Copy to Clipboard**: Easy copying of transcription results
- 💾 **Download Results**: Save transcriptions as text files

## Prerequisites

- Node.js (version 14 or higher)
- npm or yarn
- The FastAPI backend server running on port 8080

## Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file (optional):
   ```bash
   VITE_API_URL=http://localhost:8080
   ```

## Running the Application

1. Make sure the FastAPI backend is running:
   ```bash
   # In the main project directory
   python app.py
   ```

2. Start the React development server:
   ```bash
   npm start
   ```

3. Open your browser and navigate to `http://localhost:3000`

## Building for Production

To create a production build:

```bash
npm run build
```

This will create a `build` folder with optimized files ready for deployment.

## Project Structure

```
frontend/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── AudioRecorder.js      # Live audio recording component
│   │   ├── FileUpload.js         # File upload with drag & drop
│   │   ├── SettingsPanel.js      # Language and processing settings
│   │   ├── TranscriptionResult.js # Display transcription results
│   │   └── FileUpload.css        # Component-specific styles
│   ├── hooks/
│   │   └── useAudioRecorder.js   # Custom hook for audio recording
│   ├── utils/
│   │   └── api.js               # API integration with FastAPI backend
│   ├── App.js                   # Main application component
│   ├── App.css                  # Main application styles
│   ├── index.js                 # Application entry point
│   └── index.css                # Global styles
├── package.json
└── README.md
```

## API Integration

The frontend communicates with the FastAPI backend through the `/transcribe` endpoint:

- **Endpoint**: `POST /transcribe`
- **Parameters**:
  - `file`: Audio file (multipart/form-data)
  - `language`: Language code or "auto" for auto-detection
  - `task`: "transcribe" or "translate"

## Supported File Formats

- MP3
- WAV
- M4A
- OGG
- FLAC

**Maximum file size**: 500MB

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

## Development

### Available Scripts

- `npm i`: Install the necessary dependencies.
- `npm run dev`: Start the development server with auto-reloading and an instant preview.
- `npm build`: Build the project.

### Environment Variables

- `VITE_API_URL`: Backend API URL (default: http://localhost:8080)

## Troubleshooting

### Common Issues

1. **"Network error" or "Backend server is not responding"**
   - Make sure the FastAPI backend is running on port 8080
   - Check if there are any firewall restrictions

2. **Microphone access denied**
   - Ensure your browser has permission to access the microphone
   - Try refreshing the page and granting permission again

3. **File upload fails**
   - Check file size (must be under 500MB)
   - Ensure file format is supported
   - Verify network connection

4. **Transcription takes too long**
   - Large files take longer to process
   - Check server resources and network speed
   - Consider using smaller audio files for testing

### Performance Tips

- Use shorter audio files for faster processing
- Clear audio without background noise works best
- Auto-detect language is usually most accurate
- Translation mode may take slightly longer than transcription

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is part of the Audio Transcription Application. Please refer to the main project for licensing information.

# frontend-transcription
