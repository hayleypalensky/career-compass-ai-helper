
import { Job } from "@/types/job";
import JobCard from "@/components/JobCard";

interface JobsListProps {
  jobs: Job[];
  isFullWidth: boolean;
  onUpdate: (job: Job) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
}

const JobsList = ({ jobs, isFullWidth, onUpdate, onArchive, onDelete }: JobsListProps) => {
  if (jobs.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No job applications found.</p>
      </div>
    );
  }

  return (
    <div className={isFullWidth ? "flex flex-col space-y-4" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"}>
      {jobs.map((job) => (
        <JobCard
          key={job.id}
          job={job}
          isFullWidth={isFullWidth}
          onUpdate={onUpdate}
          onArchive={onArchive}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default JobsList;
