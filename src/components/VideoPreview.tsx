import { Card } from "@/components/ui/card";
import { Video } from "lucide-react";

interface VideoPreviewProps {
  file: File;
}

export const VideoPreview = ({ file }: VideoPreviewProps) => {
  const videoUrl = URL.createObjectURL(file);

  return (
    <Card className="p-4 sm:p-6 space-y-3 sm:space-y-4 bg-card shadow-elegant animate-fade-in">
      <div className="flex items-center gap-2">
        <Video className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
        <h3 className="font-semibold text-foreground text-sm sm:text-base">Video Preview</h3>
      </div>
      <div className="relative rounded-lg overflow-hidden bg-gradient-subtle aspect-video">
        <video
          src={videoUrl}
          controls
          className="w-full h-full object-contain"
        />
      </div>
    </Card>
  );
};
