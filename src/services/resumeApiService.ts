import { Profile } from "@/types/profile";
import { Experience } from "@/components/ExperienceForm";
import { formatDate } from "@/utils/resumeFormatters";

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

  return {
    name: profile.personalInfo.name,
    email: profile.personalInfo.email,
    phone: profile.personalInfo.phone,
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
};

export const generateResumeFromApi = async (data: ResumeApiData): Promise<Blob> => {
  console.log('Making API request via Supabase Edge Function');
  console.log('Request data:', JSON.stringify(data, null, 2));
  
  try {
    const response = await fetch('/functions/v1/generate-resume-pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API error response:', errorText);
      throw new Error(`API responded with ${response.status}: ${errorText || response.statusText}`);
    }

    const blob = await response.blob();
    console.log('Successfully received blob, size:', blob.size, 'type:', blob.type);
    return blob;
  } catch (error) {
    console.error('Fetch error details:', error);
    
    // Check if it's a network/CORS error
    if (error instanceof TypeError && (error.message.includes('fetch') || error.message.includes('NetworkError'))) {
      throw new Error('Unable to connect to the resume formatting service. This might be due to:\n• CORS restrictions\n• Server unavailable\n• Network connectivity issues\n\nPlease try again or contact support if the issue persists.');
    }
    
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