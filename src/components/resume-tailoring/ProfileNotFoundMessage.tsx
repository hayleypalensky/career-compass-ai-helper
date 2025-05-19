
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const ProfileNotFoundMessage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-12">
      <h1>Complete Your Profile First</h1>
      <p className="text-center text-gray-600 max-w-md">
        Please complete your profile information before tailoring your resume for job applications.
      </p>
      <Button onClick={() => navigate("/profile")}>Go to Profile</Button>
    </div>
  );
};

export default ProfileNotFoundMessage;
