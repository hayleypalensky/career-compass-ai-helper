
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Job } from "@/types/job";
import { Briefcase, Plus } from "lucide-react";

interface AddToJobTrackerProps {
  jobTitle?: string;
  companyName?: string;
  jobDescription?: string;
}

const AddToJobTracker = ({ jobTitle = "", companyName = "", jobDescription = "" }: AddToJobTrackerProps) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<Omit<Job, "id" | "status" | "updatedAt">>({
    title: jobTitle,
    company: companyName,
    location: "",
    remote: false,
    description: jobDescription,
    notes: "",
    appliedDate: new Date().toISOString().split("T")[0],
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, remote: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Get existing jobs
    const savedJobs = localStorage.getItem("resumeJobs");
    let jobs: Job[] = [];
    
    if (savedJobs) {
      try {
        jobs = JSON.parse(savedJobs);
      } catch (error) {
        console.error("Error parsing jobs from localStorage:", error);
      }
    }
    
    // Ensure the date is preserved correctly without timezone issues
    const appliedDate = formData.appliedDate;
    
    // Create new job
    const newJob: Job = {
      ...formData,
      // Use the exact date string provided by the user
      appliedDate: appliedDate,
      id: crypto.randomUUID(),
      status: "applied",
      updatedAt: new Date().toISOString(),
    };
    
    // Add job to list and save
    jobs.push(newJob);
    localStorage.setItem("resumeJobs", JSON.stringify(jobs));
    
    // Close dialog and show confirmation
    setOpen(false);
    toast({
      title: "Job added to tracker",
      description: `"${formData.title}" at "${formData.company}" has been added to your job tracker.`,
    });
  };

  return (
    <>
      <Button 
        variant="outline" 
        className="flex items-center gap-2" 
        onClick={() => setOpen(true)}
      >
        <Plus className="h-4 w-4" /> 
        <Briefcase className="h-4 w-4" />
        Add to Job Tracker
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Job to Tracker</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label htmlFor="title">Job Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Software Engineer"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Acme Inc."
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="San Francisco, CA"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="appliedDate">Application Date</Label>
                <Input
                  id="appliedDate"
                  name="appliedDate"
                  type="date"
                  value={formData.appliedDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="remote"
                checked={formData.remote}
                onCheckedChange={handleSwitchChange}
              />
              <Label htmlFor="remote">Remote position</Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Job Description Summary</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Brief summary of the job description..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Any notes about the application, contacts, etc."
                rows={2}
              />
            </div>

            <DialogFooter>
              <Button type="submit">Add to Job Tracker</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddToJobTracker;
