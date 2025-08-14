
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

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
}

const ResumeColorSelector = ({
  selectedTheme,
  onThemeChange,
}: ResumeColorSelectorProps) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Resume Color Theme</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup
          defaultValue={selectedTheme}
          value={selectedTheme}
          onValueChange={onThemeChange}
          className="flex flex-wrap gap-4"
        >
          {colorThemes.map((theme) => (
            <div key={theme.id} className="flex items-center space-x-2">
              <RadioGroupItem value={theme.id} id={`theme-${theme.id}`} />
              <Label
                htmlFor={`theme-${theme.id}`}
                className="flex items-center cursor-pointer"
              >
                <span
                  className={`w-4 h-4 rounded-full mr-2 ${theme.accentColor.split(" ")[0]}`}
                />
                {theme.name}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
};

export default ResumeColorSelector;
export { colorThemes };
