import React from 'react';
import { TemplateProps, getFontFamilyClass, getContactItems, BulletList, renderFormattedText, ContactIconSvg } from './templateUtils';

export const TwoColumnTemplate: React.FC<TemplateProps> = ({ resume, isPrint }) => {
  const { personalInfo, summary, experiences, education, skillCategories, settings } = resume;
  const fontClass = getFontFamilyClass(settings.fontFamily);
  const primaryColor = settings.primaryColor || '#186750';
  const contactItems = getContactItems(personalInfo);

  return (
    <div className={`text-slate-800 bg-white ${fontClass} leading-normal text-[10pt]`} style={{ padding: '36px 40px' }}>
      {/* Header — Full Width */}
      <header className="border-b pb-4 mb-5 resume-header" style={{ borderColor: `${primaryColor}30` }}>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-1" style={{ color: primaryColor }}>
          {personalInfo.fullName || 'Your Name'}
        </h1>
        {personalInfo.jobTitle && (
          <p className="text-base font-medium text-slate-600" data-field-path="personalInfo.jobTitle">
            {renderFormattedText(personalInfo.jobTitle)}
          </p>
        )}
      </header>

      {/* Two Column Body */}
      <div className="flex flex-row gap-6 items-start">
        {/* Left Sidebar Column (~34%) */}
        <div className="w-[34%] flex-shrink-0 space-y-5">
          {/* Contact Details */}
          {contactItems.length > 0 && (
            <section className="resume-section">
              <h2
                className="text-xs font-bold uppercase tracking-wider mb-2.5 pb-1 border-b resume-section-title"
                style={{ borderColor: `${primaryColor}30`, color: primaryColor }}
              >
                Contact
              </h2>
              <div className="space-y-1.5 text-xs text-slate-700">
                {contactItems.map(item => (
                  <div key={item.id} className="flex items-center gap-2 resume-standalone-item break-all">
                    <ContactIconSvg type={item.type} color={primaryColor} />
                    {item.href ? (
                      <a href={item.href} className="hover:underline text-slate-700">
                        {item.value}
                      </a>
                    ) : (
                      <span>{item.value}</span>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Technical Skills & Competencies */}
          {skillCategories.length > 0 && (
            <section className="resume-section">
              <h2
                className="text-xs font-bold uppercase tracking-wider mb-2.5 pb-1 border-b resume-section-title"
                style={{ borderColor: `${primaryColor}30`, color: primaryColor }}
              >
                Skills & Competencies
              </h2>
              <div className="space-y-3 text-xs">
                {skillCategories.map(cat => (
                  <div key={cat.id} className="resume-standalone-item">
                    <div className="font-bold text-slate-900 mb-0.5">{cat.categoryName}</div>
                    <div className="text-slate-700 leading-snug">
                      {renderFormattedText(cat.skills.join(cat.separator === 'pipe' ? ' | ' : ', '))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {education.length > 0 && (
            <section className="resume-section">
              <h2
                className="text-xs font-bold uppercase tracking-wider mb-2.5 pb-1 border-b resume-section-title"
                style={{ borderColor: `${primaryColor}30`, color: primaryColor }}
              >
                Education
              </h2>
              <div className="space-y-3 text-xs">
                {education.map(edu => (
                  <div key={edu.id} className="resume-standalone-item">
                    <div className="font-bold text-slate-900 leading-tight">{edu.degree}</div>
                    <div className="text-slate-600 text-[11px]">{edu.fieldOfStudy}</div>
                    <div className="text-slate-500 text-[11px]">{edu.institution}{edu.location ? `, ${edu.location}` : ''}</div>
                    <div className="text-slate-400 text-[10px] font-medium mt-0.5">
                      {edu.startDate} – {edu.current ? 'Present' : edu.endDate}
                    </div>
                    {edu.gpa && <div className="text-slate-600 text-[10px] font-semibold mt-0.5">GPA: {edu.gpa}</div>}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Main Column (~66%) */}
        <div className="flex-1 min-w-0 pl-5 border-l space-y-5" style={{ borderColor: `${primaryColor}20` }}>
          {/* Summary */}
          {summary?.trim() && (
            <section className="resume-section">
              <h2
                className="text-xs font-bold uppercase tracking-wider mb-2 pb-1 border-b resume-section-title"
                style={{ borderColor: `${primaryColor}30`, color: primaryColor }}
              >
                Professional Summary
              </h2>
              <p className="text-slate-700 leading-relaxed text-[9.5pt]" data-field-path="summary">
                {renderFormattedText(summary)}
              </p>
            </section>
          )}

          {/* Experience */}
          {experiences.length > 0 && (
            <section className="resume-section">
              <h2
                className="text-xs font-bold uppercase tracking-wider mb-3 pb-1 border-b resume-section-title"
                style={{ borderColor: `${primaryColor}30`, color: primaryColor }}
              >
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
        </div>
      </div>
    </div>
  );
};
