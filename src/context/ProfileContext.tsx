
import { createContext, useContext, ReactNode } from "react";
import { Profile, PersonalInfo } from "@/types/profile";
import { useProfileManager } from "@/hooks/useProfileManager";
import { defaultProfile } from "@/utils/profileDefaults";

interface ProfileContextType {
  profile: Profile;
  isLoading: boolean;
  handlePersonalInfoSave: (data: PersonalInfo) => void;
  handleExperiencesSave: (experiences: any[]) => void;
  handleSkillsSave: (skills: any[]) => void;
  handleEducationSave: (education: any[]) => void;
  handleResetProfile: () => void;
}

// Create context with default values
const ProfileContext = createContext<ProfileContextType>({
  profile: defaultProfile,
  isLoading: true,
  handlePersonalInfoSave: () => {},
  handleExperiencesSave: () => {},
  handleSkillsSave: () => {},
  handleEducationSave: () => {},
  handleResetProfile: () => {},
});

export const useProfile = () => useContext(ProfileContext);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const profileManager = useProfileManager();
  
  return (
    <ProfileContext.Provider value={profileManager}>
      {children}
    </ProfileContext.Provider>
  );
};
