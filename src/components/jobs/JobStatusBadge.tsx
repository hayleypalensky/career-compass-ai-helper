
import { Badge } from "@/components/ui/badge";
import { JobStatus } from "@/types/job";

interface JobStatusBadgeProps {
  status: JobStatus;
}

const JobStatusBadge = ({ status }: JobStatusBadgeProps) => {
  const getStatusColor = (status: JobStatus) => {
    switch (status) {
      case "applied":
        return "bg-blue-500";
      case "interviewing":
        return "bg-gold-500";
      case "offered":
        return "bg-green-500";
      case "rejected":
        return "bg-gray-500";
      case "archived":
        return "bg-gray-400";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Badge className={getStatusColor(status)}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

export default JobStatusBadge;
