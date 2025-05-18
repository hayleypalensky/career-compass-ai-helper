
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import JobDescriptionAnalyzer from "@/components/JobDescriptionAnalyzer";
import TailorResume from "@/components/TailorResume";
import { Profile } from "@/types/profile";
import { Experience } from "@/components/ExperienceForm";
import { Skill } from "@/components/SkillsForm";

const TailorPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [relevantSkills, setRelevantSkills] = useState<string[]>([]);
  const [missingSkills, setMissingSkills] = useState<string[]>([]);
  const [showTailorSection, setShowTailorSection] = useState(false);

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

  const handleAnalysisComplete = (relevant: string[], missing: string[]) => {
    setRelevantSkills(relevant);
    setMissingSkills(missing);
    setShowTailorSection(true);
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

    toast({
      title: "Resume updated",
      description: "Your resume has been tailored based on the job description.",
    });
  };

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-12">
        <h1>Complete Your Profile First</h1>
        <p className="text-center text-gray-600 max-w-md">
          Please complete your profile information before tailoring your resume for job applications.
        </p>
        <Button onClick={() => navigate("/profile")}>Go to Profile</Button>
      </div>
    );
  }

  // Check if profile has minimum required information
  const isProfileIncomplete = 
    !profile.personalInfo.name || 
    !profile.personalInfo.email || 
    !profile.personalInfo.summary ||
    profile.experiences.length === 0 ||
    profile.skills.length === 0;

  if (isProfileIncomplete) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-12">
        <h1>Complete Your Profile</h1>
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-gray-600 mb-4">
              Your profile is incomplete. Please make sure you have added:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4">
              {!profile.personalInfo.name && <li>Your name</li>}
              {!profile.personalInfo.email && <li>Your email address</li>}
              {!profile.personalInfo.summary && <li>A professional summary</li>}
              {profile.experiences.length === 0 && <li>At least one experience</li>}
              {profile.skills.length === 0 && <li>Some skills</li>}
            </ul>
            <Button 
              onClick={() => navigate("/profile")}
              className="w-full"
            >
              Complete Your Profile
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1>Tailor Your Resume</h1>
      
      <div className="grid grid-cols-1 gap-8">
        <JobDescriptionAnalyzer 
          profile={profile} 
          onAnalysisComplete={handleAnalysisComplete} 
        />
        
        {showTailorSection && (
          <TailorResume
            profile={profile}
            relevantSkills={relevantSkills}
            missingSkills={missingSkills}
            onUpdateResume={handleUpdateResume}
          />
        )}
      </div>
    </div>
  );
};

export default TailorPage;
