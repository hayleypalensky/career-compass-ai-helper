
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PersonalInfoForm from "@/components/PersonalInfoForm";
import ExperienceForm from "@/components/ExperienceForm";
import SkillsForm from "@/components/SkillsForm";
import EducationForm from "@/components/EducationForm";
import { useProfile } from "@/context/ProfileContext";
import { User, Briefcase, GraduationCap, Code } from "lucide-react";

const ProfileTabs = () => {
  const { 
    profile, 
    handlePersonalInfoSave, 
    handleExperiencesSave, 
    handleEducationSave, 
    handleSkillsSave 
  } = useProfile();

  return (
    <Tabs defaultValue="personal" className="w-full animate-fade-in">
      <TabsList className="grid w-full grid-cols-4 p-1 mb-4 bg-surface-container rounded-xl">
        <TabsTrigger 
          value="personal" 
          className="flex items-center gap-2 text-label-large rounded-lg py-3 data-[state=active]:bg-secondary-container data-[state=active]:text-on-secondary-container"
        >
          <User className="w-4 h-4" />
          <span>Personal Info</span>
        </TabsTrigger>
        <TabsTrigger 
          value="experience" 
          className="flex items-center gap-2 text-label-large rounded-lg py-3 data-[state=active]:bg-secondary-container data-[state=active]:text-on-secondary-container"
        >
          <Briefcase className="w-4 h-4" />
          <span>Experience</span>
        </TabsTrigger>
        <TabsTrigger 
          value="education" 
          className="flex items-center gap-2 text-label-large rounded-lg py-3 data-[state=active]:bg-secondary-container data-[state=active]:text-on-secondary-container"
        >
          <GraduationCap className="w-4 h-4" />
          <span>Education</span>
        </TabsTrigger>
        <TabsTrigger 
          value="skills" 
          className="flex items-center gap-2 text-label-large rounded-lg py-3 data-[state=active]:bg-secondary-container data-[state=active]:text-on-secondary-container"
        >
          <Code className="w-4 h-4" />
          <span>Skills</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="personal" className="mt-6 animate-scale-in">
        <div className="material-surface p-6">
          <PersonalInfoForm 
            onSave={handlePersonalInfoSave}
            initialData={profile.personalInfo}
          />
        </div>
      </TabsContent>
      
      <TabsContent value="experience" className="mt-6 animate-scale-in">
        <div className="material-surface p-6">
          <ExperienceForm 
            onSave={handleExperiencesSave}
            initialData={profile.experiences}
          />
        </div>
      </TabsContent>
      
      <TabsContent value="education" className="mt-6 animate-scale-in">
        <div className="material-surface p-6">
          <EducationForm 
            onSave={handleEducationSave}
            initialData={profile.education}
          />
        </div>
      </TabsContent>
      
      <TabsContent value="skills" className="mt-6 animate-scale-in">
        <div className="material-surface p-6">
          <SkillsForm 
            onSave={handleSkillsSave}
            initialData={profile.skills}
          />
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default ProfileTabs;
