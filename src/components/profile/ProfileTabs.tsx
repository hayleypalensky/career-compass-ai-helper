
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PersonalInfoForm from "@/components/PersonalInfoForm";
import ExperienceForm from "@/components/ExperienceForm";
import SkillsForm from "@/components/SkillsForm";
import EducationForm from "@/components/EducationForm";
import { useProfile } from "@/context/ProfileContext";

const ProfileTabs = () => {
  const { 
    profile, 
    handlePersonalInfoSave, 
    handleExperiencesSave, 
    handleEducationSave, 
    handleSkillsSave 
  } = useProfile();

  return (
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
  );
};

export default ProfileTabs;
