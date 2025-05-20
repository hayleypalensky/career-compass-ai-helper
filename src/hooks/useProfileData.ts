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
        // Try to load profile from localStorage first
        const savedProfile = localStorage.getItem("resumeProfile");
        let loadedProfile: Profile | null = null;
        
        if (savedProfile) {
          try {
            loadedProfile = JSON.parse(savedProfile);
            // Validate the loaded profile structure
            if (loadedProfile && 
                typeof loadedProfile === 'object' && 
                'personalInfo' in loadedProfile && 
                'experiences' in loadedProfile &&
                'skills' in loadedProfile &&
                'education' in loadedProfile) {
              // Use this profile temporarily while we fetch from Supabase
              setProfile(loadedProfile);
              console.log("Loaded profile from localStorage:", loadedProfile);
            }
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
          console.error("Error fetching profile from Supabase:", error);
          
          // Check if the error is because the profile doesn't exist yet
          if (error.code === 'PGRST116') {
            console.log("Profile doesn't exist, creating it with default or local data");
            // Use loaded profile from localStorage if available, otherwise use default
            const profileToCreate = loadedProfile || defaultProfile;
            
            // Profile doesn't exist, create it
            const { error: insertError } = await supabase
              .from('profiles')
              .insert({ 
                id: user.id, 
                email: user.email,
                resume_data: profileToCreate as unknown as Json
              });
              
            if (insertError) {
              console.error("Error creating profile in Supabase:", insertError);
            } else {
              // If we successfully created the profile but used default values,
              // make sure the state reflects what we just created
              if (!loadedProfile) {
                setProfile(defaultProfile);
              }
              console.log("Created new profile in Supabase");
            }
          }
          
          // We've already set profile from localStorage if available,
          // so just finish loading
          setIsLoading(false);
          return;
        }

        if (profileData && profileData.resume_data) {
          // Safely cast the JSON data to our Profile type
          const resumeData = profileData.resume_data as any;
          
          // Validate that the data has the required structure before setting it
          if (resumeData && 
              typeof resumeData === 'object' && 
              'personalInfo' in resumeData && 
              'experiences' in resumeData &&
              'skills' in resumeData &&
              'education' in resumeData) {
            setProfile(resumeData as Profile);
            console.log("Loaded profile from Supabase:", resumeData);
            
            // Also update localStorage for offline access
            localStorage.setItem("resumeProfile", JSON.stringify(resumeData));
          } else {
            console.error("Resume data from Supabase doesn't match expected format");
            
            // If we have a valid profile in localStorage, use that instead
            if (loadedProfile) {
              console.log("Using localStorage profile as fallback");
              // We'll keep using the localStorage profile we already set
            } else {
              // If we don't have a valid profile anywhere, use the default
              setProfile(defaultProfile);
              console.log("Using default profile as last resort");
              
              // Try to update the malformed Supabase data
              await supabase
                .from('profiles')
                .update({ 
                  resume_data: defaultProfile as unknown as Json
                })
                .eq('id', user.id);
            }
          }
        } else if (loadedProfile) {
          // If we have a local profile but not in Supabase, save it to Supabase
          await supabase
            .from('profiles')
            .update({ 
              resume_data: loadedProfile as unknown as Json
            })
            .eq('id', user.id);
          console.log("Updated Supabase with localStorage profile");
        } else {
          // No profile in Supabase or localStorage, use default
          setProfile(defaultProfile);
          console.log("No profile found anywhere, using default");
        }
      } catch (error) {
        console.error("Error loading profile:", error);
        toast({
          title: "Error",
          description: "Failed to load your profile. Using saved local data if available.",
          variant: "destructive",
        });
        
        // Try to fall back to localStorage if there's an error
        try {
          const savedProfile = localStorage.getItem("resumeProfile");
          if (savedProfile) {
            const loadedProfile = JSON.parse(savedProfile);
            if (loadedProfile && 
                typeof loadedProfile === 'object' && 
                'personalInfo' in loadedProfile && 
                'experiences' in loadedProfile &&
                'skills' in loadedProfile &&
                'education' in loadedProfile) {
              setProfile(loadedProfile);
              console.log("Falling back to localStorage after error");
            }
          }
        } catch (localError) {
          console.error("Error loading from localStorage fallback:", localError);
        }
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
