
import { colorThemes } from "@/components/resume-tailoring/ResumeColorSelector";

/**
 * Helper function to format dates for the resume
 */
export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  } catch (e) {
    return dateString;
  }
};

/**
 * Helper function to convert Tailwind classes to hex color values
 */
export const getHexColor = (tailwindClass: string): string => {
  // Extract color from Tailwind class (e.g., "text-purple-800" => "#5521B5")
  const colorMap: Record<string, string> = {
    // Purple theme
    "text-purple-800": "#5521B5",
    "border-purple-200": "#E9D5FF",
    "bg-purple-100": "#F3E8FF",
    
    // Blue theme
    "text-blue-800": "#1E40AF",
    "border-blue-200": "#BFDBFE",
    "bg-blue-100": "#DBEAFE",
    
    // Green theme
    "text-green-800": "#166534",
    "border-green-200": "#BBFFD0",
    "bg-green-100": "#DCFCE7",
    
    // Navy theme
    "text-navy-800": "#1E3A8A",
    "border-navy-200": "#BFC7FF",
    "bg-navy-100": "#DBE4FF",
    
    // Gold theme
    "text-gold-800": "#854D0E",
    "border-gold-200": "#FEF08A",
    "bg-gold-100": "#FEF9C3",
    
    // Black theme
    "text-black": "#000000",
    "border-gray-400": "#9CA3AF",
    "bg-gray-800": "#1F2937"
  };
  
  return colorMap[tailwindClass] || "#000000";
};

/**
 * Gets the selected color theme
 */
export const getSelectedTheme = (colorTheme: string = "purple") => {
  const theme = colorThemes.find(t => t.id === colorTheme) || colorThemes[0];
  
  // Convert theme colors to hex for PDF
  return {
    heading: getHexColor(theme.headingColor),
    accent: getHexColor(theme.accentColor.split(' ')[0]),
    border: getHexColor(theme.borderColor)
  };
};
