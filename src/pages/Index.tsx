import { useState } from "react";
import { FileUpload } from "@/components/FileUpload";
import { LanguageSelector } from "@/components/LanguageSelector";
import { ProcessingAnimation } from "@/components/ProcessingAnimation";
import { TranscriptionResult } from "@/components/TranscriptionResult";
import { VideoPreview } from "@/components/VideoPreview";
import { FeatureCard } from "@/components/FeatureCard";
import { ProjectsView } from "@/components/ProjectsView";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mic, Video, Globe, Zap, Shield, Clock, FolderOpen } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fromLanguage, setFromLanguage] = useState("auto");
  const [toLanguage, setToLanguage] = useState("en");
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcription, setTranscription] = useState<string | null>(null);
  const [segments, setSegments] = useState<Array<{
    text: string;
    start: number;
    end: number;
    start_time: string;
    end_time: string;
  }> | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isProjectsViewOpen, setIsProjectsViewOpen] = useState(false);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setTranscription(null);
    setSegments(null);
    setVideoUrl(null);
  };

  const handleClearFile = () => {
    setSelectedFile(null);
    setTranscription(null);
    setSegments(null);
    setVideoUrl(null);
  };

  const handleTranscribe = async () => {
    if (!selectedFile) {
      toast.error("Please select a file first");
      return;
    }

    setIsProcessing(true);
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("from_language", fromLanguage);
    formData.append("to_language", toLanguage);

    try {
      const API_URL = import.meta.env.VITE_API_URL || "";
      
      if (!API_URL) {
        toast.error("API URL not configured. Please set VITE_API_URL in your .env file.");
        setIsProcessing(false);
        return;
      }

      const response = await fetch(`${API_URL}/transcribe`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: "Transcription failed" }));
        const errorMsg = errorData.detail || errorData.message || `Transcription failed (${response.status})`;
        throw new Error(errorMsg);
      }

      const data = await response.json();
      // Handle both response formats: {text: ...} and {transcription: ...}
      const transcriptionText = data.text || data.transcription || "Transcription completed successfully!";
      setTranscription(transcriptionText);
      
      // Capture segments if available
      if (data.segments && Array.isArray(data.segments) && data.segments.length > 0) {
        setSegments(data.segments);
      } else {
        setSegments(null);
      }
      
      if (selectedFile.type.startsWith("video/")) {
        setVideoUrl(URL.createObjectURL(selectedFile));
      }
      
      toast.success("Transcription completed!");
    } catch (error) {
      let errorMessage = "Failed to transcribe. ";
      
      if (error instanceof TypeError && error.message.includes("fetch")) {
        errorMessage += "Cannot connect to the server. Please check if the backend is running and VITE_API_URL is correct.";
      } else if (error instanceof Error) {
        errorMessage += error.message;
      } else {
        errorMessage += "Please check if the server is running.";
      }
      
      toast.error(errorMessage);
      console.error("Transcription error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const isVideo = selectedFile?.type.startsWith("video/");

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
            <div className="flex items-center justify-between gap-2 sm:gap-4">
              <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                <div className="p-1.5 sm:p-2 rounded-lg bg-gradient-primary shadow-glow flex-shrink-0">
                  <Mic className="w-4 h-4 sm:w-6 sm:h-6 text-primary-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-base sm:text-xl md:text-2xl font-bold text-foreground truncate">AI Transcription Studio</h1>
                  <p className="text-xs text-muted-foreground hidden sm:block">Professional Transcription Service</p>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => setIsProjectsViewOpen(true)}
                className="border-2 bg-background hover:bg-background hover:border-primary/70 hover:text-primary transition-all duration-200 flex-shrink-0 text-xs sm:text-sm"
              >
                <FolderOpen className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                <span className="hidden sm:inline">View Projects</span>
              </Button>
            </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:py-12">
        {!transcription ? (
          <div className="space-y-16">
            {/* Hero Section */}
            <div className="max-w-4xl mx-auto text-center animate-fade-in">
              <div className="inline-block px-3 sm:px-4 py-2 mb-4 sm:mb-6 bg-primary/10 border border-primary/20 rounded-full">
                <span className="text-xs sm:text-sm font-medium text-primary">AI-Powered Transcription</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground mb-4 sm:mb-6 leading-tight px-2">
                Transform Audio & Video
                <br />
                <span className="bg-gradient-primary bg-clip-text text-transparent">into Accurate Text</span>
              </h2>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto mb-6 sm:mb-8 px-2">
                Upload your audio or video files and get professional-grade transcriptions in 18+ languages.
                Fast, accurate, and secure.
              </p>
            </div>

            {/* Features Grid */}
            <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 animate-slide-up">
              <FeatureCard
                icon={Globe}
                title="18+ Languages"
                description="Support for major world languages including English, Urdu, Arabic, and more"
              />
              <FeatureCard
                icon={Zap}
                title="Lightning Fast"
                description="Advanced AI delivers accurate transcriptions in minutes, not hours"
              />
              <FeatureCard
                icon={Shield}
                title="Secure & Private"
                description="Your files are processed securely and never stored permanently"
              />
              <FeatureCard
                icon={Clock}
                title="24/7 Available"
                description="Access our transcription service anytime, from anywhere"
              />
            </div>

            {/* Upload Section */}
            <div className="max-w-5xl mx-auto">
              <Card className="p-4 sm:p-6 md:p-10 shadow-elegant bg-card border-2">
                <div className="space-y-8">
                  {/* File Upload */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      {isVideo ? (
                        <Video className="w-5 h-5 text-primary" />
                      ) : (
                        <Mic className="w-5 h-5 text-primary" />
                      )}
                      <h3 className="font-semibold text-foreground text-lg">Upload Your File</h3>
                    </div>
                    <FileUpload
                      onFileSelect={handleFileSelect}
                      selectedFile={selectedFile}
                      onClearFile={handleClearFile}
                    />
                  </div>

                  {/* Video Preview */}
                  {selectedFile && isVideo && (
                    <VideoPreview file={selectedFile} />
                  )}

                  {/* Language Selector */}
                  {selectedFile && (
                    <LanguageSelector
                      fromLanguage={fromLanguage}
                      toLanguage={toLanguage}
                      onFromLanguageChange={setFromLanguage}
                      onToLanguageChange={setToLanguage}
                    />
                  )}

                  {/* Transcribe Button */}
                  {selectedFile && !isProcessing && (
                    <Button
                      onClick={handleTranscribe}
                      className="w-full h-14 text-lg font-semibold bg-gradient-primary hover:opacity-90 transition-all shadow-elegant hover:shadow-glow"
                    >
                      Start Transcription
                    </Button>
                  )}

                  {/* Processing Animation */}
                  {isProcessing && <ProcessingAnimation />}
                </div>
              </Card>
            </div>

            {/* Trust Section */}
            <div className="max-w-4xl mx-auto text-center animate-fade-in">
              <p className="text-sm text-muted-foreground mb-4">Trusted by professionals worldwide</p>
              <div className="flex flex-wrap justify-center gap-8 items-center opacity-60">
                <div className="text-2xl font-bold text-foreground">1000+ Users</div>
                <div className="w-px h-8 bg-border"></div>
                <div className="text-2xl font-bold text-foreground">50+ Languages</div>
                <div className="w-px h-8 bg-border"></div>
                <div className="text-2xl font-bold text-foreground">99.9% Uptime</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto">
            <TranscriptionResult
              transcription={transcription}
              segments={segments}
              isVideo={!!isVideo}
              videoUrl={videoUrl || undefined}
            />
            
            <div className="mt-8 flex justify-center gap-4">
              <Button
                onClick={() => {
                  setSelectedFile(null);
                  setTranscription(null);
                  setSegments(null);
                  setVideoUrl(null);
                }}
                variant="outline"
                className="border-2 bg-background hover:bg-background hover:border-primary/70 hover:text-primary transition-all duration-200"
              >
                Transcribe Another File
              </Button>
            </div>
          </div>
        )}
      </main>
      
      <ProjectsView
        open={isProjectsViewOpen}
        onOpenChange={setIsProjectsViewOpen}
      />
    </div>
  );
};

export default Index;
