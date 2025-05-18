
import { Experience } from "@/components/ExperienceForm";
import { Skill } from "@/components/SkillsForm";
import { Education } from "@/components/EducationForm";

// We need to explicitly define PersonalInfo here instead of importing it,
// so we can add the website property
export interface PersonalInfo {
  name: string;
  email: string;
  phone?: string;
  location?: string;
  summary: string;
  website?: string;  // Added website property as optional
}

export interface Profile {
  personalInfo: PersonalInfo;
  experiences: Experience[];
  skills: Skill[];
  education: Education[];
}
