import { Card } from "@/components/ui/card";
import { CheckCircle2, Copy, Download, FolderPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { ProjectDialog } from "./ProjectDialog";

interface TranscriptionResultProps {
  transcription: string;
  isVideo: boolean;
  videoUrl?: string;
}

export const TranscriptionResult = ({ transcription, isVideo, videoUrl }: TranscriptionResultProps) => {
  const [copied, setCopied] = useState(false);
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);

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
        <div className="mb-8 flex items-center gap-3 text-accent">
          <CheckCircle2 className="w-7 h-7" />
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">Transcription Complete!</h2>
        </div>
        
        <div className="grid lg:grid-cols-5 gap-6 lg:gap-8">
          {/* Transcription Text - Left (3/5 width) */}
          <Card className="lg:col-span-3 p-6 md:p-8 space-y-6 bg-card shadow-elegant border-2">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <h3 className="text-xl font-bold text-foreground">Transcription Text</h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  className="border-2 bg-background hover:bg-background hover:border-primary/70 hover:text-primary transition-all duration-200"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  {copied ? "Copied!" : "Copy"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownload}
                  className="border-2 bg-background hover:bg-background hover:border-primary/70 hover:text-primary transition-all duration-200"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsProjectDialogOpen(true)}
                  className="border-2 bg-background hover:bg-background hover:border-primary/70 hover:text-primary transition-all duration-200"
                >
                  <FolderPlus className="w-4 h-4 mr-2" />
                  Add to Project
                </Button>
              </div>
            </div>
            <div className="max-h-[600px] overflow-y-auto p-6 bg-gradient-subtle rounded-xl border-2 border-border">
              <p className="text-foreground whitespace-pre-wrap leading-loose text-base md:text-lg font-medium">
                {transcription}
              </p>
            </div>
          </Card>

          {/* Video - Right (2/5 width) */}
          <Card className="lg:col-span-2 p-6 md:p-8 space-y-6 bg-card shadow-elegant border-2 lg:sticky lg:top-24 lg:self-start">
            <h3 className="text-xl font-bold text-foreground">Video Preview</h3>
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
      <div className="mb-8 flex items-center gap-3 text-accent">
        <CheckCircle2 className="w-7 h-7" />
        <h2 className="text-3xl md:text-4xl font-bold text-foreground">Transcription Complete!</h2>
      </div>
      
      <Card className="p-6 md:p-8 space-y-6 bg-card shadow-elegant border-2">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h3 className="text-xl font-bold text-foreground">Transcription Text</h3>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="border-2 bg-background hover:bg-background hover:border-primary/70 hover:text-primary transition-all duration-200"
            >
              <Copy className="w-4 h-4 mr-2" />
              {copied ? "Copied!" : "Copy"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="border-2 bg-background hover:bg-background hover:border-primary/70 hover:text-primary transition-all duration-200"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsProjectDialogOpen(true)}
              className="border-2 bg-background hover:bg-background hover:border-primary/70 hover:text-primary transition-all duration-200"
            >
              <FolderPlus className="w-4 h-4 mr-2" />
              Add to Project
            </Button>
          </div>
        </div>
        <div className="p-6 md:p-8 bg-gradient-subtle rounded-xl border-2 border-border">
          <p className="text-foreground whitespace-pre-wrap leading-loose text-base md:text-lg font-medium">
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
