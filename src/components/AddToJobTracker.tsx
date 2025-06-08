
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import { Briefcase, Plus } from "lucide-react";
import AddJobForm from "./jobs/AddJobForm";

interface AddToJobTrackerProps {
  jobTitle?: string;
  companyName?: string;
  location?: string;
  remote?: boolean;
  jobDescription?: string;
}

const AddToJobTracker = ({ 
  jobTitle = "", 
  companyName = "", 
  location = "",
  remote = false,
  jobDescription = "" 
}: AddToJobTrackerProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  const handleButtonClick = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to add jobs to your tracker.",
        variant: "destructive",
      });
      return;
    }
    setOpen(true);
  };

  return (
    <>
      <Button 
        variant="outline" 
        className="flex items-center gap-2" 
        onClick={handleButtonClick}
      >
        <Plus className="h-4 w-4" /> 
        <Briefcase className="h-4 w-4" />
        Add to Job Tracker
      </Button>

      <AddJobForm
        open={open}
        onOpenChange={setOpen}
        jobTitle={jobTitle}
        companyName={companyName}
        location={location}
        remote={remote}
        jobDescription={jobDescription}
      />
    </>
  );
};

export default AddToJobTracker;
