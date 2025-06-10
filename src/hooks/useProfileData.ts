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
        console.log("Loading profile for user:", user.id);
        
        // First, let's check if there's a backup in localStorage before we overwrite anything
        const savedProfile = localStorage.getItem("resumeProfile");
        let localProfile: Profile | null = null;
        
        if (savedProfile) {
          try {
            localProfile = JSON.parse(savedProfile);
            console.log("Found local backup profile:", localProfile);
            
            // Check if local profile has actual data (not empty like default)
            const hasLocalData = localProfile && (
              localProfile.personalInfo.name ||
              localProfile.personalInfo.email ||
              localProfile.experiences.length > 0 ||
              localProfile.skills.length > 0 ||
              localProfile.education.length > 0
            );
            
            if (hasLocalData) {
              console.log("Local profile has data, will use as fallback if needed");
            }
          } catch (error) {
            console.error("Error parsing localStorage profile:", error);
          }
        }
        
        // Check if we have the profile in Supabase first
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error("Error fetching profile from Supabase:", error);
          
          // Check if the error is because the profile doesn't exist yet
          if (error.code === 'PGRST116') {
            console.log("Profile doesn't exist in Supabase");
            
            // If we have local data, use it and create the profile in Supabase
            if (localProfile && localProfile.personalInfo.name) {
              console.log("Using localStorage data to restore profile");
              setProfile(localProfile);
              
              // Create profile in Supabase with localStorage data
              const { error: insertError } = await supabase
                .from('profiles')
                .insert({ 
                  id: user.id, 
                  email: user.email,
                  resume_data: localProfile as unknown as Json
                });
                
              if (insertError) {
                console.error("Error creating profile in Supabase:", insertError);
              } else {
                console.log("Successfully restored profile from localStorage backup");
                toast({
                  title: "Profile restored",
                  description: "Your profile has been restored from a local backup.",
                });
              }
            } else {
              // No profile anywhere, create default
              console.log("No profile found, using default and creating in Supabase");
              setProfile(defaultProfile);
              
              const { error: insertError } = await supabase
                .from('profiles')
                .insert({ 
                  id: user.id, 
                  email: user.email,
                  resume_data: defaultProfile as unknown as Json
                });
                
              if (insertError) {
                console.error("Error creating default profile in Supabase:", insertError);
              }
            }
          } else {
            // Other error, try to fall back to localStorage if it has data
            if (localProfile && localProfile.personalInfo.name) {
              console.log("Using localStorage fallback due to Supabase error");
              setProfile(localProfile);
              toast({
                title: "Profile loaded from backup",
                description: "Loaded your profile from local backup due to a connection issue.",
                variant: "destructive",
              });
            } else {
              toast({
                title: "Error loading profile",
                description: "There was an error loading your profile and no backup was found.",
                variant: "destructive",
              });
            }
          }
          
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
            
            console.log("Loaded profile from Supabase:", resumeData);
            
            // Check if the Supabase data is empty/default and we have better local data
            const supabaseHasData = resumeData.personalInfo.name ||
                                   resumeData.personalInfo.email ||
                                   resumeData.experiences.length > 0 ||
                                   resumeData.skills.length > 0 ||
                                   resumeData.education.length > 0;
            
            const localHasData = localProfile && (
              localProfile.personalInfo.name ||
              localProfile.personalInfo.email ||
              localProfile.experiences.length > 0 ||
              localProfile.skills.length > 0 ||
              localProfile.education.length > 0
            );
            
            if (!supabaseHasData && localHasData) {
              console.log("Supabase has empty data but localStorage has data, restoring from local");
              setProfile(localProfile);
              
              // Update Supabase with the local data
              await supabase
                .from('profiles')
                .update({ 
                  resume_data: localProfile as unknown as Json
                })
                .eq('id', user.id);
                
              toast({
                title: "Profile restored",
                description: "Your profile has been restored from a local backup.",
              });
            } else {
              setProfile(resumeData as Profile);
              
              // Also update localStorage for offline access with the latest Supabase data
              localStorage.setItem("resumeProfile", JSON.stringify(resumeData));
            }
          } else {
            console.error("Resume data from Supabase doesn't match expected format", resumeData);
            
            // Try localStorage as fallback
            if (localProfile && localProfile.personalInfo.name) {
              setProfile(localProfile);
              console.log("Using localStorage profile as fallback for malformed Supabase data");
              
              // Try to fix the malformed Supabase data
              await supabase
                .from('profiles')
                .update({ 
                  resume_data: localProfile as unknown as Json
                })
                .eq('id', user.id);
            } else {
              setProfile(defaultProfile);
            }
          }
        } else {
          // No resume data in Supabase, check localStorage
          if (localProfile && localProfile.personalInfo.name) {
            setProfile(localProfile);
            console.log("No Supabase data, using localStorage profile:", localProfile);
            
            // Save to Supabase
            await supabase
              .from('profiles')
              .update({ 
                resume_data: localProfile as unknown as Json
              })
              .eq('id', user.id);
              
            toast({
              title: "Profile restored",
              description: "Your profile has been restored from a local backup.",
            });
          } else {
            setProfile(defaultProfile);
          }
        }
      } catch (error) {
        console.error("Error loading profile:", error);
        
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
                'education' in loadedProfile &&
                loadedProfile.personalInfo.name) {
              setProfile(loadedProfile);
              console.log("Falling back to localStorage after error:", loadedProfile);
              toast({
                title: "Profile loaded from backup",
                description: "Your profile was restored from a local backup.",
              });
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
