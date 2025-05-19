
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Profile } from "@/types/profile";
import { useNavigate } from "react-router-dom";

interface IncompleteProfileCardProps {
  profile: Profile;
}

const IncompleteProfileCard = ({ profile }: IncompleteProfileCardProps) => {
  const navigate = useNavigate();

  // Check what's missing in the profile
  const missingItems = {
    name: !profile.personalInfo.name,
    email: !profile.personalInfo.email,
    summary: !profile.personalInfo.summary,
    experiences: profile.experiences.length === 0,
    skills: profile.skills.length === 0
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-12">
      <h1>Complete Your Profile</h1>
      <Card className="max-w-md">
        <CardContent className="pt-6">
          <p className="text-center text-gray-600 mb-4">
            Your profile is incomplete. Please make sure you have added:
          </p>
          <ul className="list-disc list-inside space-y-2 mb-4">
            {missingItems.name && <li>Your name</li>}
            {missingItems.email && <li>Your email address</li>}
            {missingItems.summary && <li>A professional summary</li>}
            {missingItems.experiences && <li>At least one experience</li>}
            {missingItems.skills && <li>Some skills</li>}
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
};

export default IncompleteProfileCard;
