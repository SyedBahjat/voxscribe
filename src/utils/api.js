import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || '';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 300000, // 5 minutes timeout for large files
});

// Request interceptor to add loading states
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. The file might be too large or the server is taking too long to respond.');
    }
    
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const message = error.response.data?.detail || error.response.data?.message || 'Server error occurred';
      
      switch (status) {
        case 400:
          throw new Error('Invalid request. Please check your file and try again.');
        case 413:
          throw new Error('File too large. Please upload a smaller file.');
        case 415:
          throw new Error('Unsupported file type. Please upload an audio file.');
        case 500:
          throw new Error('Server error. Please try again later.');
        default:
          throw new Error(`Server error (${status}): ${message}`);
      }
    } else if (error.request) {
      // Network error
      throw new Error('Network error. Please check your connection and make sure the backend server is running.');
    } else {
      // Other error
      throw new Error(error.message || 'An unexpected error occurred.');
    }
  }
);

export const transcribeAudio = async (file, settings = {}) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('from_language', settings.from_language || 'auto');
    formData.append('to_language', settings.to_language || 'same');

    console.log('Uploading file:', file.name, 'Size:', file.size, 'bytes');
    console.log('Settings:', settings);

    const response = await api.post('/transcribe', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        console.log(`Upload progress: ${percentCompleted}%`);
      },
    });

    const result = {
      text: response.data.text,
      original_text: response.data.original_text || null,
      source_language: response.data.source_language || 'unknown',
      target_language: response.data.target_language || 'unknown',
      mode: response.data.mode || 'transcribe',
      timestamp: new Date().toISOString(),
    };

    console.log('Transcription completed:', result);
    return result;

  } catch (error) {
    console.error('Transcription error:', error);
    throw error;
  }
};

export const checkServerHealth = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    throw new Error('Backend server is not responding. Please make sure the server is running on port 8000.');
  }
};

export default api;

