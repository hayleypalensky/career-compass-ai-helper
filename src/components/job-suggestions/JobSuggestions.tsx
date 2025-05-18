
import { useState, useEffect } from "react";
import { Profile } from "@/types/profile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { calculateJobMatches, findSimilarJobs, sampleJobPostings } from "@/utils/jobMatcher";
import JobMatchCard from "./JobMatchCard";

interface JobSuggestionsProps {
  profile: Profile;
}

const JobSuggestions = ({ profile }: JobSuggestionsProps) => {
  const [matchedJobs, setMatchedJobs] = useState(sampleJobPostings);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSimilarJobs, setShowSimilarJobs] = useState(false);

  // Initial job matching based on profile
  useEffect(() => {
    if (profile) {
      const matches = calculateJobMatches(profile);
      setMatchedJobs(matches);
    }
  }, [profile]);

  // Handle search for similar jobs
  const handleSearch = () => {
    if (searchTerm.trim()) {
      const similarJobs = findSimilarJobs(searchTerm, profile);
      setMatchedJobs(similarJobs);
      setShowSimilarJobs(true);
    }
  };

  // Reset to profile-based matches
  const resetMatches = () => {
    const matches = calculateJobMatches(profile);
    setMatchedJobs(matches);
    setSearchTerm("");
    setShowSimilarJobs(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Job Suggestions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-3">
            {showSimilarJobs 
              ? "Showing jobs similar to your search" 
              : "Based on your skills, here are some job matches that might be a good fit:"}
          </p>

          <div className="flex gap-3 mb-6">
            <Input 
              placeholder="Enter a job title to find similar roles" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleSearch} disabled={!searchTerm.trim()}>
              Find Similar Jobs
            </Button>
            {showSimilarJobs && (
              <Button variant="outline" onClick={resetMatches}>
                Reset
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {matchedJobs.length > 0 ? (
            matchedJobs.map((job, index) => (
              <JobMatchCard key={index} job={job} profile={profile} />
            ))
          ) : (
            <p className="text-center py-4 text-gray-500">
              No matching jobs found. Try a different search term.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default JobSuggestions;
