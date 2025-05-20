
import jsPDF from "jspdf";
import { Profile } from "@/types/profile";
import { FONT_FAMILY, FONT_SIZES, LINE_HEIGHTS } from "@/utils/pdf/constants";

export interface PdfExportOptions {
  profile: Profile;
  jobTitle?: string;
  companyName?: string;
}

/**
 * Generates an ATS-friendly PDF file from the resume data
 * @param options The PDF export options
 * @returns A promise that resolves when the PDF is generated
 */
export const generatePdf = async (options: PdfExportOptions): Promise<void> => {
  const { profile, jobTitle, companyName } = options;
  
  try {
    // Create PDF with US Letter dimensions (8.5 x 11 inches)
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "in",
      format: "letter", // US Letter (8.5 x 11 inches)
    });
    
    // Set consistent margins
    const sideMargIn = 0.15;
    const topBottomMargIn = 0.075; // Half of the side margin

    // Set font for the entire document
    pdf.setFont("helvetica");
    
    // Current y position tracker
    let yPos = topBottomMargIn + 0.2;
    const leftMargin = sideMargIn;
    const pageWidth = 8.5 - (sideMargIn * 2);
    
    // Add header - Name
    pdf.setFontSize(18);
    pdf.setFont("helvetica", "bold");
    pdf.text(profile.personalInfo.name || "Resume", leftMargin, yPos);
    yPos += 0.3;
    
    // Add contact information
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    
    let contactInfo = "";
    if (profile.personalInfo.email) contactInfo += `Email: ${profile.personalInfo.email} `;
    if (profile.personalInfo.phone) contactInfo += `Phone: ${profile.personalInfo.phone} `;
    if (profile.personalInfo.website) contactInfo += `Website: ${profile.personalInfo.website} `;
    if (profile.personalInfo.location) contactInfo += `Location: ${profile.personalInfo.location}`;
    
    // Split the contact info into multiple lines if needed
    const splitContactInfo = pdf.splitTextToSize(contactInfo, pageWidth);
    pdf.text(splitContactInfo, leftMargin, yPos);
    yPos += (splitContactInfo.length * 0.15) + 0.2;
    
    // Add horizontal line
    pdf.setLineWidth(0.01);
    pdf.line(leftMargin, yPos, 8.5 - sideMargIn, yPos);
    yPos += 0.15;
    
    // Add summary if available
    if (profile.personalInfo.summary) {
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      pdf.text("Professional Summary", leftMargin, yPos);
      yPos += 0.2;
      
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      const splitSummary = pdf.splitTextToSize(profile.personalInfo.summary, pageWidth);
      pdf.text(splitSummary, leftMargin, yPos);
      yPos += (splitSummary.length * 0.15) + 0.2;
    }
    
    // Add experience section
    if (profile.experience && profile.experience.length > 0) {
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      pdf.text("Experience", leftMargin, yPos);
      yPos += 0.2;
      
      for (const exp of profile.experience) {
        pdf.setFontSize(11);
        pdf.setFont("helvetica", "bold");
        pdf.text(exp.title, leftMargin, yPos);
        
        // Company and dates on the same line, with dates right-aligned
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "normal");
        const dateText = `${formatDate(exp.startDate)} - ${exp.endDate ? formatDate(exp.endDate) : 'Present'}`;
        const dateWidth = pdf.getTextWidth(dateText);
        pdf.text(exp.company + (exp.location ? `, ${exp.location}` : ''), leftMargin, yPos + 0.15);
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
          if (yPos + (splitBullet.length * 0.15) > 11 - topBottomMargIn) {
            pdf.addPage();
            yPos = topBottomMargIn + 0.2;
          }
          
          pdf.text(splitBullet, leftMargin + 0.1, yPos);
          yPos += (splitBullet.length * 0.15) + 0.1;
        }
        
        yPos += 0.1;
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
      pdf.text("Education", leftMargin, yPos);
      yPos += 0.2;
      
      for (const edu of profile.education) {
        pdf.setFontSize(11);
        pdf.setFont("helvetica", "bold");
        pdf.text(`${edu.degree} in ${edu.field}`, leftMargin, yPos);
        
        // School and dates on the same line
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "normal");
        const dateText = `${formatDate(edu.startDate)} - ${edu.endDate ? formatDate(edu.endDate) : 'Present'}`;
        const dateWidth = pdf.getTextWidth(dateText);
        pdf.text(edu.school + ('location' in edu && edu.location ? `, ${edu.location}` : ''), leftMargin, yPos + 0.15);
        pdf.text(dateText, 8.5 - sideMargIn - dateWidth, yPos + 0.15);
        
        yPos += 0.3;
        
        if (edu.description) {
          pdf.setFontSize(9);
          const splitDesc = pdf.splitTextToSize(edu.description, pageWidth);
          pdf.text(splitDesc, leftMargin, yPos);
          yPos += (splitDesc.length * 0.15) + 0.1;
        }
        
        yPos += 0.1;
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
      pdf.text("Skills", leftMargin, yPos);
      yPos += 0.2;
      
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      
      // Group skills together as a comma-separated list
      const skillNames = profile.skills.map(skill => skill.name);
      const skillsText = skillNames.join(", ");
      
      const splitSkills = pdf.splitTextToSize(skillsText, pageWidth);
      pdf.text(splitSkills, leftMargin, yPos);
      yPos += (splitSkills.length * 0.15) + 0.2;
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
