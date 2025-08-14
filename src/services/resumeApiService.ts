import { Profile } from "@/types/profile";
import { Experience } from "@/components/ExperienceForm";
import { formatDate } from "@/utils/resumeFormatters";
import { supabase } from "@/integrations/supabase/client";
import { colorThemes } from "@/components/resume-tailoring/ResumeColorSelector";

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
    name: profile.personalInfo.name,
    email: profile.personalInfo.email,
    phone: formatPhone(profile.personalInfo.phone),
    website: profile.personalInfo.website,
    summary: profile.personalInfo.summary,
    education: profile.education.map(edu => ({
      degree: `${edu.degree} in ${edu.field}`,
      school: edu.school,
      location_dates: `${formatDate(edu.startDate)} - ${edu.endDate ? formatDate(edu.endDate) : 'Present'}`
    })),
    experience: experiences.map(exp => ({
      job_title: exp.title,
      company: exp.company,
      location_dates: `${exp.location || ''} | ${formatDate(exp.startDate)} - ${exp.endDate ? formatDate(exp.endDate) : 'Present'}`.replace(/^\s\|\s/, ''),
      bullet_points: exp.bullets.filter(bullet => bullet.trim() !== '')
    })),
    skills: finalSkills.join(', '),
    header_color: headerColor // Include the selected header color
  };

  console.log('Final transformed data for API:', JSON.stringify(transformedData, null, 2));
  return transformedData;
};

export const generateResumeFromApi = async (data: ResumeApiData): Promise<Blob> => {
  console.log('Making API request directly to Render API');
  console.log('Request data:', JSON.stringify(data, null, 2));
  
  try {
    // Call your Render API directly
    const response = await fetch('https://resume-pdf-api.onrender.com/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    console.log('Render API response status:', response.status);
    console.log('Render API response ok:', response.ok);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Render API error response:', errorText);
      throw new Error(`Render API failed with status ${response.status}: ${errorText}`);
    }

    // Get the PDF blob from the API response
    const blob = await response.blob();
    console.log('Successfully received blob, size:', blob.size, 'type:', blob.type);
    
    // Validate that we have a non-empty blob
    if (blob.size === 0) {
      throw new Error('Received empty PDF file from server');
    }
    
    return blob;
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