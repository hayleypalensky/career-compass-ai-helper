
import { JobStatus } from "@/types/job";
import { Badge } from "@/components/ui/badge";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

interface JobStatusCountsProps {
  statusCounts: Record<JobStatus, number>;
  activeTab: JobStatus;
  onTabChange: (value: JobStatus) => void;
}

const JobStatusCounts = ({ 
  statusCounts, 
  activeTab, 
  onTabChange 
}: JobStatusCountsProps) => {
  return (
    <TabsList className="flex-wrap">
      <TabsTrigger value="applied" onClick={() => onTabChange("applied")}>
        Applied
        <Badge variant="secondary" className="ml-2 bg-slate-200">
          {statusCounts.applied}
        </Badge>
      </TabsTrigger>
      <TabsTrigger value="interviewing" onClick={() => onTabChange("interviewing")}>
        Interviewing
        <Badge variant="secondary" className="ml-2 bg-slate-200">
          {statusCounts.interviewing}
        </Badge>
      </TabsTrigger>
      <TabsTrigger value="offered" onClick={() => onTabChange("offered")}>
        Offered
        <Badge variant="secondary" className="ml-2 bg-slate-200">
          {statusCounts.offered}
        </Badge>
      </TabsTrigger>
      <TabsTrigger value="rejected" onClick={() => onTabChange("rejected")}>
        Rejected
        <Badge variant="secondary" className="ml-2 bg-slate-200">
          {statusCounts.rejected}
        </Badge>
      </TabsTrigger>
      <TabsTrigger value="archived" onClick={() => onTabChange("archived")}>
        Archived
        <Badge variant="secondary" className="ml-2 bg-slate-200">
          {statusCounts.archived}
        </Badge>
      </TabsTrigger>
    </TabsList>
  );
};

export default JobStatusCounts;
