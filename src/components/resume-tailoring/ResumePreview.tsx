
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
    <div className="space-y-8" id="resume-content">
      <div className="p-6 border rounded-lg bg-white">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">{profile.personalInfo.name}</h2>
          
          <div className="flex flex-wrap gap-4 text-sm mb-2">
            {profile.personalInfo.email && (
              <span className="text-gray-600">{profile.personalInfo.email}</span>
            )}
            {profile.personalInfo.phone && (
              <span className="text-gray-600">{profile.personalInfo.phone}</span>
            )}
            {/* Only render website if it exists as a property on the PersonalInfo object */}
            {'website' in profile.personalInfo && profile.personalInfo.website && (
              <span className="text-gray-600">{String(profile.personalInfo.website)}</span>
            )}
            {profile.personalInfo.location && (
              <span className="text-gray-600">{profile.personalInfo.location}</span>
            )}
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Professional Summary</h3>
          <p className="text-gray-800">{profile.personalInfo.summary}</p>
        </div>
        
        {/* Experience section */}
        {experiences.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold border-b pb-1 mb-4">Experience</h3>
            <div className="space-y-4">
              {experiences.map((exp) => (
                <div key={exp.id} className="mb-4">
                  <div className="flex justify-between mb-1">
                    <h4 className="font-medium">{exp.title}</h4>
                    <span className="text-gray-600">{exp.startDate} - {exp.endDate || 'Present'}</span>
                  </div>
                  <p className="text-gray-700 mb-2">{exp.company}{exp.location ? `, ${exp.location}` : ''}</p>
                  <ul className="list-disc pl-5 space-y-1">
                    {exp.bullets.map((bullet: string, idx: number) => (
                      <li key={idx} className="text-gray-800">{bullet}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Education section */}
        {profile.education && profile.education.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold border-b pb-1 mb-4">Education</h3>
            <div className="space-y-4">
              {profile.education.map((edu) => (
                <div key={edu.id} className="mb-2">
                  <div className="flex justify-between mb-1">
                    <h4 className="font-medium">{edu.degree}</h4>
                    <span className="text-gray-600">{edu.startDate} - {edu.endDate || 'Present'}</span>
                  </div>
                  <p className="text-gray-700">{edu.school}
                  {/* Only check for location if it exists as a property on the Education object */}
                  {'location' in edu && edu.location ? `, ${String(edu.location)}` : ''}</p>
                  {edu.description && <p className="text-gray-600 mt-1">{edu.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Skills section */}
        <div>
          <h3 className="text-lg font-semibold border-b pb-1 mb-4">Skills</h3>
          <div className="flex flex-wrap gap-2 mb-2">
            {profile.skills.map((skill) => (
              <span 
                key={skill.id} 
                className={`px-3 py-1 rounded-full text-sm ${
                  relevantSkills.includes(skill.name) 
                    ? 'bg-green-100 text-green-800 font-medium' 
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {skill.name}
              </span>
            ))}
            {skillsToAdd.map((skill) => (
              <span key={skill} className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 font-medium">
                {skill}*
              </span>
            ))}
          </div>
          {skillsToAdd.length > 0 && (
            <p className="text-sm text-gray-500">* Skills added based on job requirements</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumePreview;
