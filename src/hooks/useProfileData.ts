
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
            console.log("Profile doesn't exist in Supabase, checking localStorage");
            
            // Try to load profile from localStorage
            const savedProfile = localStorage.getItem("resumeProfile");
            let loadedProfile: Profile | null = null;
            
            if (savedProfile) {
              try {
                loadedProfile = JSON.parse(savedProfile);
                console.log("Loaded profile from localStorage:", loadedProfile);
                console.log("Experiences from localStorage:", loadedProfile?.experiences);
                
                // Validate the loaded profile structure
                if (loadedProfile && 
                    typeof loadedProfile === 'object' && 
                    'personalInfo' in loadedProfile && 
                    'experiences' in loadedProfile &&
                    'skills' in loadedProfile &&
                    'education' in loadedProfile) {
                  setProfile(loadedProfile);
                  
                  // Create profile in Supabase with localStorage data
                  console.log("Creating profile in Supabase with localStorage data");
                  const { error: insertError } = await supabase
                    .from('profiles')
                    .insert({ 
                      id: user.id, 
                      email: user.email,
                      resume_data: loadedProfile as unknown as Json
                    });
                    
                  if (insertError) {
                    console.error("Error creating profile in Supabase:", insertError);
                  }
                } else {
                  console.error("Invalid profile structure in localStorage");
                  setProfile(defaultProfile);
                }
              } catch (error) {
                console.error("Error parsing profile from localStorage:", error);
                setProfile(defaultProfile);
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
            toast({
              title: "Error loading profile",
              description: "There was an error loading your profile. Using local data if available.",
              variant: "destructive",
            });
            
            // Try to fall back to localStorage
            const savedProfile = localStorage.getItem("resumeProfile");
            if (savedProfile) {
              try {
                const loadedProfile = JSON.parse(savedProfile);
                if (loadedProfile && 
                    typeof loadedProfile === 'object' && 
                    'personalInfo' in loadedProfile && 
                    'experiences' in loadedProfile &&
                    'skills' in loadedProfile &&
                    'education' in loadedProfile) {
                  setProfile(loadedProfile);
                  console.log("Using localStorage fallback after Supabase error:", loadedProfile);
                }
              } catch (localError) {
                console.error("Error loading from localStorage fallback:", localError);
              }
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
            console.log("Experiences from Supabase:", resumeData.experiences);
            
            // Ensure experiences have proper bullet points
            if (resumeData.experiences) {
              resumeData.experiences.forEach((exp: any, index: number) => {
                console.log(`Experience ${index} bullets:`, exp.bullets);
              });
            }
            
            setProfile(resumeData as Profile);
            
            // Also update localStorage for offline access with the latest Supabase data
            localStorage.setItem("resumeProfile", JSON.stringify(resumeData));
          } else {
            console.error("Resume data from Supabase doesn't match expected format", resumeData);
            
            // Try localStorage as fallback
            const savedProfile = localStorage.getItem("resumeProfile");
            if (savedProfile) {
              try {
                const loadedProfile = JSON.parse(savedProfile);
                if (loadedProfile && 
                    typeof loadedProfile === 'object' && 
                    'personalInfo' in loadedProfile && 
                    'experiences' in loadedProfile &&
                    'skills' in loadedProfile &&
                    'education' in loadedProfile) {
                  setProfile(loadedProfile);
                  console.log("Using localStorage profile as fallback for malformed Supabase data");
                  
                  // Try to fix the malformed Supabase data
                  await supabase
                    .from('profiles')
                    .update({ 
                      resume_data: loadedProfile as unknown as Json
                    })
                    .eq('id', user.id);
                }
              } catch (error) {
                console.error("Error parsing localStorage fallback:", error);
                setProfile(defaultProfile);
              }
            } else {
              setProfile(defaultProfile);
            }
          }
        } else {
          // No resume data in Supabase, check localStorage
          const savedProfile = localStorage.getItem("resumeProfile");
          if (savedProfile) {
            try {
              const loadedProfile = JSON.parse(savedProfile);
              if (loadedProfile && 
                  typeof loadedProfile === 'object' && 
                  'personalInfo' in loadedProfile && 
                  'experiences' in loadedProfile &&
                  'skills' in loadedProfile &&
                  'education' in loadedProfile) {
                setProfile(loadedProfile);
                console.log("No Supabase data, using localStorage profile:", loadedProfile);
                
                // Save to Supabase
                await supabase
                  .from('profiles')
                  .update({ 
                    resume_data: loadedProfile as unknown as Json
                  })
                  .eq('id', user.id);
              }
            } catch (error) {
              console.error("Error parsing localStorage when no Supabase data:", error);
              setProfile(defaultProfile);
            }
          } else {
            setProfile(defaultProfile);
          }
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
              console.log("Falling back to localStorage after error:", loadedProfile);
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
