
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PersonalInfoForm, { PersonalInfo } from "@/components/PersonalInfoForm";
import ExperienceForm, { Experience } from "@/components/ExperienceForm";
import SkillsForm, { Skill } from "@/components/SkillsForm";
import EducationForm, { Education } from "@/components/EducationForm";
import { Profile as ProfileType } from "@/types/profile";
import { toast } from "@/components/ui/use-toast";

const ProfilePage = () => {
  const [profile, setProfile] = useState<ProfileType>(() => {
    // Try to get profile from localStorage
    const savedProfile = localStorage.getItem("resumeProfile");
    if (savedProfile) {
      try {
        return JSON.parse(savedProfile);
      } catch (error) {
        console.error("Error parsing profile from localStorage:", error);
      }
    }
    
    // Default empty profile
    return {
      personalInfo: {
        name: "",
        email: "",
        phone: "",
        location: "",
        summary: "",
      },
      experiences: [],
      skills: [],
      education: [],
    };
  });

  // Save to localStorage whenever profile changes
  useEffect(() => {
    localStorage.setItem("resumeProfile", JSON.stringify(profile));
  }, [profile]);

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

  const handleResetProfile = () => {
    if (confirm("Are you sure you want to reset your entire profile? This action cannot be undone.")) {
      setProfile({
        personalInfo: {
          name: "",
          email: "",
          phone: "",
          location: "",
          summary: "",
        },
        experiences: [],
        skills: [],
        education: [],
      });
      
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
