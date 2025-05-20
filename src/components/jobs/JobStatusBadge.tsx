
import { Badge } from "@/components/ui/badge";
import { JobStatus } from "@/types/job";

interface JobStatusBadgeProps {
  status: JobStatus;
}

const JobStatusBadge = ({ status }: JobStatusBadgeProps) => {
  const getStatusColor = (status: JobStatus) => {
    switch (status) {
      case "applied":
        return "bg-blue-500 hover:bg-blue-600";
      case "interviewing":
        return "bg-amber-500 hover:bg-amber-600";
      case "offered":
        return "bg-green-500 hover:bg-green-600";
      case "rejected":
        return "bg-red-500 hover:bg-red-600";
      case "archived":
        return "bg-gray-500 hover:bg-gray-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  return (
    <Badge className={getStatusColor(status)}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

export default JobStatusBadge;
