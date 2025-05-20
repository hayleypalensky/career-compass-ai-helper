
import jsPDF from "jspdf";
import { Profile } from "@/types/profile";
import { FONT_FAMILY, FONT_SIZES, LINE_HEIGHTS, COLORS } from "@/utils/pdf/constants";
import { ResumeColorTheme, colorThemes } from "@/components/resume-tailoring/ResumeColorSelector";

export interface PdfExportOptions {
  profile: Profile;
  jobTitle?: string;
  companyName?: string;
  colorTheme?: string;
}

/**
 * Generates an ATS-friendly PDF file from the resume data
 * @param options The PDF export options
 * @returns A promise that resolves when the PDF is generated
 */
export const generatePdf = async (options: PdfExportOptions): Promise<void> => {
  const { profile, jobTitle, companyName, colorTheme = "purple" } = options;
  
  try {
    // Create PDF with US Letter dimensions (8.5 x 11 inches)
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "in",
      format: "letter", // US Letter (8.5 x 11 inches)
    });
    
    // Get selected color theme
    const theme = colorThemes.find(t => t.id === colorTheme) || colorThemes[0];
    
    // Convert theme colors to hex for PDF
    const themeColors = {
      heading: getHexColor(theme.headingColor),
      accent: getHexColor(theme.accentColor.split(' ')[0]),
      border: getHexColor(theme.borderColor)
    };
    
    // Set consistent margins
    const sideMargIn = 0.6;
    const topBottomMargIn = 0.5;

    // Set font for the entire document
    pdf.setFont("helvetica");
    
    // Current y position tracker
    let yPos = topBottomMargIn;
    const leftMargin = sideMargIn;
    const pageWidth = 8.5 - (sideMargIn * 2);
    
    // Add header - Name with theme color
    pdf.setFontSize(20);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(themeColors.heading);
    pdf.text(profile.personalInfo.name || "Resume", leftMargin, yPos);
    yPos += 0.25;
    
    // Add horizontal line with theme color
    pdf.setDrawColor(themeColors.border);
    pdf.setLineWidth(0.01);
    pdf.line(leftMargin, yPos, 8.5 - sideMargIn, yPos);
    yPos += 0.2;
    
    // Add contact information in a professional layout
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(COLORS.black);
    
    const contactItems = [];
    if (profile.personalInfo.email) contactItems.push(`Email: ${profile.personalInfo.email}`);
    if (profile.personalInfo.phone) contactItems.push(`Phone: ${profile.personalInfo.phone}`);
    if (profile.personalInfo.website) contactItems.push(`Website: ${profile.personalInfo.website}`);
    if (profile.personalInfo.location) contactItems.push(`Location: ${profile.personalInfo.location}`);
    
    // Create a nicely formatted contact row
    const contactText = contactItems.join(" | ");
    const splitContactInfo = pdf.splitTextToSize(contactText, pageWidth);
    pdf.text(splitContactInfo, leftMargin, yPos);
    yPos += (splitContactInfo.length * 0.15) + 0.25;
    
    // Add summary if available
    if (profile.personalInfo.summary) {
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(themeColors.heading);
      pdf.text("Professional Summary", leftMargin, yPos);
      yPos += 0.2;
      
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(COLORS.black);
      const splitSummary = pdf.splitTextToSize(profile.personalInfo.summary, pageWidth);
      pdf.text(splitSummary, leftMargin, yPos);
      yPos += (splitSummary.length * 0.15) + 0.3;
    }
    
    // Add experience section
    if (profile.experiences && profile.experiences.length > 0) {
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(themeColors.heading);
      pdf.text("Experience", leftMargin, yPos);
      yPos += 0.15;
      
      // Add a thin line under the section header
      pdf.setDrawColor(themeColors.border);
      pdf.setLineWidth(0.005);
      pdf.line(leftMargin, yPos, 8.5 - sideMargIn, yPos);
      yPos += 0.15;
      
      for (const exp of profile.experiences) {
        // Check if we need to add a new page
        if (yPos > 10 - topBottomMargIn) {
          pdf.addPage();
          yPos = topBottomMargIn + 0.2;
        }
        
        pdf.setFontSize(11);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(COLORS.black);
        pdf.text(exp.title, leftMargin, yPos);
        
        // Company and dates on the same line, with dates right-aligned
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "normal");
        const dateText = `${formatDate(exp.startDate)} - ${exp.endDate ? formatDate(exp.endDate) : 'Present'}`;
        const dateWidth = pdf.getTextWidth(dateText);
        
        // Set company name in a slightly highlighted color
        pdf.setTextColor(themeColors.heading);
        pdf.text(exp.company + (exp.location ? `, ${exp.location}` : ''), leftMargin, yPos + 0.15);
        
        // Set date in regular black
        pdf.setTextColor(COLORS.black);
        pdf.text(dateText, 8.5 - sideMargIn - dateWidth, yPos + 0.15);
        
        yPos += 0.3;
        
        // Add bullet points
        pdf.setFontSize(9);
        const bulletPoints = exp.bullets.filter(bullet => bullet.trim() !== "");
        for (const bullet of bulletPoints) {
          // Handle bullet points that may need multiple lines
          const bulletText = "• " + bullet;
          const splitBullet = pdf.splitTextToSize(bulletText, pageWidth - 0.1);
          
          // Check if we need to add a new page
          if (yPos + (splitBullet.length * 0.15) > 10.5 - topBottomMargIn) {
            pdf.addPage();
            yPos = topBottomMargIn + 0.2;
          }
          
          pdf.text(splitBullet, leftMargin + 0.1, yPos);
          yPos += (splitBullet.length * 0.15) + 0.08;
        }
        
        yPos += 0.15;
      }
    }
    
    // Check if we need a new page before education
    if (yPos > 9) {
      pdf.addPage();
      yPos = topBottomMargIn + 0.2;
    }
    
    // Add education section
    if (profile.education && profile.education.length > 0) {
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(themeColors.heading);
      pdf.text("Education", leftMargin, yPos);
      yPos += 0.15;
      
      // Add a thin line under the section header
      pdf.setDrawColor(themeColors.border);
      pdf.setLineWidth(0.005);
      pdf.line(leftMargin, yPos, 8.5 - sideMargIn, yPos);
      yPos += 0.15;
      
      for (const edu of profile.education) {
        pdf.setFontSize(11);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(COLORS.black);
        pdf.text(`${edu.degree} in ${edu.field}`, leftMargin, yPos);
        
        // School and dates on the same line
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "normal");
        const dateText = `${formatDate(edu.startDate)} - ${edu.endDate ? formatDate(edu.endDate) : 'Present'}`;
        const dateWidth = pdf.getTextWidth(dateText);
        
        // Set school name in a slightly highlighted color
        pdf.setTextColor(themeColors.heading);
        pdf.text(edu.school + ('location' in edu && edu.location ? `, ${edu.location}` : ''), leftMargin, yPos + 0.15);
        
        // Set date in regular black
        pdf.setTextColor(COLORS.black);
        pdf.text(dateText, 8.5 - sideMargIn - dateWidth, yPos + 0.15);
        
        yPos += 0.3;
        
        if (edu.description) {
          pdf.setFontSize(9);
          const splitDesc = pdf.splitTextToSize(edu.description, pageWidth);
          pdf.text(splitDesc, leftMargin, yPos);
          yPos += (splitDesc.length * 0.15) + 0.1;
        }
        
        yPos += 0.15;
      }
    }
    
    // Check if we need a new page before skills
    if (yPos > 9.5) {
      pdf.addPage();
      yPos = topBottomMargIn + 0.2;
    }
    
    // Add skills section
    if (profile.skills && profile.skills.length > 0) {
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(themeColors.heading);
      pdf.text("Skills", leftMargin, yPos);
      yPos += 0.15;
      
      // Add a thin line under the section header
      pdf.setDrawColor(themeColors.border);
      pdf.setLineWidth(0.005);
      pdf.line(leftMargin, yPos, 8.5 - sideMargIn, yPos);
      yPos += 0.2;
      
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(COLORS.black);
      
      // Group skills by category
      const skillsByCategory: Record<string, string[]> = {};
      profile.skills.forEach(skill => {
        if (!skillsByCategory[skill.category]) {
          skillsByCategory[skill.category] = [];
        }
        skillsByCategory[skill.category].push(skill.name);
      });
      
      // Display skills by category
      Object.entries(skillsByCategory).forEach(([category, skills], index) => {
        if (index > 0) yPos += 0.1;
        
        // Display category name in theme color
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(themeColors.heading);
        pdf.text(category + ":", leftMargin, yPos);
        
        // Calculate x position after category name
        const categoryWidth = pdf.getTextWidth(category + ": ");
        
        // Reset text color for skills
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(COLORS.black);
        
        // Join skills with commas
        const skillsText = skills.join(", ");
        const splitSkills = pdf.splitTextToSize(skillsText, pageWidth - categoryWidth - 0.1);
        
        // First line starts after category
        pdf.text(splitSkills[0], leftMargin + categoryWidth, yPos);
        
        // Subsequent lines start at left margin with proper indentation
        if (splitSkills.length > 1) {
          for (let i = 1; i < splitSkills.length; i++) {
            yPos += 0.15;
            pdf.text(splitSkills[i], leftMargin + 0.3, yPos);
          }
        }
        
        yPos += 0.2;
      });
    }
    
    // Add footer with page numbers
    const totalPages = pdf.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.setTextColor(COLORS.black);
      pdf.text(
        `Page ${i} of ${totalPages}`, 
        8.5 - sideMargIn - 1, 
        11 - 0.2
      );
    }
    
    // Set PDF metadata
    pdf.setProperties({
      title: `ATS-Friendly Resume for ${profile.personalInfo.name || 'Candidate'}`,
      subject: `Tailored resume for ${jobTitle || 'position'} at ${companyName || 'company'}`,
      creator: 'Resume Builder',
      keywords: 'resume, ats-friendly, job application'
    });
    
    // Generate filename with job info if available
    const filenameParts = ["ats_friendly_resume"];
    if (companyName) filenameParts.push(companyName.toLowerCase().replace(/\s+/g, "_"));
    if (jobTitle) filenameParts.push(jobTitle.toLowerCase().replace(/\s+/g, "_"));
    
    pdf.save(`${filenameParts.join("_")}.pdf`);
    
    return Promise.resolve();
  } catch (error) {
    console.error("PDF generation error:", error);
    return Promise.reject(error);
  }
};

/**
 * Helper function to format dates for the resume
 */
const formatDate = (dateString: string): string => {
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
const getHexColor = (tailwindClass: string): string => {
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
