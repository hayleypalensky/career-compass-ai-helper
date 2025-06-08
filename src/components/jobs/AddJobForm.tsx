
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import JobAttachments from "./JobAttachments";
import { useAddJobForm } from "@/hooks/useAddJobForm";

interface AddJobFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobTitle?: string;
  companyName?: string;
  location?: string;
  remote?: boolean;
  jobDescription?: string;
}

const AddJobForm = ({
  open,
  onOpenChange,
  jobTitle,
  companyName,
  location,
  remote,
  jobDescription
}: AddJobFormProps) => {
  const {
    formData,
    attachments,
    setAttachments,
    isSubmitting,
    handleChange,
    handleSwitchChange,
    handleSubmit,
    resetForm
  } = useAddJobForm({
    jobTitle,
    companyName,
    location,
    remote,
    jobDescription,
    onSuccess: () => {
      onOpenChange(false);
      resetForm();
    }
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
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
              className="font-mono text-sm"
              style={{ whiteSpace: "pre-wrap" }}
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
              className="font-mono text-sm"
              style={{ whiteSpace: "pre-wrap" }}
            />
          </div>

          <div className="space-y-2">
            <JobAttachments
              jobId="temp-id"
              attachments={attachments}
              onAttachmentsChange={setAttachments}
            />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add to Job Tracker"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddJobForm;
