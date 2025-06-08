
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Profile } from "@/types/profile";
import { aiService } from "@/services/aiService";
import { FileText, Copy, Download } from "lucide-react";
import jsPDF from "jspdf";

interface CoverLetterGeneratorProps {
  profile: Profile;
  jobDescription: string;
  jobTitle: string;
  companyName: string;
  relevantSkills: string[];
}

const CoverLetterGenerator = ({
  profile,
  jobDescription,
  jobTitle,
  companyName,
  relevantSkills,
}: CoverLetterGeneratorProps) => {
  const { toast } = useToast();
  const [coverLetter, setCoverLetter] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);

  const generateCoverLetter = async () => {
    if (!jobDescription.trim()) {
      toast({
        title: "Job description required",
        description: "Please enter a job description to generate a cover letter.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsGenerating(true);
      
      console.log('Generating cover letter for:', {
        jobTitle,
        companyName,
        hasJobDescription: !!jobDescription,
        relevantSkillsCount: relevantSkills.length
      });

      const generatedLetter = await aiService.generateCoverLetter(
        profile,
        jobDescription,
        jobTitle,
        companyName,
        relevantSkills
      );

      setCoverLetter(generatedLetter);
      
      toast({
        title: "Cover letter generated",
        description: "Your AI-generated cover letter is ready for review.",
      });
      
    } catch (error) {
      console.error('Error generating cover letter:', error);
      toast({
        title: "Error generating cover letter",
        description: "There was an error generating your cover letter. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(coverLetter);
      toast({
        title: "Copied to clipboard",
        description: "Cover letter has been copied to your clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy to clipboard. Please select and copy manually.",
        variant: "destructive",
      });
    }
  };

  const downloadAsPdf = () => {
    try {
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "in",
        format: "letter"
      });

      // Set font
      pdf.setFont("helvetica");
      pdf.setFontSize(12);

      // Page margins
      const leftMargin = 1;
      const rightMargin = 1;
      const topMargin = 1;
      const pageWidth = 8.5;
      const maxWidth = pageWidth - leftMargin - rightMargin;

      // Split text into lines that fit the page width
      const lines = pdf.splitTextToSize(coverLetter, maxWidth);
      
      // Add text to PDF
      pdf.text(lines, leftMargin, topMargin);

      // Generate filename
      let fileName = "";
      if (profile.personalInfo.name && companyName) {
        fileName = `${profile.personalInfo.name} Cover Letter - ${companyName}.pdf`;
      } else if (profile.personalInfo.name) {
        fileName = `${profile.personalInfo.name} Cover Letter.pdf`;
      } else if (companyName) {
        fileName = `Cover Letter - ${companyName}.pdf`;
      } else {
        fileName = "Cover Letter.pdf";
      }

      pdf.save(fileName);

      toast({
        title: "PDF downloaded",
        description: "Your cover letter has been downloaded as a PDF.",
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Download failed",
        description: "Failed to download PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          AI Cover Letter Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-2">
          <p className="text-sm text-muted-foreground">
            Generate a personalized cover letter based on your profile and the job description.
          </p>
          <Button
            onClick={generateCoverLetter}
            disabled={isGenerating || !jobDescription.trim()}
            className="w-full"
          >
            {isGenerating ? "Generating Cover Letter..." : "Generate AI Cover Letter"}
          </Button>
        </div>

        {coverLetter && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Generated Cover Letter</h4>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyToClipboard}
                  className="flex items-center gap-1"
                >
                  <Copy className="h-4 w-4" />
                  Copy
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={downloadAsPdf}
                  className="flex items-center gap-1"
                >
                  <Download className="h-4 w-4" />
                  Download PDF
                </Button>
              </div>
            </div>
            <Textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              className="min-h-[400px] font-mono text-sm"
              placeholder="Your generated cover letter will appear here..."
            />
            <p className="text-xs text-muted-foreground">
              You can edit the generated cover letter above before copying or downloading.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CoverLetterGenerator;
