
import { useProfileData } from "./useProfileData";
import { useProfileSave } from "./useProfileSave";
import { Profile, PersonalInfo } from "@/types/profile";

export function useProfileManager() {
  const { profile, setProfile, isLoading } = useProfileData();
  
  const {
    handlePersonalInfoSave,
    handleExperiencesSave,
    handleSkillsSave,
    handleEducationSave,
    handleResetProfile
  } = useProfileSave(profile, setProfile);
  
  return {
    profile,
    isLoading,
    handlePersonalInfoSave,
    handleExperiencesSave,
    handleSkillsSave,
    handleEducationSave,
    handleResetProfile
  };
}
