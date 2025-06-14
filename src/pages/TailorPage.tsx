
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import JobDescriptionAnalyzer from "@/components/job-description-analyzer/JobDescriptionAnalyzer";
import TailorResume from "@/components/TailorResume";
import CoverLetterGenerator from "@/components/resume-tailoring/CoverLetterGenerator";
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
  const [location, setLocation] = useState<string>("");
  const [remote, setRemote] = useState<boolean>(false);
  const [jobDescription, setJobDescription] = useState<string>("");
  const [isTailored, setIsTailored] = useState(false);
  const [selectedColorTheme, setSelectedColorTheme] = useState<string>("purple");
  const [resetTrigger, setResetTrigger] = useState(false);
  // This is the tailored summary used only for PDF export, separate from profile
  const [tailoredSummary, setTailoredSummary] = useState<string>("");

  // Load profile from localStorage
  useEffect(() => {
    const loadProfile = () => {
      const savedProfile = localStorage.getItem("resumeProfile");
      if (savedProfile) {
        try {
          const parsedProfile = JSON.parse(savedProfile);
          setProfile(parsedProfile);
          // Initialize tailored summary with profile summary as default
          setTailoredSummary(parsedProfile.personalInfo.summary || "");
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
    };

    loadProfile();

    // Listen for localStorage changes from other components
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "resumeProfile" && e.newValue) {
        try {
          const updatedProfile = JSON.parse(e.newValue);
          setProfile(updatedProfile);
          // Reset tailored summary to new profile summary when profile changes
          setTailoredSummary(updatedProfile.personalInfo.summary || "");
        } catch (error) {
          console.error("Error parsing updated profile:", error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleAnalysisComplete = (
    relevant: string[], 
    missing: string[], 
    jobInfo: { title?: string; company?: string; location?: string; remote?: boolean; description?: string }
  ) => {
    setRelevantSkills(relevant);
    setMissingSkills(missing);
    setShowTailorSection(true);
    setJobTitle(jobInfo.title || "");
    setCompanyName(jobInfo.company || "");
    setLocation(jobInfo.location || "");
    setRemote(jobInfo.remote || false);
    setJobDescription(jobInfo.description || "");
    console.log('Job analysis complete:', { title: jobInfo.title, company: jobInfo.company, location: jobInfo.location, remote: jobInfo.remote });
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

  // Handle summary changes in the tailor section (for PDF export only)
  const handleSummaryChange = (summary: string) => {
    setTailoredSummary(summary);
  };

  // Handle reset for new job - clear all form fields and tailor section
  const handleResetForNewJob = () => {
    // Clear job form fields
    setJobTitle("");
    setCompanyName("");
    setLocation("");
    setRemote(false);
    setJobDescription("");
    
    // Clear analysis results
    setRelevantSkills([]);
    setMissingSkills([]);
    
    // Hide tailor section
    setShowTailorSection(false);
    setIsTailored(false);
    
    // Reset color theme and summary to profile defaults
    setSelectedColorTheme("purple");
    if (profile) {
      setTailoredSummary(profile.personalInfo.summary || "");
    }
    
    // Trigger reset in JobDescriptionAnalyzer
    setResetTrigger(prev => !prev);
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

  // Create profile with tailored summary for components that need it (PDF export)
  const profileWithTailoredSummary = {
    ...profile,
    personalInfo: {
      ...profile.personalInfo,
      summary: tailoredSummary
    }
  };

  return (
    <div className="space-y-8">
      <h1>Tailor Your Resume</h1>
      
      <JobDescriptionAnalyzer 
        profile={profile} 
        onAnalysisComplete={handleAnalysisComplete} 
        resetTrigger={resetTrigger}
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
              onResetForNewJob={handleResetForNewJob}
              onSummaryChange={handleSummaryChange}
              tailoredSummary={tailoredSummary}
            />

            <CoverLetterGenerator
              profile={profileWithTailoredSummary}
              jobDescription={jobDescription}
              jobTitle={jobTitle}
              companyName={companyName}
              relevantSkills={relevantSkills}
            />
            
            {isTailored && (
              <TailorActionsRow
                profile={profileWithTailoredSummary}
                jobTitle={jobTitle}
                companyName={companyName}
                location={location}
                remote={remote}
                jobDescription={jobDescription}
                colorTheme={selectedColorTheme}
                updatedSummary={tailoredSummary}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TailorPage;
