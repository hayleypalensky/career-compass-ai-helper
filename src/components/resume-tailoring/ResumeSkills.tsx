
import { Skill } from "@/components/SkillsForm";
import { ResumeColorTheme } from "./ResumeColorSelector";

interface ResumeSkillsProps {
  skills: Skill[];
  skillsToAdd: string[];
  skillsToRemove: string[];
  relevantSkills: string[];
  theme: ResumeColorTheme;
}

const ResumeSkills = ({ skills, skillsToAdd, skillsToRemove, relevantSkills, theme }: ResumeSkillsProps) => {
  // Filter out skills that are marked for removal
  const filteredSkills = skills.filter(skill => 
    !skillsToRemove.includes(skill.id)
  );

  return (
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
  );
};

export default ResumeSkills;
