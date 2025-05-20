
import { ProfileProvider } from "@/context/ProfileContext";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileTabs from "@/components/profile/ProfileTabs";
import ProfileLoading from "@/components/profile/ProfileLoading";
import { useProfile } from "@/context/ProfileContext";

// Inner component that uses the context
const ProfileContent = () => {
  const { isLoading } = useProfile();

  if (isLoading) {
    return <ProfileLoading />;
  }

  return (
    <div className="space-y-8">
      <ProfileHeader />
      
      <p className="text-gray-600">
        Complete your profile information to create your base resume for job applications.
      </p>

      <ProfileTabs />
    </div>
  );
};

// Main profile page component that provides the context
const ProfilePage = () => {
  return (
    <ProfileProvider>
      <ProfileContent />
    </ProfileProvider>
  );
};

export default ProfilePage;
