
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase, Json } from "@/integrations/supabase/client";
import { Profile, PersonalInfo } from "@/types/profile";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";

interface ProfileContextType {
  profile: Profile;
  isLoading: boolean;
  handlePersonalInfoSave: (data: PersonalInfo) => void;
  handleExperiencesSave: (experiences: any[]) => void;
  handleSkillsSave: (skills: any[]) => void;
  handleEducationSave: (education: any[]) => void;
  handleResetProfile: () => void;
}

const defaultProfile: Profile = {
  personalInfo: {
    name: "",
    email: "",
    phone: "",
    location: "",
    summary: "",
    website: "",
  },
  experiences: [],
  skills: [],
  education: [],
};

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
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [isLoading, setIsLoading] = useState(true);

  // Load profile from Supabase
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        // Try to load profile from localStorage as a fallback
        const savedProfile = localStorage.getItem("resumeProfile");
        let loadedProfile = null;
        
        if (savedProfile) {
          try {
            loadedProfile = JSON.parse(savedProfile);
            // Use this profile temporarily while we fetch from Supabase
            setProfile(loadedProfile);
          } catch (error) {
            console.error("Error parsing profile from localStorage:", error);
          }
        }

        // Check if we have the profile in Supabase
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error("Error fetching profile:", error);
          setIsLoading(false);
          return;
        }

        if (profileData && profileData.resume_data) {
          // Safely cast the JSON data to our ProfileType
          const resumeData = profileData.resume_data as any;
          
          // Validate that the data has the required structure before setting it
          if (resumeData && 
              typeof resumeData === 'object' && 
              'personalInfo' in resumeData && 
              'experiences' in resumeData &&
              'skills' in resumeData &&
              'education' in resumeData) {
            setProfile(resumeData as Profile);
          } else {
            console.error("Resume data from Supabase doesn't match expected format");
          }
        } else if (loadedProfile) {
          // If we have a local profile but not in Supabase, save it
          await supabase
            .from('profiles')
            .update({ 
              resume_data: loadedProfile as unknown as Json
            })
            .eq('id', user.id);
        }
      } catch (error) {
        console.error("Error loading profile:", error);
        toast({
          title: "Error",
          description: "Failed to load your profile.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  // Save to localStorage and Supabase whenever profile changes
  useEffect(() => {
    const saveProfile = async () => {
      if (!user) return;
      
      // Save to localStorage as a backup
      localStorage.setItem("resumeProfile", JSON.stringify(profile));
      
      try {
        // Save to Supabase - convert profile to a format compatible with Json type
        const { error } = await supabase
          .from('profiles')
          .update({ 
            resume_data: profile as unknown as Json
          })
          .eq('id', user.id);
          
        if (error) throw error;
      } catch (error) {
        console.error("Error saving profile to Supabase:", error);
        // We don't show a toast here to avoid spamming the user on every change
      }
    };

    saveProfile();
  }, [profile, user]);

  const handlePersonalInfoSave = (data: PersonalInfo) => {
    setProfile((prev) => ({
      ...prev,
      personalInfo: data,
    }));
  };

  const handleExperiencesSave = (experiences: any[]) => {
    setProfile((prev) => ({
      ...prev,
      experiences,
    }));
  };

  const handleSkillsSave = (skills: any[]) => {
    setProfile((prev) => ({
      ...prev,
      skills,
    }));
  };

  const handleEducationSave = (education: any[]) => {
    setProfile((prev) => ({
      ...prev,
      education,
    }));
  };

  const handleResetProfile = async () => {
    if (confirm("Are you sure you want to reset your entire profile? This action cannot be undone.")) {
      const newProfile = { ...defaultProfile };
      
      setProfile(newProfile);
      
      if (user) {
        try {
          const { error } = await supabase
            .from('profiles')
            .update({ 
              resume_data: newProfile as unknown as Json
            })
            .eq('id', user.id);
            
          if (error) throw error;
        } catch (error) {
          console.error("Error resetting profile in Supabase:", error);
        }
      }
      
      toast({
        title: "Profile reset",
        description: "Your profile has been reset to default.",
      });
    }
  };

  const value = {
    profile,
    isLoading,
    handlePersonalInfoSave,
    handleExperiencesSave,
    handleSkillsSave,
    handleEducationSave,
    handleResetProfile
  };

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
};
