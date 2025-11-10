import { Card } from "@/components/ui/card";
import { CheckCircle2, Copy, Download, FolderPlus, Clock, List, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { ProjectDialog } from "./ProjectDialog";
import { FontSelector, type Font } from "./FontSelector";

export interface TranscriptionSegment {
  text: string;
  start: number;
  end: number;
  start_time: string;
  end_time: string;
}

interface TranscriptionResultProps {
  transcription: string;
  segments?: TranscriptionSegment[] | null;
  isVideo: boolean;
  videoUrl?: string;
}

const DEFAULT_FONT: Font = {
  id: "inter",
  name: "Inter",
  family: "Inter, sans-serif",
  preview: "Everyone has the right to freedom of thought, conscience and religion.",
};

export const TranscriptionResult = ({ transcription, segments, isVideo, videoUrl }: TranscriptionResultProps) => {
  const [copied, setCopied] = useState(false);
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
  const [selectedFont, setSelectedFont] = useState<Font>(DEFAULT_FONT);
  const [viewMode, setViewMode] = useState<"full" | "segments">("full");
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const hasSegments = segments && segments.length > 0;

  const handleCopy = () => {
    navigator.clipboard.writeText(transcription);
    setCopied(true);
    toast.success("Transcription copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopySegment = (segmentText: string) => {
    navigator.clipboard.writeText(segmentText);
    toast.success("Segment copied to clipboard!");
  };

  const handleSeekToTime = (startTime: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = startTime;
      videoRef.current.play().catch(() => {
        // Autoplay might be blocked, but seeking still works
      });
    }
    if (audioRef.current) {
      audioRef.current.currentTime = startTime;
      audioRef.current.play().catch(() => {
        // Autoplay might be blocked, but seeking still works
      });
    }
  };

  const handleDownload = () => {
    const blob = new Blob([transcription], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transcription.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Transcription downloaded!");
  };

  const renderSegmentsView = () => {
    if (!hasSegments) return null;

    return (
      <div className="space-y-3">
        {segments.map((segment, index) => (
          <Card key={index} className="p-4 bg-gradient-subtle border-2 border-border hover:border-primary/50 transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-start gap-3">
              <div className="flex-shrink-0 flex items-start gap-2">
                <button
                  onClick={() => handleSeekToTime(segment.start)}
                  className="text-sm font-mono text-primary hover:text-primary/80 transition-colors flex items-center gap-1 group"
                  title="Click to seek to this time"
                >
                  <Clock className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span className="font-semibold">{segment.start_time}</span>
                  <span className="text-muted-foreground">→</span>
                  <span className="font-semibold">{segment.end_time}</span>
                </button>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-foreground text-sm sm:text-base leading-relaxed" style={{ fontFamily: selectedFont.family }}>
                  {segment.text}
                </p>
              </div>
              <div className="flex-shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopySegment(segment.text)}
                  className="h-8 w-8 p-0"
                  title="Copy segment"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  };

  const renderFullTranscriptView = () => (
    <div className="max-h-[400px] sm:max-h-[500px] md:max-h-[600px] overflow-y-auto p-4 sm:p-6 bg-gradient-subtle rounded-xl border-2 border-border">
      <p
        className="text-foreground whitespace-pre-wrap leading-loose text-base md:text-lg font-medium"
        style={{ fontFamily: selectedFont.family }}
      >
        {transcription}
      </p>
    </div>
  );

  if (isVideo && videoUrl) {
    return (
      <div className="w-full animate-slide-up">
        <div className="mb-6 sm:mb-8 flex items-center gap-2 sm:gap-3 text-accent">
          <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">Transcription Complete!</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6 lg:gap-8">
          {/* Transcription Text - Left (3/5 width) */}
          <Card className="lg:col-span-3 p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6 bg-card shadow-elegant border-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h3 className="text-xl font-bold text-foreground">Transcription Text</h3>
              <div className="flex flex-wrap gap-2">
                {hasSegments && (
                  <div className="flex gap-1 border-2 border-border rounded-md p-1 bg-background">
                    <Button
                      variant={viewMode === "full" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("full")}
                      className="h-8 px-3"
                    >
                      <FileText className="w-4 h-4 mr-1" />
                      <span className="hidden sm:inline">Full</span>
                    </Button>
                    <Button
                      variant={viewMode === "segments" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("segments")}
                      className="h-8 px-3"
                    >
                      <List className="w-4 h-4 mr-1" />
                      <span className="hidden sm:inline">Segments</span>
                    </Button>
                  </div>
                )}
                {isVideo && (
                  <FontSelector
                    selectedFont={selectedFont}
                    onFontChange={setSelectedFont}
                  />
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  className="border-2 bg-background hover:bg-background hover:border-primary/70 hover:text-primary transition-all duration-200"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">{copied ? "Copied!" : "Copy"}</span>
                  <span className="sm:hidden">{copied ? "Copied!" : "Copy"}</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownload}
                  className="border-2 bg-background hover:bg-background hover:border-primary/70 hover:text-primary transition-all duration-200"
                >
                  <Download className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Download</span>
                  <span className="sm:hidden">DL</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsProjectDialogOpen(true)}
                  className="border-2 bg-background hover:bg-background hover:border-primary/70 hover:text-primary transition-all duration-200"
                >
                  <FolderPlus className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Add to Project</span>
                  <span className="sm:hidden">Project</span>
                </Button>
              </div>
            </div>
            {viewMode === "full" ? renderFullTranscriptView() : renderSegmentsView()}
          </Card>

          {/* Video - Right (2/5 width) */}
          <Card className="lg:col-span-2 p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6 bg-card shadow-elegant border-2 lg:sticky lg:top-20 lg:self-start order-first lg:order-last">
            <h3 className="text-lg sm:text-xl font-bold text-foreground">Video Preview</h3>
            <div className="relative rounded-xl overflow-hidden bg-gradient-subtle border-2 border-border aspect-video">
              <video
                ref={videoRef}
                src={videoUrl}
                controls
                className="w-full h-full object-contain"
              />
            </div>
          </Card>
        </div>
        
        <ProjectDialog
          open={isProjectDialogOpen}
          onOpenChange={setIsProjectDialogOpen}
          transcriptionText={transcription}
        />
      </div>
    );
  }

  // Audio transcription (full width)
  return (
    <div className="w-full animate-slide-up">
      <div className="mb-6 sm:mb-8 flex items-center gap-2 sm:gap-3 text-accent">
        <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">Transcription Complete!</h2>
      </div>
      
      <Card className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6 bg-card shadow-elegant border-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h3 className="text-lg sm:text-xl font-bold text-foreground">Transcription Text</h3>
          <div className="flex flex-wrap gap-2">
            {hasSegments && (
              <div className="flex gap-1 border-2 border-border rounded-md p-1 bg-background">
                <Button
                  variant={viewMode === "full" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("full")}
                  className="h-8 px-3"
                >
                  <FileText className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">Full</span>
                </Button>
                <Button
                  variant={viewMode === "segments" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("segments")}
                  className="h-8 px-3"
                >
                  <List className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">Segments</span>
                </Button>
              </div>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="border-2 bg-background hover:bg-background hover:border-primary/70 hover:text-primary transition-all duration-200"
            >
              <Copy className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">{copied ? "Copied!" : "Copy"}</span>
              <span className="sm:hidden">{copied ? "✓" : "Copy"}</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="border-2 bg-background hover:bg-background hover:border-primary/70 hover:text-primary transition-all duration-200"
            >
              <Download className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Download</span>
              <span className="sm:hidden">DL</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsProjectDialogOpen(true)}
              className="border-2 bg-background hover:bg-background hover:border-primary/70 hover:text-primary transition-all duration-200"
            >
              <FolderPlus className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Add to Project</span>
              <span className="sm:hidden">Project</span>
            </Button>
          </div>
        </div>
        {viewMode === "full" ? (
          <div className="p-4 sm:p-6 md:p-8 bg-gradient-subtle rounded-xl border-2 border-border">
            <p className="text-foreground whitespace-pre-wrap leading-loose text-sm sm:text-base md:text-lg font-medium">
              {transcription}
            </p>
          </div>
        ) : (
          <div className="max-h-[600px] overflow-y-auto">
            {renderSegmentsView()}
          </div>
        )}
      </Card>
      
      {/* Hidden audio element for seeking (if audio file is available) */}
      {!isVideo && hasSegments && (
        <audio ref={audioRef} className="hidden" />
      )}
      
      <ProjectDialog
        open={isProjectDialogOpen}
        onOpenChange={setIsProjectDialogOpen}
        transcriptionText={transcription}
      />
    </div>
  );
};
