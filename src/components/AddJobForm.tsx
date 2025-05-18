
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Job } from "@/types/job";

interface AddJobFormProps {
  onAddJob: (job: Job) => void;
}

const AddJobForm = ({ onAddJob }: AddJobFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Omit<Job, "id" | "status" | "updatedAt">>({
    title: "",
    company: "",
    location: "",
    remote: false,
    description: "",
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
    
    const newJob: Job = {
      ...formData,
      id: crypto.randomUUID(),
      status: "applied",
      updatedAt: new Date().toISOString(),
    };
    
    onAddJob(newJob);
    
    // Reset the form
    setFormData({
      title: "",
      company: "",
      location: "",
      remote: false,
      description: "",
      notes: "",
      appliedDate: new Date().toISOString().split("T")[0],
    });
    
    toast({
      title: "Job added",
      description: `"${formData.title}" at "${formData.company}" has been added to your job tracker.`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Job Application</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
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
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full bg-navy-600 hover:bg-navy-700">
            Add Job Application
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddJobForm;
