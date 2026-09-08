import React from 'react';
import { TemplateProps, getFontFamilyClass, ContactHeaderBar, BulletList, renderFormattedText } from './templateUtils';
import { ModernTemplate } from './ModernTemplate';

export const CompactTemplate: React.FC<TemplateProps> = ({ resume }) => {
  return (
    <div className="scale-95 origin-top">
      <ModernTemplate resume={{
        ...resume,
        settings: { ...resume.settings, lineSpacing: 'compact', fontSize: 10 }
      }} />
    </div>
  );
};

export const ExecutiveTemplate: React.FC<TemplateProps> = ({ resume }) => {
  const { personalInfo, summary, experiences, education, skillCategories, settings } = resume;
  const primaryColor = settings.primaryColor || '#1e3a8a';
  const fontClass = getFontFamilyClass('Lato');

  return (
    <div className={`text-slate-900 bg-white ${fontClass} text-[10pt]`} style={{ padding: '36px 44px' }}>
      <div className="border-l-4 pl-4 mb-6 resume-header" style={{ borderColor: primaryColor }}>
        <h1 className="text-3xl font-bold tracking-wide" style={{ color: primaryColor }}>
          {personalInfo.fullName}
        </h1>
        <p className="text-sm font-semibold tracking-wider uppercase text-slate-600 mb-2" data-field-path="personalInfo.jobTitle">
          {renderFormattedText(personalInfo.jobTitle)}
        </p>
        <ContactHeaderBar
          personalInfo={personalInfo}
          style={settings.contactHeaderStyle || 'bullets'}
          primaryColor={primaryColor}
        />
      </div>

      {summary && (
        <div className="mb-5 bg-slate-50 p-3 rounded border border-slate-100 resume-section">
          <h2 className="text-xs font-bold uppercase tracking-wider mb-1 resume-section-title" style={{ color: primaryColor }}>Executive Overview</h2>
          <p className="text-xs text-slate-700 leading-relaxed" data-field-path="summary">
            {renderFormattedText(summary)}
          </p>
        </div>
      )}

      {experiences.length > 0 && (
        <div className="mb-5 resume-section">
          <h2 className="text-xs font-bold uppercase tracking-wider mb-3 pb-1 border-b-2 resume-section-title" style={{ borderColor: primaryColor, color: primaryColor }}>
            Executive Experience & Leadership
          </h2>
          <div className="space-y-4">
            {experiences.map((exp, expIdx) => (
              <div key={exp.id} className="resume-entry">
                <div className="resume-entry-header">
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-sm text-slate-900" data-field-path={`experiences.${expIdx}.role`}>
                      {renderFormattedText(exp.role)}
                    </span>
                    <span className="text-xs font-semibold text-slate-600">{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                  </div>
                  <div className="text-xs font-medium text-slate-700 mb-1">{exp.company} ({exp.location})</div>
                </div>
                <BulletList bullets={exp.bullets} bulletColor={primaryColor} fieldPathPrefix={`experiences.${expIdx}.bullets`} />
              </div>
            ))}
          </div>
        </div>
      )}

      {skillCategories.length > 0 && (
        <div className="mb-5 resume-section">
          <h2 className="text-xs font-bold uppercase tracking-wider mb-2 pb-1 border-b resume-section-title" style={{ borderColor: primaryColor, color: primaryColor }}>
            Core Competencies & Capabilities
          </h2>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {skillCategories.map(cat => (
              <div key={cat.id} className="bg-slate-50 p-2 rounded resume-standalone-item">
                <span className="font-bold block text-slate-900 mb-0.5">{cat.categoryName}</span>
                <span className="text-slate-600">{renderFormattedText(cat.skills.join(cat.separator === 'pipe' ? ' | ' : ', '))}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {education.length > 0 && (
        <div className="resume-section">
          <h2 className="text-xs font-bold uppercase tracking-wider mb-2 pb-1 border-b resume-section-title" style={{ borderColor: primaryColor, color: primaryColor }}>
            Education & Credentials
          </h2>
          <div className="space-y-1 text-xs">
            {education.map(edu => (
              <div key={edu.id} className="flex justify-between resume-standalone-item">
                <span><strong className="text-slate-900">{edu.degree} in {edu.fieldOfStudy}</strong> — {edu.institution}</span>
                <span className="text-slate-500">{edu.startDate} – {edu.endDate}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const TechnicalTemplate: React.FC<TemplateProps> = ({ resume }) => {
  return (
    <div className="font-mono text-xs">
      <ModernTemplate resume={{
        ...resume,
        settings: { ...resume.settings, fontFamily: 'JetBrains Mono', primaryColor: '#0f766e' }
      }} />
    </div>
  );
};

export const SlateTemplate: React.FC<TemplateProps> = ({ resume }) => {
  return (
    <ModernTemplate resume={{
      ...resume,
      settings: { ...resume.settings, primaryColor: '#334155' }
    }} />
  );
};

export const AcademicTemplate: React.FC<TemplateProps> = ({ resume }) => {
  return (
    <div className="font-serif">
      <ModernTemplate resume={{
        ...resume,
        settings: { ...resume.settings, fontFamily: 'Merriweather', primaryColor: '#475569' }
      }} />
    </div>
  );
};

export const GraphicTemplate: React.FC<TemplateProps> = ({ resume }) => {
  return (
    <ModernTemplate resume={{
      ...resume,
      settings: { ...resume.settings, primaryColor: '#6366f1' }
    }} />
  );
};

export const ColorfulTemplate: React.FC<TemplateProps> = ({ resume }) => {
  return (
    <ModernTemplate resume={{
      ...resume,
      settings: { ...resume.settings, primaryColor: resume.settings.primaryColor || '#d97706' }
    }} />
  );
};

/**
 * Classic Template — Centered header with colored top band, double-line section dividers, serif-friendly
 */
export const ClassicTemplate: React.FC<TemplateProps> = ({ resume }) => {
  const { personalInfo, summary, experiences, education, skillCategories, settings } = resume;
  const primaryColor = settings.primaryColor || '#1e3a5f';
  const fontClass = getFontFamilyClass(settings.fontFamily || 'Merriweather');

  return (
    <div className={`text-slate-800 bg-white ${fontClass} text-[10pt] leading-normal`}>
      {/* Colored Top Band + Centered Header */}
      <div className="text-center resume-header" style={{ backgroundColor: primaryColor, padding: '28px 44px 24px' }}>
        <h1 className="text-3xl font-bold tracking-wide text-white mb-1">
          {personalInfo.fullName || 'Your Name'}
        </h1>
        {personalInfo.jobTitle && (
          <p className="text-sm font-medium text-white/80 tracking-wider uppercase mb-3" data-field-path="personalInfo.jobTitle">
            {renderFormattedText(personalInfo.jobTitle)}
          </p>
        )}
        <div className="text-xs text-white/70 font-medium">
          {[personalInfo.email, personalInfo.phone, personalInfo.location].filter(Boolean).join('  •  ')}
        </div>
        {(() => {
          const links = [personalInfo.linkedin, personalInfo.github, personalInfo.website].filter(Boolean);
          if (links.length === 0) return null;
          return (
            <div className="text-xs text-white/70 font-medium" style={{ marginTop: '2px' }}>
              {links.join('  •  ')}
            </div>
          );
        })()}
      </div>

      <div style={{ padding: '24px 44px 36px' }}>
        {/* Summary */}
        {summary?.trim() && (
          <section className="mb-5 resume-section">
            <h2 className="text-xs font-bold uppercase tracking-widest mb-2 pb-1 resume-section-title" style={{ color: primaryColor, borderBottom: `2px solid ${primaryColor}` }}>
              Profile
            </h2>
            <p className="text-slate-700 leading-relaxed text-[9.5pt] text-left" data-field-path="summary">
              {renderFormattedText(summary)}
            </p>
          </section>
        )}

        {/* Experience */}
        {experiences.length > 0 && (
          <section className="mb-5 resume-section">
            <h2 className="text-xs font-bold uppercase tracking-widest mb-3 pb-1 resume-section-title" style={{ color: primaryColor, borderBottom: `2px solid ${primaryColor}` }}>
              Professional Experience
            </h2>
            <div className="space-y-4">
              {experiences.map((exp, expIdx) => (
                <div key={exp.id} className="resume-entry">
                  <div className="resume-entry-header">
                    <div className="flex justify-between items-baseline flex-wrap">
                      <span className="font-bold text-slate-900 text-sm" data-field-path={`experiences.${expIdx}.role`}>
                        {renderFormattedText(exp.role)}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                      </span>
                    </div>
                    <div className="flex justify-between items-baseline text-xs text-slate-600 mb-1.5">
                      <span className="font-semibold italic" data-field-path={`experiences.${expIdx}.company`}>{exp.company}</span>
                      <span>{exp.location}</span>
                    </div>
                  </div>
                  <BulletList bullets={exp.bullets} bulletColor={primaryColor} fieldPathPrefix={`experiences.${expIdx}.bullets`} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {skillCategories.length > 0 && (
          <section className="mb-5 resume-section">
            <h2 className="text-xs font-bold uppercase tracking-widest mb-2 pb-1 resume-section-title" style={{ color: primaryColor, borderBottom: `2px solid ${primaryColor}` }}>
              Skills & Expertise
            </h2>
            <div className="space-y-1.5 text-xs">
              {skillCategories.map(cat => (
                <div key={cat.id} className="flex items-baseline resume-standalone-item">
                  <span className="font-bold text-slate-800 w-40 flex-shrink-0">{cat.categoryName}:</span>
                  <span className="text-slate-700">{renderFormattedText(cat.skills.join(cat.separator === 'pipe' ? ' | ' : ', '))}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <section className="mb-5 resume-section">
            <h2 className="text-xs font-bold uppercase tracking-widest mb-2 pb-1 resume-section-title" style={{ color: primaryColor, borderBottom: `2px solid ${primaryColor}` }}>
              Education
            </h2>
            <div className="space-y-2 text-xs">
              {education.map(edu => (
                <div key={edu.id} className="flex justify-between items-baseline flex-wrap resume-standalone-item">
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
    </div>
  );
};

/**
 * Professional Template — Clean top accent line, bold section headers, structured layout
 */
export const ProfessionalTemplate: React.FC<TemplateProps> = ({ resume }) => {
  const { personalInfo, summary, experiences, education, skillCategories, settings } = resume;
  const primaryColor = settings.primaryColor || '#0c4a6e';
  const fontClass = getFontFamilyClass(settings.fontFamily || 'Roboto');

  return (
    <div className={`text-slate-800 bg-white ${fontClass} text-[10pt] leading-normal`}>
      {/* Thin colored top bar */}
      <div style={{ height: '5px', backgroundColor: primaryColor }} />

      <div style={{ padding: '30px 44px 36px' }}>
        {/* Header */}
        <header className="mb-5 resume-header">
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 mb-0.5">
            {personalInfo.fullName || 'Your Name'}
          </h1>
          {personalInfo.jobTitle && (
            <p className="text-sm font-semibold mb-2" style={{ color: primaryColor }} data-field-path="personalInfo.jobTitle">
              {renderFormattedText(personalInfo.jobTitle)}
            </p>
          )}
          <div className="text-xs text-slate-600 font-medium leading-relaxed">
            <span>{[personalInfo.email, personalInfo.phone, personalInfo.location].filter(Boolean).join('  |  ')}</span>
            {(() => {
              const links = [personalInfo.linkedin, personalInfo.github, personalInfo.website].filter(Boolean);
              if (links.length === 0) return null;
              return (
                <>
                  <br />
                  <span>{links.join('  |  ')}</span>
                </>
              );
            })()}
          </div>
          <div style={{ marginTop: '12px', height: '2px', backgroundColor: primaryColor }} />
        </header>

        {/* Summary */}
        {summary?.trim() && (
          <section className="mb-5 resume-section">
            <h2 className="text-[11px] font-extrabold uppercase tracking-wider mb-2 resume-section-title" style={{ color: primaryColor }}>
              Summary
            </h2>
            <p className="text-slate-700 leading-relaxed text-[9.5pt] text-left" data-field-path="summary">
              {renderFormattedText(summary)}
            </p>
          </section>
        )}

        {/* Experience */}
        {experiences.length > 0 && (
          <section className="mb-5 resume-section">
            <h2 className="text-[11px] font-extrabold uppercase tracking-wider mb-3 pb-1.5 border-b-2 resume-section-title" style={{ borderColor: `${primaryColor}40`, color: primaryColor }}>
              Experience
            </h2>
            <div className="space-y-4">
              {experiences.map((exp, expIdx) => (
                <div key={exp.id} className="resume-entry">
                  <div className="resume-entry-header">
                    <div className="flex justify-between items-baseline flex-wrap">
                      <span className="font-bold text-slate-900 text-sm" data-field-path={`experiences.${expIdx}.role`}>
                        {renderFormattedText(exp.role)}
                      </span>
                      <span className="text-xs font-semibold" style={{ color: primaryColor }}>
                        {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                      </span>
                    </div>
                    <div className="flex justify-between items-baseline text-xs text-slate-600 mb-1.5">
                      <span className="font-semibold text-slate-700" data-field-path={`experiences.${expIdx}.company`}>{exp.company}</span>
                      <span>{exp.location}</span>
                    </div>
                  </div>
                  <BulletList bullets={exp.bullets} bulletColor={primaryColor} fieldPathPrefix={`experiences.${expIdx}.bullets`} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills — compact grid */}
        {skillCategories.length > 0 && (
          <section className="mb-5 resume-section">
            <h2 className="text-[11px] font-extrabold uppercase tracking-wider mb-2 pb-1.5 border-b-2 resume-section-title" style={{ borderColor: `${primaryColor}40`, color: primaryColor }}>
              Technical Skills
            </h2>
            <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-xs">
              {skillCategories.map(cat => (
                <div key={cat.id} className="flex items-baseline resume-standalone-item">
                  <span className="font-bold text-slate-800 flex-shrink-0" style={{ minWidth: '100px' }}>{cat.categoryName}:</span>
                  <span className="text-slate-700 ml-2">{renderFormattedText(cat.skills.join(cat.separator === 'pipe' ? ' | ' : ', '))}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <section className="mb-5 resume-section">
            <h2 className="text-[11px] font-extrabold uppercase tracking-wider mb-2 pb-1.5 border-b-2 resume-section-title" style={{ borderColor: `${primaryColor}40`, color: primaryColor }}>
              Education
            </h2>
            <div className="space-y-2 text-xs">
              {education.map(edu => (
                <div key={edu.id} className="flex justify-between items-baseline flex-wrap resume-standalone-item">
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
    </div>
  );
};
