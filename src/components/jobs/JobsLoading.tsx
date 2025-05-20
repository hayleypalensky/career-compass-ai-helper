
import { Loader2 } from "lucide-react";

const JobsLoading = () => {
  return (
    <div className="flex flex-col justify-center items-center h-64">
      <Loader2 className="h-12 w-12 animate-spin text-navy-600" />
      <p className="mt-4 text-gray-500">Loading your job applications...</p>
    </div>
  );
};

export default JobsLoading;
