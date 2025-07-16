import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Experience } from "@/components/ExperienceForm";
import { Profile } from "@/types/profile";
import { Check, Plus, Replace, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BulletSyncOptionsProps {
  bullet: string;
  profile: Profile;
  onSyncToProfile: (experienceId: string, bulletIndex: number | null, newBullet: string) => void;
  onClose: () => void;
}

// Function to calculate similarity between two strings
const calculateSimilarity = (str1: string, str2: string): number => {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  const editDistance = getEditDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
};

// Simple edit distance calculation
const getEditDistance = (str1: string, str2: string): number => {
  const matrix = [];
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[str2.length][str1.length];
};

const BulletSyncOptions = ({ bullet, profile, onSyncToProfile, onClose }: BulletSyncOptionsProps) => {
  const { toast } = useToast();
  const [selectedExperience, setSelectedExperience] = useState<string>("");
  const [selectedAction, setSelectedAction] = useState<"replace" | "add">("add");
  const [selectedBulletIndex, setSelectedBulletIndex] = useState<number | null>(null);

  // Find similar bullets in profile
  const findSimilarBullets = () => {
    if (!profile.experiences || !bullet.trim()) return [];
    
    const similarBullets: Array<{
      experienceId: string;
      experienceTitle: string;
      bulletIndex: number;
      bulletText: string;
      similarity: number;
    }> = [];

    profile.experiences.forEach((exp) => {
      exp.bullets.forEach((existingBullet, index) => {
        const similarity = calculateSimilarity(bullet.toLowerCase(), existingBullet.toLowerCase());
        if (similarity > 0.6) { // 60% similarity threshold
          similarBullets.push({
            experienceId: exp.id,
            experienceTitle: exp.title,
            bulletIndex: index,
            bulletText: existingBullet,
            similarity,
          });
        }
      });
    });

    return similarBullets.sort((a, b) => b.similarity - a.similarity);
  };

  const similarBullets = findSimilarBullets();
  const experiences = profile.experiences || [];

  const handleSync = () => {
    if (selectedAction === "replace" && selectedBulletIndex !== null) {
      onSyncToProfile(selectedExperience, selectedBulletIndex, bullet);
      toast({
        title: "Bullet updated",
        description: "The bullet point has been updated in your profile.",
      });
    } else if (selectedAction === "add" && selectedExperience) {
      onSyncToProfile(selectedExperience, null, bullet);
      toast({
        title: "Bullet added",
        description: "The bullet point has been added to your profile.",
      });
    }
    onClose();
  };

  return (
    <Card className="mt-2 border-blue-200 bg-blue-50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm text-blue-800">Sync to Profile</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {similarBullets.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-blue-800">Similar bullets found:</h4>
            {similarBullets.slice(0, 3).map((similar, index) => (
              <div key={index} className="p-2 bg-white rounded border">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-gray-600">{similar.experienceTitle}</span>
                  <Badge variant="secondary" className="text-xs">
                    {Math.round(similar.similarity * 100)}% match
                  </Badge>
                </div>
                <p className="text-sm text-gray-700 mb-2">{similar.bulletText}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedAction("replace");
                    setSelectedExperience(similar.experienceId);
                    setSelectedBulletIndex(similar.bulletIndex);
                  }}
                  className="text-xs"
                >
                  <Replace className="h-3 w-3 mr-1" />
                  Replace this bullet
                </Button>
              </div>
            ))}
          </div>
        )}

        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-blue-800">Or add as new bullet:</label>
            <Select value={selectedExperience} onValueChange={setSelectedExperience}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select an experience" />
              </SelectTrigger>
              <SelectContent>
                {experiences.map((exp) => (
                  <SelectItem key={exp.id} value={exp.id}>
                    {exp.title} - {exp.company}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedExperience && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedAction("add");
                setSelectedBulletIndex(null);
              }}
              className="text-xs"
            >
              <Plus className="h-3 w-3 mr-1" />
              Add as new bullet
            </Button>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleSync}
            disabled={!selectedExperience || (selectedAction === "replace" && selectedBulletIndex === null)}
          >
            <Check className="h-4 w-4 mr-1" />
            Sync to Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BulletSyncOptions;