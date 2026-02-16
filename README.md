<div align="center">

# VoxScribe — AI-Powered Audio & Video Transcription

### Transform speech into accurate text in 18+ languages with auto-generated captions

[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

<br />

[Live Demo](#demo) · [Features](#-features) · [Quick Start](#-quick-start) · [Tech Stack](#-tech-stack) · [Contributing](#-contributing)

<br />

<img src="https://img.shields.io/badge/18+-Languages_Supported-blue?style=flat-square" alt="Languages" />
<img src="https://img.shields.io/badge/WebVTT-SRT_Captions-green?style=flat-square" alt="Captions" />
<img src="https://img.shields.io/badge/Audio-Video_Support-orange?style=flat-square" alt="Media Support" />

</div>

---

## The Problem

Transcribing audio and video content manually is painfully slow — averaging **4x the audio duration** for a human transcriber. Existing tools are either too expensive, limited to English, or lack proper caption/subtitle export. Developers and content creators need a fast, multilingual, open-source solution.

## The Solution

**VoxScribe** is a modern, open-source transcription web app that converts audio and video files into accurate text using AI — supporting **18+ languages**, auto-generated **WebVTT/SRT captions**, and project-based organization. Upload a file, pick your language, and get results in seconds.

<br />

<div align="center">

<!-- Replace with actual screenshot -->
<!-- <img src="docs/screenshot.png" alt="VoxScribe Screenshot" width="800" /> -->

> **Add a screenshot:** Take a screenshot of your running app and save it as `docs/screenshot.png` to showcase VoxScribe here.

</div>

---

## ✦ Features

### Core Transcription
- **AI-Powered Transcription** — Upload audio or video and get accurate text output
- **18+ Languages** — English, Spanish, French, German, Italian, Portuguese, Russian, Japanese, Korean, Chinese, Arabic, Hindi, Urdu, Turkish, Dutch, Polish, Swedish, and more
- **Auto Language Detection** — Let the AI identify the spoken language automatically
- **Segment-Level Timestamps** — View transcription broken into timed segments with start/end markers

### Captions & Subtitles
- **Auto-Generated Captions** — Captions are created from transcription segments automatically
- **Embedded Video Captions** — Watch video with synced captions directly in the browser
- **WebVTT & SRT Export** — Download captions in industry-standard formats for YouTube, Premiere Pro, Final Cut, and more
- **Click-to-Seek** — Click any timestamp to jump to that point in the video

### Media Handling
- **Drag & Drop Upload** — Drag audio/video files directly into the browser
- **Video Preview** — Preview video files with embedded player before and after transcription
- **Audio & Video Support** — Works with MP3, WAV, MP4, and all common media formats

### Project Management
- **Organize into Projects** — Group related transcriptions into named projects
- **Persistent Storage** — Projects are saved locally and persist across browser sessions
- **Bulk Management** — Copy, download, or delete transcriptions individually or by project

### User Experience
- **Responsive Design** — Fully responsive across desktop, tablet, and mobile
- **Dark Mode** — Complete dark mode support with elegant color system
- **Custom Fonts** — Choose from 8 typography options (Inter, Montserrat, Poppins, and more)
- **Real-Time Feedback** — Processing animations and toast notifications keep you informed

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+
- **npm** or **yarn**
- A running transcription backend API (FastAPI-based — see [Backend Setup](#backend-setup))

### Installation

```bash
# Clone the repository
git clone https://github.com/SyedBahjat/voxscribe.git
cd voxscribe

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

### Configuration

Create a `.env` file in the project root:

```env
VITE_API_URL=http://localhost:8000
```

### Run Development Server

```bash
npm run dev
```

The app will start at **http://localhost:3000**.

### Build for Production

```bash
npm run build
npm run preview   # Preview the production build
```

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | React 18 with TypeScript |
| **Build Tool** | Vite 5 (SWC compiler) |
| **Styling** | Tailwind CSS 3 with custom design system |
| **UI Components** | shadcn/ui + Radix UI primitives |
| **State Management** | React Query (TanStack) |
| **Form Handling** | React Hook Form + Zod validation |
| **Icons** | Lucide React |
| **Routing** | React Router v6 |
| **Notifications** | Sonner toast library |

---

## 📂 Project Structure

```
voxscribe/
├── src/
│   ├── pages/
│   │   ├── Index.tsx                # Main application page
│   │   └── NotFound.tsx             # 404 page
│   ├── components/
│   │   ├── ui/                      # shadcn/ui components
│   │   ├── FileUpload.tsx           # Drag-and-drop file upload
│   │   ├── LanguageSelector.tsx     # Language pair selection
│   │   ├── TranscriptionResult.tsx  # Results display with captions
│   │   ├── VideoPreview.tsx         # Video player with captions
│   │   ├── ProcessingAnimation.tsx  # Loading animation
│   │   ├── ProjectDialog.tsx        # Add to project dialog
│   │   ├── ProjectsView.tsx         # Project management view
│   │   ├── FontSelector.tsx         # Typography selector
│   │   └── FeatureCard.tsx          # Feature showcase card
│   ├── hooks/
│   │   ├── use-mobile.tsx           # Mobile detection
│   │   └── use-toast.ts            # Toast notifications
│   ├── lib/
│   │   └── utils.ts                # WebVTT/SRT conversion utilities
│   ├── App.tsx                      # Root component with providers
│   ├── main.tsx                     # Entry point
│   └── index.css                    # Design system & Tailwind config
├── public/
│   └── manifest.json               # PWA manifest
├── vite.config.ts                   # Vite configuration with API proxy
├── tailwind.config.ts               # Tailwind theme customization
├── tsconfig.json                    # TypeScript configuration
└── package.json
```

---

## 🔌 API Integration

VoxScribe communicates with a backend transcription API.

### Endpoint

```
POST /transcribe
```

### Request

| Field | Type | Description |
|-------|------|-------------|
| `file` | `File` | Audio or video file (multipart/form-data) |
| `from_language` | `string` | Source language code or `"auto"` |
| `to_language` | `string` | Target language code |

### Response

```json
{
  "text": "Full transcription text...",
  "segments": [
    {
      "text": "Segment text",
      "start": 0.0,
      "end": 4.5
    }
  ]
}
```

### Backend Setup

The frontend expects a FastAPI backend running on port `8000`. You can use any Whisper-based transcription backend. Popular options:

- [faster-whisper](https://github.com/SYSTRAN/faster-whisper) — High-performance Whisper implementation
- [whisper.cpp](https://github.com/ggerganov/whisper.cpp) — C/C++ port for CPU inference
- [OpenAI Whisper](https://github.com/openai/whisper) — Original Whisper model

---

## 🌍 Supported Languages

| Language | Code | Language | Code |
|----------|------|----------|------|
| English | `en` | Japanese | `ja` |
| Spanish | `es` | Korean | `ko` |
| French | `fr` | Chinese | `zh` |
| German | `de` | Arabic | `ar` |
| Italian | `it` | Hindi | `hi` |
| Portuguese | `pt` | Urdu | `ur` |
| Russian | `ru` | Turkish | `tr` |
| Dutch | `nl` | Polish | `pl` |
| Swedish | `sv` | + Auto Detect | `auto` |

---

## 🤝 Contributing

Contributions are welcome and appreciated! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Ideas for Contribution

- [ ] Real-time / live audio recording & transcription
- [ ] Speaker diarization (identify different speakers)
- [ ] Batch file transcription
- [ ] Export to DOCX / PDF
- [ ] Waveform audio visualization
- [ ] Keyboard shortcuts for video playback
- [ ] Cloud storage integration (Google Drive, Dropbox)

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Muhammad Bahjat**

[![GitHub](https://img.shields.io/badge/GitHub-SyedBahjat-181717?style=for-the-badge&logo=github)](https://github.com/SyedBahjat)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Muhammad_Bahjat-0A66C2?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/muhammadbahjat/)

---

## ⭐ Support

If VoxScribe helped you, consider giving it a **star** — it helps others discover this project!

[![Star this repo](https://img.shields.io/github/stars/SyedBahjat/voxscribe?style=social)](https://github.com/SyedBahjat/voxscribe)

---

<div align="center">

**Built with React, TypeScript, and Tailwind CSS**

*Open source AI transcription for everyone*

</div>
