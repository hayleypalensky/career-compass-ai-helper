
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Job, JobStatus } from "@/types/job";

interface JobCardProps {
  job: Job;
  onUpdate: (updatedJob: Job) => void;
  onArchive: (jobId: string) => void;
}

const JobCard = ({ job, onUpdate, onArchive }: JobCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleStatusChange = (newStatus: JobStatus) => {
    onUpdate({
      ...job,
      status: newStatus,
      updatedAt: new Date().toISOString(),
    });
  };

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card className={`transition-all duration-200 ${job.status === "archived" ? "opacity-75" : ""}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <CardTitle>{job.title}</CardTitle>
            <p className="text-gray-600">{job.company}</p>
          </div>
          <Badge className={getStatusColor(job.status)}>
            {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-gray-500 mb-3 flex items-center justify-between">
          <span>
            {job.location}
            {job.remote && " (Remote)"}
          </span>
          <span>Applied: {formatDate(job.appliedDate)}</span>
        </div>

        {isExpanded && (
          <div className="space-y-3 my-3 border-t border-b py-3">
            {job.description && (
              <div>
                <h4 className="font-medium mb-1">Description</h4>
                <p className="text-gray-700 text-sm">{job.description}</p>
              </div>
            )}

            <div>
              <h4 className="font-medium mb-1">Notes</h4>
              <p className="text-gray-700 text-sm">
                {job.notes || "No notes added yet."}
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-1">Last Updated</h4>
              <p className="text-gray-700 text-sm">
                {formatDate(job.updatedAt || job.appliedDate)}
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2 pt-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? "Show Less" : "Show More"}
          </Button>

          {job.status !== "archived" && (
            <>
              {job.status !== "interviewing" && (
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gold-500 text-gold-600 hover:bg-gold-50"
                  onClick={() => handleStatusChange("interviewing")}
                >
                  Mark Interviewing
                </Button>
              )}

              {job.status !== "offered" && (
                <Button
                  variant="outline"
                  size="sm"
                  className="border-green-500 text-green-600 hover:bg-green-50"
                  onClick={() => handleStatusChange("offered")}
                >
                  Mark Offered
                </Button>
              )}

              {job.status !== "rejected" && (
                <Button
                  variant="outline"
                  size="sm"
                  className="border-red-500 text-red-600 hover:bg-red-50"
                  onClick={() => handleStatusChange("rejected")}
                >
                  Mark Rejected
                </Button>
              )}

              <Button
                variant="outline"
                size="sm"
                className="border-gray-500 text-gray-600 hover:bg-gray-50"
                onClick={() => onArchive(job.id)}
              >
                Archive
              </Button>
            </>
          )}

          {job.status === "archived" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleStatusChange("applied")}
            >
              Unarchive
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default JobCard;
