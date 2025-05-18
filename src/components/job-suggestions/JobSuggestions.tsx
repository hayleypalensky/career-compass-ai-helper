
import { useState, useEffect } from "react";
import { Profile } from "@/types/profile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { calculateJobMatches, findSimilarJobs, sampleJobPostings, getSkillGaps } from "@/utils/jobMatcher";
import JobMatchCard from "./JobMatchCard";
import { ChevronDown, ChevronUp } from "lucide-react";

interface JobSuggestionsProps {
  profile: Profile;
}

const JobSuggestions = ({ profile }: JobSuggestionsProps) => {
  const [matchedJobs, setMatchedJobs] = useState(sampleJobPostings);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSimilarJobs, setShowSimilarJobs] = useState(false);
  const [expandedJob, setExpandedJob] = useState<number | null>(null);

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
    setExpandedJob(null);
  };

  // Toggle job details expansion
  const toggleJobDetails = (index: number) => {
    setExpandedJob(expandedJob === index ? null : index);
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
              <div key={index} className="border rounded-lg overflow-hidden">
                <div 
                  className="flex justify-between items-center p-4 cursor-pointer bg-slate-50"
                  onClick={() => toggleJobDetails(index)}
                >
                  <div>
                    <h3 className="font-medium">{job.title}</h3>
                    <p className="text-sm text-gray-600">{job.company}</p>
                  </div>
                  <div className="flex items-center">
                    <span className={`mr-2 px-2 py-1 rounded text-xs font-medium ${
                      job.match >= 70 ? 'bg-green-100 text-green-800' : 
                      job.match >= 40 ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      {job.match}% Match
                    </span>
                    {expandedJob === index ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                </div>
                
                {expandedJob === index && (
                  <div className="p-4">
                    <JobMatchCard job={job} profile={profile} />
                    
                    {/* Display skill gaps */}
                    <div className="mt-4">
                      <h4 className="text-sm font-semibold mb-2">Skills to Consider Adding:</h4>
                      <div className="flex flex-wrap gap-2">
                        {getSkillGaps(profile, job).map((skill, i) => (
                          <span key={i} className="bg-slate-100 text-slate-800 px-2 py-1 rounded text-xs">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
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
