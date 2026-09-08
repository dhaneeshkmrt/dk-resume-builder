import React from 'react';
import { TemplateProps, getFontFamilyClass, getContactItems, BulletList, renderFormattedText } from './templateUtils';

export const ModernTemplate: React.FC<TemplateProps> = ({ resume, isPrint }) => {
  const { personalInfo, summary, experiences, education, skillCategories, awards, settings } = resume;
  const fontClass = getFontFamilyClass(settings.fontFamily);
  const primaryColor = settings.primaryColor || '#186750';
  const contactItems = getContactItems(personalInfo);

  return (
    <div className={`text-slate-800 bg-white ${fontClass} leading-normal text-[10pt]`} style={{ padding: '36px 44px' }}>
      {/* Header */}
      <header className="border-b pb-4 mb-5 text-center resume-header" style={{ borderColor: `${primaryColor}30` }}>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-1" style={{ color: primaryColor }}>
          {personalInfo.fullName || 'Your Name'}
        </h1>
        {personalInfo.jobTitle && (
          <p className="text-base font-medium text-slate-600 mb-3" data-field-path="personalInfo.jobTitle">
            {renderFormattedText(personalInfo.jobTitle)}
          </p>
        )}

        {/* Contact Info — two lines with pipe separators */}
        {contactItems.length > 0 && (() => {
          const primaryItems = contactItems.filter(i => i.type === 'email' || i.type === 'phone' || i.type === 'location');
          const secondaryItems = contactItems.filter(i => i.type === 'linkedin' || i.type === 'github' || i.type === 'website');
          return (
            <div className="text-xs text-slate-700 font-medium leading-relaxed">
              {primaryItems.length > 0 && (
                <p>
                  {primaryItems.map((item, index) => (
                    <React.Fragment key={item.id}>
                      {index > 0 && <span className="text-slate-300" style={{ margin: '0 6px' }}>|</span>}
                      <span>{item.value}</span>
                    </React.Fragment>
                  ))}
                </p>
              )}
              {secondaryItems.length > 0 && (
                <p style={{ marginTop: '2px' }}>
                  {secondaryItems.map((item, index) => (
                    <React.Fragment key={item.id}>
                      {index > 0 && <span className="text-slate-300" style={{ margin: '0 6px' }}>|</span>}
                      <span>{item.value}</span>
                    </React.Fragment>
                  ))}
                </p>
              )}
            </div>
          );
        })()}
      </header>

      {/* Summary */}
      {summary?.trim() && (
        <section className="mb-5 resume-section">
          <h2 className="text-xs font-bold uppercase tracking-wider mb-2 resume-section-title" style={{ color: primaryColor }}>
            Professional Summary
          </h2>
          <p className="text-slate-700 leading-relaxed text-left text-[9.5pt]" data-field-path="summary">
            {renderFormattedText(summary)}
          </p>
        </section>
      )}

      {/* Experience */}
      {experiences.length > 0 && (
        <section className="mb-5 resume-section">
          <h2 className="text-xs font-bold uppercase tracking-wider mb-3 border-b pb-3 resume-section-title" style={{ borderColor: `${primaryColor}30`, color: primaryColor }}>
            Work Experience
          </h2>
          <div className="space-y-4">
            {experiences.map((exp, expIdx) => (
              <div key={exp.id} className="resume-entry">
                <div className="resume-entry-header">
                  <div className="flex justify-between items-baseline flex-wrap">
                    <span className="font-bold text-slate-900 text-sm" data-field-path={`experiences.${expIdx}.role`}>
                      {renderFormattedText(exp.role)}
                    </span>
                    <span className="text-xs font-medium text-slate-500">
                      {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline text-xs text-slate-600 mb-1.5">
                    <span className="font-semibold text-slate-700" data-field-path={`experiences.${expIdx}.company`}>
                      {exp.company}
                    </span>
                    <span>{exp.location}</span>
                  </div>
                </div>
                <BulletList bullets={exp.bullets} fieldPathPrefix={`experiences.${expIdx}.bullets`} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skillCategories.length > 0 && (
        <section className="mb-5 resume-section">
          <h2 className="text-xs font-bold uppercase tracking-wider mb-2 border-b pb-3 resume-section-title" style={{ borderColor: `${primaryColor}30`, color: primaryColor }}>
            Technical Skills & Competencies
          </h2>
          <div className="space-y-1.5 text-xs">
            {skillCategories.map(cat => (
              <div key={cat.id} className="flex flex-row items-baseline resume-standalone-item">
                <span className="font-bold text-slate-800 w-44 flex-shrink-0">{cat.categoryName}:</span>
                <span className="text-slate-700">{renderFormattedText(cat.skills.join(cat.separator === 'pipe' ? ' | ' : ', '))}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="mb-5 resume-section">
          <h2 className="text-xs font-bold uppercase tracking-wider mb-2 border-b pb-3 resume-section-title" style={{ borderColor: `${primaryColor}30`, color: primaryColor }}>
            Education
          </h2>
          <div className="space-y-2">
            {education.map(edu => (
              <div key={edu.id} className="flex justify-between items-baseline flex-wrap text-xs resume-standalone-item">
                <div>
                  <span className="font-bold text-slate-900">{edu.degree} in {edu.fieldOfStudy}</span>
                  <div className="text-slate-600">{edu.institution}{edu.location ? `, ${edu.location}` : ''}</div>
                  {edu.honors && <div className="text-slate-500 italic">{edu.honors}</div>}
                </div>
                <div className="text-right">
                  <span className="text-slate-500 font-medium">{edu.startDate} – {edu.current ? 'Present' : edu.endDate}</span>
                  {edu.gpa && <div className="text-slate-600 font-semibold">GPA: {edu.gpa}</div>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
