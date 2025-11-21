import { Profile } from "@/types/profile";
import { Experience } from "@/components/ExperienceForm";
import { formatDate } from "@/utils/resumeFormatters";
import { supabase } from "@/integrations/supabase/client";
import { colorThemes } from "@/components/resume-tailoring/ResumeColorSelector";

/**
 * Sanitize text to replace Unicode characters that cause Latin-1 encoding issues in PDF generation
 */
const sanitizeText = (text: string): string => {
  if (!text) return text;
  return text
    .replace(/[\u2018\u2019]/g, "'")  // Smart single quotes to straight quote
    .replace(/[\u201C\u201D]/g, '"')  // Smart double quotes to straight quote
    .replace(/\u2013/g, '-')          // En dash to hyphen
    .replace(/\u2014/g, '--')         // Em dash to double hyphen
    .replace(/\u2026/g, '...')        // Ellipsis to three dots
    .replace(/[\u2000-\u200B]/g, ' ') // Various spaces to regular space
    .replace(/[^\x00-\xFF]/g, '');    // Remove any remaining non-Latin-1 chars
};

interface ResumeApiData {
  name: string;
  email: string;
  phone?: string;
  website?: string;
  summary: string;
  education: Array<{
    degree: string;
    school: string;
    location_dates: string;
  }>;
  experience: Array<{
    job_title: string;
    company: string;
    location_dates: string;
    bullet_points: string[];
  }>;
  skills: string;
  header_color?: string; // Add header color field
}

export const transformProfileForApi = (
  profile: Profile,
  tailoredExperiences: Experience[] = [],
  skillsToAdd: string[] = [],
  skillsToRemove: string[] = [],
  selectedTheme: string = "purple",
  customColor?: string
): ResumeApiData => {
  // Use tailored experiences if provided, otherwise use profile experiences
  const experiences = tailoredExperiences.length > 0 ? tailoredExperiences : profile.experiences;
  
  // Calculate final skills list
  const existingSkills = profile.skills
    .filter(skill => !skillsToRemove.includes(skill.id))
    .map(skill => skill.name);
  const finalSkills = [...existingSkills, ...skillsToAdd];

  // Get the hex color for the selected theme
  let headerColor: string;
  if (selectedTheme === "custom" && customColor) {
    console.log('Using custom color for API:', customColor);
    headerColor = customColor;
  } else {
    console.log('Using preset theme for API:', selectedTheme);
    const selectedColorTheme = colorThemes.find(theme => theme.id === selectedTheme);
    headerColor = selectedColorTheme?.hexColor || "#6B46C1"; // default to purple
  }
  console.log('Final header color for API:', headerColor);

  // Format phone number with dashes if it doesn't have them
  const formatPhone = (phone?: string) => {
    if (!phone) return undefined;
    const digits = phone.replace(/\D/g, '');
    if (digits.length === 10) {
      return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
    }
    return phone;
  };

  const transformedData = {
    name: sanitizeText(profile.personalInfo.name),
    email: profile.personalInfo.email,
    phone: formatPhone(profile.personalInfo.phone),
    website: profile.personalInfo.website,
    summary: sanitizeText(profile.personalInfo.summary),
    education: profile.education.map(edu => ({
      degree: sanitizeText(`${edu.degree} in ${edu.field}`),
      school: sanitizeText(edu.school),
      location_dates: `${formatDate(edu.startDate)} - ${edu.endDate ? formatDate(edu.endDate) : 'Present'}`
    })),
    experience: experiences.map(exp => ({
      job_title: sanitizeText(exp.title),
      company: sanitizeText(exp.company),
      location_dates: `${exp.location || ''} | ${formatDate(exp.startDate)} - ${exp.endDate ? formatDate(exp.endDate) : 'Present'}`.replace(/^\s\|\s/, ''),
      bullet_points: exp.bullets.filter(bullet => bullet.trim() !== '').map(bullet => sanitizeText(bullet))
    })),
    skills: sanitizeText(finalSkills.join(', ')),
    header_color: headerColor // Include the selected header color
  };

  console.log('Final transformed data for API:', JSON.stringify(transformedData, null, 2));
  return transformedData;
};

export const generateResumeFromApi = async (data: ResumeApiData): Promise<Blob> => {
  console.log('Calling Supabase edge function for PDF generation');
  console.log('Request data:', JSON.stringify(data, null, 2));
  
  try {
    // Call the Supabase edge function which proxies to Render
    const { data: pdfBlob, error } = await supabase.functions.invoke('generate-resume-pdf', {
      body: data
    });

    if (error) {
      console.error('Edge function error:', error);
      throw new Error(`Failed to generate PDF: ${error.message}`);
    }

    if (!pdfBlob) {
      throw new Error('No PDF data received from server');
    }

    console.log('Successfully received PDF blob');
    return pdfBlob;
  } catch (error) {
    console.error('Resume generation error:', error);
    throw error;
  }
};

export const downloadResumeBlob = (blob: Blob, filename: string = 'resume.pdf') => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};