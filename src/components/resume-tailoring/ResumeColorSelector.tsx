import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export type ResumeColorTheme = {
  id: string;
  name: string;
  headingColor: string;
  borderColor: string;
  accentColor: string;
  hexColor: string; // Add hex color for API
};

const colorThemes: ResumeColorTheme[] = [
  {
    id: "purple",
    name: "Purple",
    headingColor: "text-purple-800",
    borderColor: "border-purple-200",
    accentColor: "bg-purple-100 text-purple-800",
    hexColor: "#6B46C1", // purple-800
  },
  {
    id: "blue",
    name: "Blue",
    headingColor: "text-blue-800",
    borderColor: "border-blue-200",
    accentColor: "bg-blue-100 text-blue-800",
    hexColor: "#1E40AF", // blue-800
  },
  {
    id: "green",
    name: "Green",
    headingColor: "text-green-800",
    borderColor: "border-green-200",
    accentColor: "bg-green-100 text-green-800",
    hexColor: "#166534", // green-800
  },
  {
    id: "navy",
    name: "Navy",
    headingColor: "text-navy-800",
    borderColor: "border-navy-200",
    accentColor: "bg-navy-100 text-navy-800",
    hexColor: "#1E3A8A", // navy blue
  },
  {
    id: "gold",
    name: "Gold",
    headingColor: "text-gold-800",
    borderColor: "border-gold-200",
    accentColor: "bg-gold-100 text-gold-800",
    hexColor: "#B45309", // amber-700 (gold-like)
  },
  {
    id: "black",
    name: "Black",
    headingColor: "text-black",
    borderColor: "border-gray-400",
    accentColor: "bg-gray-800 text-white",
    hexColor: "#000000", // black
  },
];

interface ResumeColorSelectorProps {
  selectedTheme: string;
  onThemeChange: (themeId: string) => void;
  customColor?: string;
  onCustomColorChange?: (color: string) => void;
}

const ResumeColorSelector = ({
  selectedTheme,
  onThemeChange,
  customColor,
  onCustomColorChange,
}: ResumeColorSelectorProps) => {
  const [isCustomSelected, setIsCustomSelected] = useState(selectedTheme === "custom");

  const handlePresetSelect = (themeId: string) => {
    console.log('Preset color selected:', themeId);
    setIsCustomSelected(false);
    onThemeChange(themeId);
  };

  const handleCustomColorChange = (color: string) => {
    console.log('Custom color selected:', color);
    setIsCustomSelected(true);
    onThemeChange("custom");
    onCustomColorChange?.(color);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Resume Color Theme</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Preset Color Swatches */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Preset Colors</Label>
          <div className="flex flex-wrap gap-3">
            {colorThemes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => handlePresetSelect(theme.id)}
                className={cn(
                  "relative w-12 h-12 rounded-lg border-2 transition-all duration-200 hover:scale-105",
                  selectedTheme === theme.id && !isCustomSelected
                    ? "border-primary shadow-md scale-105"
                    : "border-gray-200 hover:border-gray-300"
                )}
                style={{ backgroundColor: theme.hexColor }}
                title={theme.name}
              >
                {selectedTheme === theme.id && !isCustomSelected && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full shadow-sm" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Color Picker */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Pick Your Own Color</Label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={customColor || "#6B46C1"}
              onChange={(e) => handleCustomColorChange(e.target.value)}
              className={cn(
                "w-12 h-12 rounded-lg border-2 cursor-pointer transition-all duration-200",
                isCustomSelected
                  ? "border-primary shadow-md scale-105"
                  : "border-gray-200 hover:border-gray-300"
              )}
              title="Custom Color"
            />
            <span className="text-sm text-muted-foreground">
              {isCustomSelected ? "Custom color selected" : "Click to choose a custom color"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResumeColorSelector;
export { colorThemes };