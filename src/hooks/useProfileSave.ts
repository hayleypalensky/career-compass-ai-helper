
import { useEffect } from "react";
import { supabase, Json } from "@/integrations/supabase/client";
import { Profile, PersonalInfo } from "@/types/profile";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/components/ui/use-toast";
import { defaultProfile } from "@/utils/profileDefaults";

export function useProfileSave(profile: Profile, setProfile: React.Dispatch<React.SetStateAction<Profile>>) {
  const { user } = useAuth();
  
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
          
        if (error) {
          console.error("Error saving profile to Supabase:", error);
          if (error.code === 'PGRST116') {
            // Profile doesn't exist, create it
            const { error: insertError } = await supabase
              .from('profiles')
              .insert({ 
                id: user.id, 
                email: user.email,
                resume_data: profile as unknown as Json
              });
              
            if (insertError) {
              console.error("Error creating profile:", insertError);
            }
          }
        }
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
    
    toast({
      title: "Personal information saved",
      description: "Your personal information has been saved successfully.",
    });
  };

  const handleExperiencesSave = (experiences: any[]) => {
    setProfile((prev) => ({
      ...prev,
      experiences,
    }));
    
    toast({
      title: "Experiences saved",
      description: "Your experiences have been saved successfully.",
    });
  };

  const handleSkillsSave = (skills: any[]) => {
    setProfile((prev) => ({
      ...prev,
      skills,
    }));
    
    toast({
      title: "Skills saved",
      description: "Your skills have been saved successfully.",
    });
  };

  const handleEducationSave = (education: any[]) => {
    setProfile((prev) => ({
      ...prev,
      education,
    }));
    
    toast({
      title: "Education saved",
      description: "Your education information has been saved successfully.",
    });
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

  return {
    handlePersonalInfoSave,
    handleExperiencesSave,
    handleSkillsSave,
    handleEducationSave,
    handleResetProfile
  };
}
