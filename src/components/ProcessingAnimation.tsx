import { Loader2, Radio } from "lucide-react";

export const ProcessingAnimation = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 animate-fade-in">
      <div className="relative">
        <div className="absolute inset-0 animate-pulse-glow">
          <div className="w-24 h-24 rounded-full bg-gradient-primary opacity-20 blur-xl" />
        </div>
        <div className="relative p-6 rounded-full bg-gradient-primary shadow-glow">
          <Loader2 className="w-12 h-12 text-primary-foreground animate-spin" />
        </div>
      </div>
      
      <div className="mt-8 text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Radio className="w-5 h-5 text-primary animate-pulse" />
          <h3 className="text-xl font-semibold text-foreground">Processing Your File</h3>
        </div>
        <p className="text-muted-foreground">
          This may take a few moments depending on file size...
        </p>
      </div>

      <div className="mt-6 flex gap-2">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-primary animate-pulse"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    </div>
  );
};
