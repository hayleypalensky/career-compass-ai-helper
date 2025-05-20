
import { Button } from "@/components/ui/button";
import { useProfile } from "@/context/ProfileContext";

const ProfileHeader = () => {
  const { handleResetProfile } = useProfile();

  return (
    <div className="flex justify-between items-center">
      <h1>Your Profile</h1>
      <Button 
        variant="ghost"
        onClick={handleResetProfile}
        className="text-sm text-red-600 hover:text-red-800 underline"
      >
        Reset Profile
      </Button>
    </div>
  );
};

export default ProfileHeader;
