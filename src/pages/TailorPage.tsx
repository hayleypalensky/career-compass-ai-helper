
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import JobDescriptionAnalyzer from "@/components/job-description-analyzer/JobDescriptionAnalyzer";
import TailorResume from "@/components/TailorResume";
import { Profile } from "@/types/profile";
import { Experience } from "@/components/ExperienceForm";
import { Skill } from "@/components/SkillsForm";
import ProfileNotFoundMessage from "@/components/resume-tailoring/ProfileNotFoundMessage";
import IncompleteProfileCard from "@/components/resume-tailoring/IncompleteProfileCard";
import TailorActionsRow from "@/components/resume-tailoring/TailorActionsRow";

const TailorPage = () => {
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [relevantSkills, setRelevantSkills] = useState<string[]>([]);
  const [missingSkills, setMissingSkills] = useState<string[]>([]);
  const [showTailorSection, setShowTailorSection] = useState(false);
  const [jobTitle, setJobTitle] = useState<string>("");
  const [companyName, setCompanyName] = useState<string>("");
  const [jobDescription, setJobDescription] = useState<string>("");
  const [isTailored, setIsTailored] = useState(false);
  const [selectedColorTheme, setSelectedColorTheme] = useState<string>("purple");

  // Load profile from localStorage
  useEffect(() => {
    const savedProfile = localStorage.getItem("resumeProfile");
    if (savedProfile) {
      try {
        setProfile(JSON.parse(savedProfile));
      } catch (error) {
        console.error("Error parsing profile from localStorage:", error);
        toast({
          title: "Error loading profile",
          description: "There was an error loading your profile. Please check your profile page.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Profile not found",
        description: "Please create your profile before tailoring your resume.",
        variant: "destructive",
      });
    }
  }, []);

  const handleAnalysisComplete = (
    relevant: string[], 
    missing: string[], 
    jobInfo: { title?: string; company?: string; description?: string }
  ) => {
    setRelevantSkills(relevant);
    setMissingSkills(missing);
    setShowTailorSection(true);
    setJobTitle(jobInfo.title || "");
    setCompanyName(jobInfo.company || "");
    setJobDescription(jobInfo.description || "");
  };

  const handleUpdateResume = (experiences: Experience[], skills: Skill[]) => {
    if (!profile) return;

    // Update profile with tailored experiences and skills
    const updatedProfile = {
      ...profile,
      experiences: experiences,
      skills: skills,
    };

    // Save to localStorage
    localStorage.setItem("resumeProfile", JSON.stringify(updatedProfile));
    setProfile(updatedProfile);
    setIsTailored(true);

    toast({
      title: "Resume updated",
      description: "Your resume has been tailored based on the job description.",
    });
  };

  // Update selected color theme when it changes in TailorResume
  const handleColorThemeChange = (theme: string) => {
    setSelectedColorTheme(theme);
  };

  // If there's no profile, show message to create one
  if (!profile) {
    return <ProfileNotFoundMessage />;
  }

  // Check if profile has minimum required information
  const isProfileIncomplete = 
    !profile.personalInfo.name || 
    !profile.personalInfo.email || 
    !profile.personalInfo.summary ||
    profile.experiences.length === 0 ||
    profile.skills.length === 0;

  if (isProfileIncomplete) {
    return <IncompleteProfileCard profile={profile} />;
  }

  return (
    <div className="space-y-8">
      <h1>Tailor Your Resume</h1>
      
      <JobDescriptionAnalyzer 
        profile={profile} 
        onAnalysisComplete={handleAnalysisComplete} 
      />
      
      <div className="space-y-8 mt-6">
        {showTailorSection && (
          <>
            <TailorResume
              profile={profile}
              relevantSkills={relevantSkills}
              missingSkills={missingSkills}
              onUpdateResume={handleUpdateResume}
              jobDescription={jobDescription}
              onColorThemeChange={handleColorThemeChange}
            />
            
            {isTailored && (
              <TailorActionsRow
                profile={profile}
                jobTitle={jobTitle}
                companyName={companyName}
                jobDescription={jobDescription}
                colorTheme={selectedColorTheme}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TailorPage;
