
import { useState, useEffect } from "react";
import { supabase, Json } from "@/integrations/supabase/client";
import { Profile } from "@/types/profile";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import { defaultProfile } from "@/utils/profileDefaults";

// Re-export defaultProfile so other files that import from useProfileData can still work
export { defaultProfile };

export function useProfileData() {
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
          
          // Check if the error is because the profile doesn't exist yet
          if (error.code === 'PGRST116') {
            // Profile doesn't exist, create it
            const { error: insertError } = await supabase
              .from('profiles')
              .insert({ 
                id: user.id, 
                email: user.email,
                resume_data: defaultProfile as unknown as Json
              });
              
            if (insertError) {
              console.error("Error creating profile:", insertError);
            } else {
              setProfile(defaultProfile);
            }
          }
          
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

  return {
    profile,
    setProfile,
    isLoading
  };
}
