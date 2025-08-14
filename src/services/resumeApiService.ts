import { Profile } from "@/types/profile";
import { Experience } from "@/components/ExperienceForm";
import { formatDate } from "@/utils/resumeFormatters";
import { supabase } from "@/integrations/supabase/client";

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
}

export const transformProfileForApi = (
  profile: Profile,
  tailoredExperiences: Experience[] = [],
  skillsToAdd: string[] = [],
  skillsToRemove: string[] = []
): ResumeApiData => {
  // Use tailored experiences if provided, otherwise use profile experiences
  const experiences = tailoredExperiences.length > 0 ? tailoredExperiences : profile.experiences;
  
  // Calculate final skills list
  const existingSkills = profile.skills
    .filter(skill => !skillsToRemove.includes(skill.id))
    .map(skill => skill.name);
  const finalSkills = [...existingSkills, ...skillsToAdd];

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
    skills: finalSkills.join(', ')
  };

  console.log('Final transformed data for API:', JSON.stringify(transformedData, null, 2));
  return transformedData;
};

export const generateResumeFromApi = async (data: ResumeApiData): Promise<Blob> => {
  console.log('Making API request via Supabase Edge Function');
  console.log('Request data:', JSON.stringify(data, null, 2));
  
  try {
    // Call the edge function and get the raw response
    const response = await supabase.functions.invoke('generate-resume-pdf', {
      body: data,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.error) {
      console.error('Supabase function error:', response.error);
      throw new Error(`Resume generation failed: ${response.error.message}`);
    }

    if (!response.data) {
      throw new Error('No data received from resume generation service');
    }

    // The edge function returns an ArrayBuffer, convert it to a proper PDF blob
    let blob: Blob;
    
    if (response.data instanceof ArrayBuffer) {
      console.log('Received ArrayBuffer, size:', response.data.byteLength);
      blob = new Blob([response.data], { type: 'application/pdf' });
    } else if (response.data instanceof Uint8Array) {
      console.log('Received Uint8Array, size:', response.data.length);
      blob = new Blob([response.data], { type: 'application/pdf' });
    } else if (response.data instanceof Blob) {
      console.log('Received Blob directly, size:', response.data.size);
      blob = response.data;
    } else {
      // Try to convert whatever we got to a blob
      console.log('Received unknown data type, attempting conversion:', typeof response.data);
      blob = new Blob([response.data], { type: 'application/pdf' });
    }
    
    console.log('Successfully created blob, size:', blob.size, 'type:', blob.type);
    
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