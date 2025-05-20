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
import { useToast } from "@/hooks/use-toast";
import { Job } from "@/types/job";
import { Plus } from "lucide-react";

interface AddJobDialogProps {
  onAddJob: (job: Job) => void;
}

const AddJobDialog = ({ onAddJob }: AddJobDialogProps) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [newJob, setNewJob] = useState<Omit<Job, "id" | "status" | "updatedAt">>({
    title: "",
    company: "",
    location: "",
    remote: false,
    description: "",
    notes: "",
    appliedDate: new Date().toISOString().split('T')[0],
  });

  const resetForm = () => {
    setNewJob({
      title: "",
      company: "",
      location: "",
      remote: false,
      description: "",
      notes: "",
      appliedDate: new Date().toISOString().split('T')[0],
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewJob((prev) => ({ ...prev, [name]: value }));
  };

  const handleRemoteChange = (checked: boolean) => {
    setNewJob((prev) => ({ ...prev, remote: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!newJob.title.trim() || !newJob.company.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    // Create new job - preserve the exact date string from the input
    // without any timezone conversion or manipulation
    const jobToAdd: Job = {
      ...newJob,
      id: crypto.randomUUID(),
      status: "applied",
      updatedAt: new Date().toISOString(),
    };
    
    // Add the job and close dialog
    onAddJob(jobToAdd);
    setOpen(false);
    resetForm();
    
    toast({
      title: "Job application added",
      description: `"${jobToAdd.title}" at "${jobToAdd.company}" has been added.`,
    });
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} className="w-full">
        <Plus className="mr-2 h-4 w-4" /> Add New Job Application
      </Button>
      
      <Dialog open={open} onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) resetForm();
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Job Application</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Job Title *</Label>
              <Input
                id="title"
                name="title"
                value={newJob.title}
                onChange={handleInputChange}
                placeholder="Software Engineer"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="company">Company *</Label>
              <Input
                id="company"
                name="company"
                value={newJob.company}
                onChange={handleInputChange}
                placeholder="Acme Inc."
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                value={newJob.location}
                onChange={handleInputChange}
                placeholder="San Francisco, CA"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="remote"
                checked={newJob.remote}
                onCheckedChange={handleRemoteChange}
              />
              <Label htmlFor="remote">Remote Position</Label>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="appliedDate">Application Date *</Label>
              <Input
                id="appliedDate"
                name="appliedDate"
                type="date"
                value={newJob.appliedDate}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Job Description</Label>
              <Textarea
                id="description"
                name="description"
                value={newJob.description || ""}
                onChange={handleInputChange}
                placeholder="Paste the full job description here..."
                rows={4}
                className="font-mono text-sm"
                style={{ whiteSpace: "pre-wrap" }}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                value={newJob.notes || ""}
                onChange={handleInputChange}
                placeholder="Any notes about the application, contacts, etc."
                rows={3}
                className="font-mono text-sm"
                style={{ whiteSpace: "pre-wrap" }}
              />
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Job</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddJobDialog;
