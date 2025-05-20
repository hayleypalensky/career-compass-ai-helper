import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Job, JobStatus } from "@/types/job";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Trash2, Pencil } from "lucide-react";
import JobEditDialog from "./JobEditDialog";

interface JobCardProps {
  job: Job;
  isFullWidth?: boolean;
  onUpdate: (updatedJob: Job) => void;
  onArchive: (jobId: string) => void;
  onDelete: (jobId: string) => void;
}

const JobCard = ({ job, isFullWidth = false, onUpdate, onArchive, onDelete }: JobCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

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

  // Modified formatDate function to properly handle the date string
  const formatDate = (dateString: string) => {
    // If the date string is in YYYY-MM-DD format (from form inputs)
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      // Parse the date without timezone concerns
      const [year, month, day] = dateString.split('-').map(Number);
      return new Date(year, month - 1, day).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
    
    // Fallback to standard date parsing for other formats
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <>
      <Card className={`transition-all duration-200 ${job.status === "archived" ? "opacity-75" : ""} ${isFullWidth ? "w-full" : ""}`}>
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
          <div className="text-sm text-gray-500 mb-3 flex items-center justify-between flex-wrap gap-2">
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
                  <div className="text-gray-700 text-sm whitespace-pre-wrap">
                    {job.description}
                  </div>
                </div>
              )}

              <div>
                <h4 className="font-medium mb-1">Notes</h4>
                <div className="text-gray-700 text-sm whitespace-pre-wrap">
                  {job.notes || "No notes added yet."}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-1">Last Updated</h4>
                <p className="text-gray-700 text-sm">
                  {formatDate(job.updatedAt || job.appliedDate)}
                </p>
              </div>
            </div>
          )}

          <div className={`flex ${isFullWidth ? 'flex-wrap' : 'flex-wrap'} gap-2 pt-3`}>
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
            
            <div className={`${isFullWidth ? 'ml-auto' : 'ml-auto'} flex gap-2`}>
              <Button
                variant="outline"
                size="sm"
                className="border-blue-500 text-blue-600 hover:bg-blue-50"
                onClick={() => setEditDialogOpen(true)}
              >
                <Pencil className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                className="border-red-500 text-red-600 hover:bg-red-50"
                onClick={() => setDeleteDialogOpen(true)}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Job Application</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this job application for {job.title} at {job.company}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => onDelete(job.id)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <JobEditDialog 
        job={job}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSave={onUpdate}
      />
    </>
  );
};

export default JobCard;
