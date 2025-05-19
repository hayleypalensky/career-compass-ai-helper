
import { Profile } from "@/types/profile";
import { Skill } from "@/components/SkillsForm";
import { ResumeColorTheme, colorThemes } from "./ResumeColorSelector";

interface ResumePreviewProps {
  profile: Profile;
  experiences: any[];
  skillsToAdd: string[];
  skillsToRemove: string[];
  relevantSkills: string[];
  colorTheme?: string;
}

const ResumePreview = ({ 
  profile, 
  experiences, 
  skillsToAdd,
  skillsToRemove,
  relevantSkills,
  colorTheme = "purple"
}: ResumePreviewProps) => {
  // Find the selected theme object
  const theme: ResumeColorTheme = colorThemes.find(theme => theme.id === colorTheme) || colorThemes[0];
  
  // Helper function to format dates to show month before year
  const formatDate = (dateString: string): string => {
    if (!dateString) return 'Present';
    
    try {
      // Input format is YYYY-MM
      const [year, month] = dateString.split('-');
      
      // Convert month number to month name
      const monthNames = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
      ];
      
      const monthIndex = parseInt(month, 10) - 1;
      const monthName = monthNames[monthIndex];
      
      // Return formatted date (e.g., "Jan 2023")
      return `${monthName} ${year}`;
    } catch (error) {
      // If any error in parsing, return the original string
      return dateString;
    }
  };

  // Format phone number to include hyphens
  const formatPhoneNumber = (phone: string | undefined): string => {
    if (!phone) return '';
    
    // Remove any existing formatting (spaces, parentheses, hyphens, etc.)
    const cleaned = phone.replace(/\D/g, '');
    
    // Format as XXX-XXX-XXXX
    if (cleaned.length === 10) {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
    }
    
    // If it's not exactly 10 digits, return as is with hyphens where possible
    if (cleaned.length > 6) {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    } else if (cleaned.length > 3) {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
    }
    
    return cleaned;
  };

  // Filter out skills that are marked for removal
  const filteredSkills = profile.skills.filter(skill => 
    !skillsToRemove.includes(skill.id)
  );

  return (
    <div className="space-y-4" id="resume-content">
      <div className="p-8 border rounded-lg bg-white max-w-[800px] mx-auto resume-inner">
        {/* Header section with simpler styling and portfolio website */}
        <div className="mb-6 pb-3 border-b">
          <h2 className={`text-2xl font-bold mb-3 ${theme.headingColor}`}>{profile.personalInfo.name}</h2>
          
          <div className="flex flex-wrap gap-3 text-sm">
            {profile.personalInfo.email && (
              <span className="text-gray-700 flex items-center">
                <span>Email:</span>
                <span className="ml-1">{profile.personalInfo.email}</span>
              </span>
            )}
            {profile.personalInfo.phone && (
              <span className="text-gray-700 flex items-center">
                <span>Phone:</span>
                <span className="ml-1">{formatPhoneNumber(profile.personalInfo.phone)}</span>
              </span>
            )}
            {profile.personalInfo.website && (
              <span className="text-gray-700 flex items-center">
                <span>Website:</span>
                <span className="ml-1">{profile.personalInfo.website}</span>
              </span>
            )}
            {profile.personalInfo.location && (
              <span className="text-gray-700 flex items-center">
                <span>Location:</span>
                <span className="ml-1">{profile.personalInfo.location}</span>
              </span>
            )}
          </div>
        </div>
        
        {/* Professional Summary - with more compact spacing */}
        <div className="mb-6">
          <h3 className={`text-base font-semibold mb-2 ${theme.headingColor} border-b pb-1`}>Professional Summary</h3>
          <p className="text-gray-800 text-sm">{profile.personalInfo.summary}</p>
        </div>
        
        {/* Education section - moved to after the professional summary */}
        {profile.education && profile.education.length > 0 && (
          <div className="mb-6">
            <h3 className={`text-base font-semibold border-b pb-1 mb-3 ${theme.headingColor}`}>Education</h3>
            <div className="space-y-3">
              {profile.education.map((edu) => (
                <div key={edu.id} className="mb-2">
                  <div className="flex justify-between mb-1">
                    <h4 className="font-medium text-sm">{edu.degree} in {edu.field}</h4>
                    <span className="text-gray-600 text-xs">{formatDate(edu.startDate)} - {edu.endDate ? formatDate(edu.endDate) : 'Present'}</span>
                  </div>
                  <p className="text-gray-700 text-sm">
                    {edu.school}
                    {'location' in edu && edu.location ? `, ${String(edu.location)}` : ''}
                  </p>
                  {edu.description && <p className="text-gray-600 text-xs mt-1">{edu.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Experience section - Filter out any empty bullet points */}
        {experiences.length > 0 && (
          <div className="mb-6">
            <h3 className={`text-base font-semibold border-b pb-1 mb-3 ${theme.headingColor}`}>Experience</h3>
            <div className="space-y-4">
              {experiences.map((exp) => (
                <div key={exp.id} className="mb-3">
                  <div className="flex justify-between mb-1">
                    <h4 className="font-medium text-sm">{exp.title}</h4>
                    <span className="text-gray-600 text-xs">{formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : 'Present'}</span>
                  </div>
                  <p className="text-gray-700 text-sm mb-2">{exp.company}{exp.location ? `, ${exp.location}` : ''}</p>
                  <ul className="text-xs space-y-1 ml-4">
                    {exp.bullets
                      .filter((bullet: string) => bullet.trim() !== "") // Filter out empty bullets
                      .map((bullet: string, idx: number) => (
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
        
        {/* Skills section - Always visible with explicit display styles */}
        <div className="mb-2 skills-wrapper" style={{ 
          display: "block", 
          width: "100%",
          visibility: "visible",
          opacity: 1
        }}>
          <h3 className={`text-base font-semibold border-b pb-1 mb-3 ${theme.headingColor}`}>Skills</h3>
          <div className="flex flex-wrap gap-2 mb-2" style={{
            display: "flex",
            flexWrap: "wrap", 
            gap: "8px"
          }}>
            {filteredSkills.map((skill) => (
              <span 
                key={skill.id} 
                className={`px-2 py-0.5 rounded text-xs inline-flex items-center justify-center skill-item ${
                  relevantSkills.includes(skill.name) 
                    ? theme.accentColor
                    : 'bg-gray-100 text-gray-800'
                }`}
                style={{ 
                  display: "inline-flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  height: "24px", /* Fixed height */
                  lineHeight: "1", /* Important for vertical centering */
                  padding: "0px 8px",
                  visibility: "visible",
                  opacity: 1
                }}
              >
                {skill.name}
              </span>
            ))}
            {skillsToAdd.map((skill) => (
              <span 
                key={skill} 
                className={`px-2 py-0.5 rounded text-xs font-medium inline-flex items-center justify-center skill-item ${theme.accentColor}`}
                style={{ 
                  display: "inline-flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  height: "24px", /* Fixed height */
                  lineHeight: "1", /* Important for vertical centering */
                  padding: "0px 8px",
                  visibility: "visible",
                  opacity: 1
                }}
              >
                {skill}*
              </span>
            ))}
          </div>
          {skillsToAdd.length > 0 && (
            <p className="text-[10px] text-gray-500">* Skills added based on job requirements</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumePreview;
