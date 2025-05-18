
import { Profile } from "@/types/profile";

interface ResumePreviewProps {
  profile: Profile;
  experiences: any[];
  skillsToAdd: string[];
  relevantSkills: string[];
}

const ResumePreview = ({ 
  profile, 
  experiences, 
  skillsToAdd, 
  relevantSkills 
}: ResumePreviewProps) => {
  return (
    <div className="space-y-4" id="resume-content">
      <div className="p-6 border rounded-lg bg-white max-w-[800px] mx-auto">
        {/* Header section with better styling and layout */}
        <div className="mb-4 pb-3 border-b">
          <h2 className="text-2xl font-bold mb-2 text-purple-800">{profile.personalInfo.name}</h2>
          
          <div className="flex flex-wrap gap-2 text-sm">
            {profile.personalInfo.email && (
              <span className="text-gray-700 flex items-center">
                <span>📧</span>
                <span className="ml-1">{profile.personalInfo.email}</span>
              </span>
            )}
            {profile.personalInfo.phone && (
              <span className="text-gray-700 flex items-center">
                <span>📱</span>
                <span className="ml-1">{profile.personalInfo.phone}</span>
              </span>
            )}
            {'website' in profile.personalInfo && profile.personalInfo.website && (
              <span className="text-gray-700 flex items-center">
                <span>🔗</span>
                <span className="ml-1">{String(profile.personalInfo.website)}</span>
              </span>
            )}
            {profile.personalInfo.location && (
              <span className="text-gray-700 flex items-center">
                <span>📍</span>
                <span className="ml-1">{profile.personalInfo.location}</span>
              </span>
            )}
          </div>
        </div>
        
        {/* Professional Summary - with more compact spacing */}
        <div className="mb-4">
          <h3 className="text-base font-semibold mb-1 text-purple-700 border-b pb-1">Professional Summary</h3>
          <p className="text-gray-800 text-sm">{profile.personalInfo.summary}</p>
        </div>
        
        {/* Education section - moved to after the professional summary */}
        {profile.education && profile.education.length > 0 && (
          <div className="mb-4">
            <h3 className="text-base font-semibold border-b pb-1 mb-2 text-purple-700">Education</h3>
            <div className="space-y-2">
              {profile.education.map((edu) => (
                <div key={edu.id} className="mb-1">
                  <div className="flex justify-between mb-0.5">
                    <h4 className="font-medium text-sm">{edu.degree}</h4>
                    <span className="text-gray-600 text-xs">{edu.startDate} - {edu.endDate || 'Present'}</span>
                  </div>
                  <p className="text-gray-700 text-sm">
                    {edu.school}
                    {'location' in edu && edu.location ? `, ${String(edu.location)}` : ''}
                  </p>
                  {edu.description && <p className="text-gray-600 text-xs mt-0.5">{edu.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Skills section - Always display this section */}
        <div className="mb-4">
          <h3 className="text-base font-semibold border-b pb-1 mb-2 text-purple-700">Skills</h3>
          <div className="flex flex-wrap gap-1 mb-1">
            {profile.skills.map((skill) => (
              <span 
                key={skill.id} 
                className={`px-2 py-0.5 rounded text-xs ${
                  relevantSkills.includes(skill.name) 
                    ? 'bg-green-100 text-green-800 font-medium' 
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {skill.name}
              </span>
            ))}
            {skillsToAdd.map((skill) => (
              <span key={skill} className="px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-800 font-medium">
                {skill}*
              </span>
            ))}
          </div>
          {skillsToAdd.length > 0 && (
            <p className="text-[10px] text-gray-500">* Skills added based on job requirements</p>
          )}
        </div>
        
        {/* Experience section - with improved bullet formatting */}
        {experiences.length > 0 && (
          <div className="mb-4">
            <h3 className="text-base font-semibold border-b pb-1 mb-2 text-purple-700">Experience</h3>
            <div className="space-y-3">
              {experiences.map((exp) => (
                <div key={exp.id} className="mb-2">
                  <div className="flex justify-between mb-0.5">
                    <h4 className="font-medium text-sm">{exp.title}</h4>
                    <span className="text-gray-600 text-xs">{exp.startDate} - {exp.endDate || 'Present'}</span>
                  </div>
                  <p className="text-gray-700 text-sm mb-1">{exp.company}{exp.location ? `, ${exp.location}` : ''}</p>
                  <ul className="text-xs space-y-0.5 ml-4">
                    {exp.bullets.map((bullet: string, idx: number) => (
                      <li key={idx} className="text-gray-800 relative pl-3 before:content-['•'] before:absolute before:left-0 before:top-0 before:text-gray-600">
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumePreview;
