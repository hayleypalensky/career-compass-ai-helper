
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { JobAttachment, uploadJobAttachment, deleteJobAttachment, getFilePathFromUrl } from "@/services/attachmentService";
import { Paperclip, Upload, X, Download, FileText, Image } from "lucide-react";
import { formatFileSize } from "@/utils/fileUtils";

interface JobAttachmentsProps {
  jobId: string;
  attachments: JobAttachment[];
  onAttachmentsChange: (attachments: JobAttachment[]) => void;
}

const JobAttachments = ({ jobId, attachments, onAttachmentsChange }: JobAttachmentsProps) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const uploadPromises = Array.from(files).map(file => uploadJobAttachment(jobId, file));
      const newAttachments = await Promise.all(uploadPromises);
      
      const updatedAttachments = [...attachments, ...newAttachments];
      onAttachmentsChange(updatedAttachments);
      
      toast({
        title: "Files uploaded",
        description: `${files.length} file(s) uploaded successfully.`,
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: "Failed to upload files. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      // Reset input
      event.target.value = '';
    }
  };

  const handleDeleteAttachment = async (attachment: JobAttachment) => {
    try {
      const filePath = getFilePathFromUrl(attachment.url);
      await deleteJobAttachment(filePath);
      
      const updatedAttachments = attachments.filter(a => a.id !== attachment.id);
      onAttachmentsChange(updatedAttachments);
      
      toast({
        title: "File deleted",
        description: `${attachment.name} has been deleted.`,
      });
    } catch (error) {
      console.error("Delete error:", error);
      toast({
        title: "Delete failed",
        description: "Failed to delete file. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) {
      return <Image className="h-4 w-4" />;
    }
    return <FileText className="h-4 w-4" />;
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Paperclip className="h-4 w-4" />
        <span className="text-sm font-medium">Attachments</span>
        <span className="text-xs text-gray-500">({attachments.length})</span>
      </div>

      {/* Upload Section */}
      <div className="flex items-center gap-2">
        <Input
          type="file"
          multiple
          onChange={handleFileUpload}
          disabled={isUploading}
          className="text-sm"
          accept="image/*,.pdf,.doc,.docx,.txt"
        />
        <Button
          size="sm"
          variant="outline"
          disabled={isUploading}
          className="flex items-center gap-1"
        >
          <Upload className="h-3 w-3" />
          {isUploading ? "Uploading..." : "Upload"}
        </Button>
      </div>

      {/* Attachments List */}
      {attachments.length > 0 && (
        <div className="space-y-2">
          {attachments.map((attachment) => (
            <div
              key={attachment.id}
              className="flex items-center justify-between p-2 bg-gray-50 rounded border"
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                {getFileIcon(attachment.type)}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{attachment.name}</p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(attachment.size)} • {new Date(attachment.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => window.open(attachment.url, '_blank')}
                  className="h-8 w-8 p-0"
                >
                  <Download className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDeleteAttachment(attachment)}
                  className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobAttachments;
