
import { useState } from "react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Job } from "@/types/job";
import { useToast } from "@/hooks/use-toast";

interface JobEditDialogProps {
  job: Job;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updatedJob: Job) => void;
}

const JobEditDialog = ({ job, open, onOpenChange, onSave }: JobEditDialogProps) => {
  const { toast } = useToast();
  const [editedJob, setEditedJob] = useState<Job>({ ...job });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedJob((prev) => ({ ...prev, [name]: value }));
  };

  const handleRemoteChange = (checked: boolean) => {
    setEditedJob((prev) => ({ ...prev, remote: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!editedJob.title.trim() || !editedJob.company.trim() || !editedJob.location.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    // Update the job with the current timestamp
    const updatedJob = {
      ...editedJob,
      updatedAt: new Date().toISOString(),
    };
    
    onSave(updatedJob);
    onOpenChange(false);
    
    toast({
      title: "Job updated",
      description: `"${updatedJob.title}" has been updated successfully.`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Job Application</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Job Title *</Label>
            <Input
              id="title"
              name="title"
              value={editedJob.title}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="company">Company *</Label>
            <Input
              id="company"
              name="company"
              value={editedJob.company}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">Location *</Label>
            <Input
              id="location"
              name="location"
              value={editedJob.location}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="remote"
              checked={editedJob.remote}
              onCheckedChange={handleRemoteChange}
            />
            <Label htmlFor="remote">Remote Position</Label>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Job Description</Label>
            <Textarea
              id="description"
              name="description"
              value={editedJob.description || ""}
              onChange={handleInputChange}
              rows={4}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              value={editedJob.notes || ""}
              onChange={handleInputChange}
              rows={3}
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default JobEditDialog;
