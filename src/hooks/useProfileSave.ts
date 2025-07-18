
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
      
      try {
        // Save to localStorage as a backup with deep copy to ensure all changes are captured
        const profileToSave = JSON.parse(JSON.stringify(profile));
        console.log("Saving profile to localStorage:", profileToSave);
        console.log("Experiences being saved:", profileToSave.experiences);
        localStorage.setItem("resumeProfile", JSON.stringify(profileToSave));
        
        // Save to Supabase - convert profile to a format compatible with Json type
        const { data, error } = await supabase
          .from('profiles')
          .update({ 
            resume_data: profileToSave as unknown as Json
          })
          .eq('id', user.id)
          .select();
          
        if (error) {
          console.error("Error saving profile to Supabase:", error);
          if (error.code === 'PGRST116') {
            // Profile doesn't exist, create it
            console.log("Profile doesn't exist, creating new profile");
            const { error: insertError } = await supabase
              .from('profiles')
              .insert({ 
                id: user.id, 
                email: user.email,
                resume_data: profileToSave as unknown as Json
              });
              
            if (insertError) {
              console.error("Error creating profile:", insertError);
              toast({
                title: "Error saving profile",
                description: "There was an error saving your profile. Please try again.",
                variant: "destructive",
              });
            } else {
              console.log("Successfully created new profile");
            }
          } else {
            toast({
              title: "Error saving profile",
              description: "There was an error saving your profile. Please try again.",
              variant: "destructive",
            });
          }
        } else {
          console.log("Profile saved successfully to Supabase");
        }
      } catch (error) {
        console.error("Exception saving profile to Supabase:", error);
        toast({
          title: "Error saving profile",
          description: "There was an unexpected error saving your profile. Please try again.",
          variant: "destructive",
        });
      }
    };

    // Add a small debounce to avoid too many save operations
    const timeoutId = setTimeout(() => {
      saveProfile();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [profile, user]);

  const handlePersonalInfoSave = (data: PersonalInfo) => {
    setProfile((prev) => {
      console.log("Saving personal info:", data);
      const newProfile = {
        ...prev,
        personalInfo: data,
      };
      console.log("Updated profile with personal info:", newProfile);
      return newProfile;
    });
    
    toast({
      title: "Personal information saved",
      description: "Your personal information has been saved successfully.",
    });
  };

  const handleExperiencesSave = (experiences: any[]) => {
    console.log("Saving experiences with updated bullets:", experiences);
    
    setProfile((prev) => {
      const newProfile = {
        ...prev,
        experiences: JSON.parse(JSON.stringify(experiences)), // Deep copy to ensure all changes are captured
      };
      console.log("Updated profile with experiences:", newProfile);
      return newProfile;
    });
    
    // Force immediate save to localStorage to ensure persistence
    setTimeout(() => {
      const savedProfile = localStorage.getItem("resumeProfile");
      if (savedProfile) {
        const parsedProfile = JSON.parse(savedProfile);
        console.log("Verified experiences in localStorage after save:", parsedProfile.experiences);
        
        // Double-check that bullet points are saved
        if (parsedProfile.experiences) {
          parsedProfile.experiences.forEach((exp: any, index: number) => {
            console.log(`Experience ${index} bullets:`, exp.bullets);
          });
        }
      }
    }, 100);
    
    toast({
      title: "Experiences saved",
      description: "Your experiences have been saved successfully.",
    });
  };

  const handleSkillsSave = (skills: any[]) => {
    console.log("Saving skills:", skills);
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
    console.log("Saving education:", education);
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
