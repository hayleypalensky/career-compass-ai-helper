import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PersonalInfoForm from "@/components/PersonalInfoForm";
import ExperienceForm, { Experience } from "@/components/ExperienceForm";
import SkillsForm, { Skill } from "@/components/SkillsForm";
import EducationForm, { Education } from "@/components/EducationForm";
import { Profile as ProfileType, PersonalInfo } from "@/types/profile";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const ProfilePage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileType>(() => {
    // Default empty profile
    return {
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
  });

  // Load profile from Supabase
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;

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
            setProfile(resumeData as ProfileType);
          } else {
            console.error("Resume data from Supabase doesn't match expected format");
          }
        } else if (loadedProfile) {
          // If we have a local profile but not in Supabase, save it
          await supabase
            .from('profiles')
            .update({ 
              resume_data: loadedProfile as unknown as Record<string, unknown>
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
            resume_data: profile as unknown as Record<string, unknown>
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

  const handleExperiencesSave = (experiences: Experience[]) => {
    setProfile((prev) => ({
      ...prev,
      experiences,
    }));
  };

  const handleSkillsSave = (skills: Skill[]) => {
    setProfile((prev) => ({
      ...prev,
      skills,
    }));
  };

  const handleEducationSave = (education: Education[]) => {
    setProfile((prev) => ({
      ...prev,
      education,
    }));
  };

  const handleResetProfile = async () => {
    if (confirm("Are you sure you want to reset your entire profile? This action cannot be undone.")) {
      const newProfile = {
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
      
      setProfile(newProfile);
      
      if (user) {
        try {
          const { error } = await supabase
            .from('profiles')
            .update({ 
              resume_data: newProfile as unknown as Record<string, unknown>
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

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1>Your Profile</h1>
        <button 
          onClick={handleResetProfile}
          className="text-sm text-red-600 hover:text-red-800 underline"
        >
          Reset Profile
        </button>
      </div>
      
      <p className="text-gray-600">
        Complete your profile information to create your base resume for job applications.
      </p>

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
        </TabsList>
        
        <TabsContent value="personal" className="mt-6">
          <PersonalInfoForm 
            onSave={handlePersonalInfoSave}
            initialData={profile.personalInfo}
          />
        </TabsContent>
        
        <TabsContent value="experience" className="mt-6">
          <ExperienceForm 
            onSave={handleExperiencesSave}
            initialData={profile.experiences}
          />
        </TabsContent>
        
        <TabsContent value="education" className="mt-6">
          <EducationForm 
            onSave={handleEducationSave}
            initialData={profile.education}
          />
        </TabsContent>
        
        <TabsContent value="skills" className="mt-6">
          <SkillsForm 
            onSave={handleSkillsSave}
            initialData={profile.skills}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfilePage;
