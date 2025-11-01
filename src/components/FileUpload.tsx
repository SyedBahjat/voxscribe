import { useCallback, useState } from "react";
import { Upload, File, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  onClearFile: () => void;
}

export const FileUpload = ({ onFileSelect, selectedFile, onClearFile }: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files && files[0]) {
        const file = files[0];
        if (file.type.startsWith("audio/") || file.type.startsWith("video/")) {
          onFileSelect(file);
        }
      }
    },
    [onFileSelect]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      onFileSelect(files[0]);
    }
  };

  return (
    <div className="w-full">
      {!selectedFile ? (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={cn(
            "relative border-2 border-dashed rounded-lg p-6 sm:p-8 md:p-12 transition-all duration-300",
            "hover:border-primary hover:shadow-elegant cursor-pointer",
            "bg-gradient-subtle",
            isDragging && "border-primary shadow-glow scale-[1.02]"
          )}
        >
          <input
            type="file"
            onChange={handleFileInput}
            accept="audio/*,video/*"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="flex flex-col items-center justify-center gap-4">
            <div className={cn(
              "p-4 sm:p-5 md:p-6 rounded-full bg-gradient-primary transition-transform duration-300",
              isDragging && "scale-110"
            )}>
              <Upload className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-primary-foreground" />
            </div>
            <div className="text-center">
              <p className="text-base sm:text-lg font-semibold text-foreground mb-2">
                Drop your audio or video file here
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground">
                or click to browse your files
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              Supports MP3, WAV, MP4, and more
            </p>
          </div>
        </div>
      ) : (
        <div className="border-2 border-border rounded-lg p-4 sm:p-6 bg-card animate-fade-in">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
              <div className="p-2 sm:p-3 rounded-lg bg-gradient-primary flex-shrink-0">
                <File className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-foreground truncate text-sm sm:text-base">{selectedFile.name}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
              onClick={onClearFile}
              className="p-2 hover:bg-secondary rounded-lg transition-colors flex-shrink-0"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
