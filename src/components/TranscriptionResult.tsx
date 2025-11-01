import { Card } from "@/components/ui/card";
import { CheckCircle2, Copy, Download, FolderPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { ProjectDialog } from "./ProjectDialog";
import { FontSelector, type Font } from "./FontSelector";

interface TranscriptionResultProps {
  transcription: string;
  isVideo: boolean;
  videoUrl?: string;
}

const DEFAULT_FONT: Font = {
  id: "inter",
  name: "Inter",
  family: "Inter, sans-serif",
  preview: "Everyone has the right to freedom of thought, conscience and religion.",
};

export const TranscriptionResult = ({ transcription, isVideo, videoUrl }: TranscriptionResultProps) => {
  const [copied, setCopied] = useState(false);
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
  const [selectedFont, setSelectedFont] = useState<Font>(DEFAULT_FONT);

  const handleCopy = () => {
    navigator.clipboard.writeText(transcription);
    setCopied(true);
    toast.success("Transcription copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
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
            <div className="max-h-[400px] sm:max-h-[500px] md:max-h-[600px] overflow-y-auto p-4 sm:p-6 bg-gradient-subtle rounded-xl border-2 border-border">
              <p
                className="text-foreground whitespace-pre-wrap leading-loose text-base md:text-lg font-medium"
                style={{ fontFamily: selectedFont.family }}
              >
                {transcription}
              </p>
            </div>
          </Card>

          {/* Video - Right (2/5 width) */}
          <Card className="lg:col-span-2 p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6 bg-card shadow-elegant border-2 lg:sticky lg:top-20 lg:self-start order-first lg:order-last">
            <h3 className="text-lg sm:text-xl font-bold text-foreground">Video Preview</h3>
            <div className="relative rounded-xl overflow-hidden bg-gradient-subtle border-2 border-border aspect-video">
              <video
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
        <div className="p-4 sm:p-6 md:p-8 bg-gradient-subtle rounded-xl border-2 border-border">
          <p className="text-foreground whitespace-pre-wrap leading-loose text-sm sm:text-base md:text-lg font-medium">
            {transcription}
          </p>
        </div>
      </Card>
      
      <ProjectDialog
        open={isProjectDialogOpen}
        onOpenChange={setIsProjectDialogOpen}
        transcriptionText={transcription}
      />
    </div>
  );
};
