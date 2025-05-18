
import { Experience } from "@/components/ExperienceForm";
import { Skill } from "@/components/SkillsForm";
import { PersonalInfo } from "@/components/PersonalInfoForm";

export interface Profile {
  personalInfo: PersonalInfo;
  experiences: Experience[];
  skills: Skill[];
}
