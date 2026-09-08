
import React from 'react';
import { TemplateProps, getFontFamilyClass, ContactHeaderBar, BulletList, renderFormattedText } from './templateUtils';

export const MinimalTemplate: React.FC<TemplateProps> = ({ resume }) => {
  const { personalInfo, summary, experiences, education, skillCategories, projects, certifications, settings } = resume;
  const fontClass = getFontFamilyClass(settings.fontFamily);

  return (
    <div className={`text-black bg-white ${fontClass} leading-relaxed text-[10pt]`} style={{ padding: '36px 44px' }}>
      {/* Centered Minimal Header */}
      <div className="text-center pb-4 mb-4 border-b border-black">
        <h1 className="text-2xl font-bold tracking-tight uppercase text-black mb-1">
          {personalInfo.fullName || 'Your Name'}
        </h1>
        {personalInfo.jobTitle && (
          <p className="text-xs uppercase tracking-widest text-neutral-600 font-medium mb-2" data-field-path="personalInfo.jobTitle">
            {renderFormattedText(personalInfo.jobTitle)}
          </p>
        )}
        <ContactHeaderBar
          personalInfo={personalInfo}
          style={settings.contactHeaderStyle || 'bullets'}
          primaryColor="#000000"
          align="center"
        />
      </div>

      {/* Summary */}
      {summary?.trim() && (
        <div className="mb-4 resume-section">
          <h2 className="text-xs font-bold uppercase tracking-widest border-b border-neutral-300 pb-0.5 mb-1.5 resume-section-title">
            Summary
          </h2>
          <p className="text-xs text-neutral-800 leading-normal text-left" data-field-path="summary">
            {renderFormattedText(summary)}
          </p>
        </div>
      )}

      {/* Experience */}
      {experiences.length > 0 && (
        <div className="mb-4 resume-section">
          <h2 className="text-xs font-bold uppercase tracking-widest border-b border-neutral-300 pb-0.5 mb-2 resume-section-title">
            Experience
          </h2>
          <div className="space-y-3">
            {experiences.map((exp, expIdx) => (
              <div key={exp.id} className="resume-entry">
                <div className="resume-entry-header">
                  <div className="flex justify-between items-baseline text-xs">
                    <span className="font-bold text-black" data-field-path={`experiences.${expIdx}.role`}>
                      {exp.company} — {renderFormattedText(exp.role)}
                    </span>
                    <span className="text-neutral-600">{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                  </div>
                  <div className="text-xs text-neutral-500 italic mb-1">{exp.location}</div>
                </div>
                <BulletList
                  bullets={exp.bullets}
                  bulletColor="#000000"
                  className="space-y-0.5 mt-0.5 text-xs text-neutral-800"
                  fieldPathPrefix={`experiences.${expIdx}.bullets`}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {skillCategories.length > 0 && (
        <div className="mb-4 resume-section">
          <h2 className="text-xs font-bold uppercase tracking-widest border-b border-neutral-300 pb-0.5 mb-1.5 resume-section-title">
            Skills
          </h2>
          <div className="space-y-1 text-xs">
            {skillCategories.map(cat => (
              <div key={cat.id} className="resume-standalone-item">
                <span className="font-semibold">{cat.categoryName}: </span>
                <span className="text-neutral-800">{renderFormattedText(cat.skills.join(cat.separator === 'pipe' ? ' | ' : ', '))}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="mb-4 resume-section">
          <h2 className="text-xs font-bold uppercase tracking-widest border-b border-neutral-300 pb-0.5 mb-1.5 resume-section-title">
            Education
          </h2>
          <div className="space-y-2 text-xs">
            {education.map(edu => (
              <div key={edu.id} className="flex justify-between items-baseline resume-standalone-item">
                <div>
                  <span className="font-bold">{edu.institution}</span>, {edu.degree} in {edu.fieldOfStudy}
                </div>
                <span className="text-neutral-600">{edu.startDate} – {edu.current ? 'Present' : edu.endDate}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
