import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Font {
  id: string;
  name: string;
  family: string;
  preview: string;
}

const FONTS: Font[] = [
  {
    id: "inter",
    name: "Inter",
    family: "Inter, sans-serif",
    preview: "Everyone has the right to freedom of thought, conscience and religion.",
  },
  {
    id: "montserrat",
    name: "Montserrat",
    family: "Montserrat, sans-serif",
    preview: "Everyone has the right to freedom of thought, conscience and religion.",
  },
  {
    id: "roboto",
    name: "Roboto",
    family: "Roboto, sans-serif",
    preview: "Everyone has the right to freedom of thought, conscience and religion.",
  },
  {
    id: "opensans",
    name: "Open Sans",
    family: "Open Sans, sans-serif",
    preview: "Everyone has the right to freedom of thought, conscience and religion.",
  },
  {
    id: "lato",
    name: "Lato",
    family: "Lato, sans-serif",
    preview: "Everyone has the right to freedom of thought, conscience and religion.",
  },
  {
    id: "poppins",
    name: "Poppins",
    family: "Poppins, sans-serif",
    preview: "Everyone has the right to freedom of thought, conscience and religion.",
  },
  {
    id: "raleway",
    name: "Raleway",
    family: "Raleway, sans-serif",
    preview: "Everyone has the right to freedom of thought, conscience and religion.",
  },
  {
    id: "nunito",
    name: "Nunito",
    family: "Nunito, sans-serif",
    preview: "Everyone has the right to freedom of thought, conscience and religion.",
  },
];

interface FontSelectorProps {
  selectedFont: Font;
  onFontChange: (font: Font) => void;
}

export const FontSelector = ({ selectedFont, onFontChange }: FontSelectorProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="border-2 bg-background hover:bg-background hover:border-primary/70 hover:text-primary transition-all duration-200"
        >
          <span className="hidden sm:inline">Font: </span>
          <span className="sm:ml-1">{selectedFont.name}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[90vw] sm:w-[400px] max-w-[400px] p-0" align="start">
        <div className="max-h-[500px] overflow-y-auto">
          <div className="p-4 border-b">
            <h3 className="font-semibold text-sm">Select Font</h3>
            <p className="text-xs text-muted-foreground mt-1">Choose a font style for your transcription</p>
          </div>
          <div className="divide-y">
            {FONTS.map((font) => (
              <button
                key={font.id}
                onClick={() => {
                  onFontChange(font);
                  setOpen(false);
                }}
                className={cn(
                  "w-full text-left p-4 hover:bg-muted/50 transition-colors",
                  selectedFont.id === font.id && "bg-primary/5"
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-sm">{font.name}</span>
                  {selectedFont.id === font.id && (
                    <Check className="w-4 h-4 text-primary" />
                  )}
                </div>
                <div
                  className="text-base sm:text-lg text-foreground leading-relaxed"
                  style={{ fontFamily: font.family }}
                >
                  {font.preview}
                </div>
              </button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
