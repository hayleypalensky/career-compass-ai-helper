
import { Experience } from "@/components/ExperienceForm";
import { Skill } from "@/components/SkillsForm";
import { PersonalInfo } from "@/components/PersonalInfoForm";
import { Education } from "@/components/EducationForm";

export interface Profile {
  personalInfo: PersonalInfo;
  experiences: Experience[];
  skills: Skill[];
  education: Education[];
}
