'use client';

import React, { useState } from 'react';
import { ResumeData, AtsAuditResult } from '@/types/resume';
import { calculateAtsAudit } from '@/utils/atsScorer';
import { Target, CheckCircle2, AlertCircle, Plus, X, Sparkles } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  resume: ResumeData;
  onUpdateResume: (resume: ResumeData) => void;
}

export const JobDescriptionMatcher: React.FC<Props> = ({
  isOpen,
  onClose,
  resume,
  onUpdateResume,
}) => {
  const [jdText, setJdText] = useState(resume.targetJobDescription || '');
  const auditResult = calculateAtsAudit(resume, jdText);

  if (!isOpen) return null;

  const handleSaveJd = () => {
    onUpdateResume({ ...resume, targetJobDescription: jdText });
  };

  const handleAddSkill = (keyword: string) => {
    // Add to the first skill category
    const categories = [...resume.skillCategories];
    if (categories.length === 0) {
      categories.push({ id: 'cat-auto', categoryName: 'Key Competencies', skills: [keyword] });
    } else {
      if (!categories[0].skills.includes(keyword)) {
        categories[0].skills = [...categories[0].skills, keyword];
      }
    }
    onUpdateResume({ ...resume, skillCategories: categories });
  };

  const matchRate = auditResult.jdMatch?.matchRate ?? 0;
  const found = auditResult.jdMatch?.foundKeywords ?? [];
  const missing = auditResult.jdMatch?.missingKeywords ?? [];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-[#FAF8F2]">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-neutral-900 text-base">ATS Job Description Matcher</h3>
              <p className="text-xs text-neutral-500">Scan your resume against any target job posting to find keyword gaps</p>
            </div>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-700 p-1.5 rounded-lg transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div>
            <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
              Paste Target Job Description (JD)
            </label>
            <textarea
              rows={5}
              value={jdText}
              onChange={e => {
                setJdText(e.target.value);
                handleSaveJd();
              }}
              placeholder="Paste the full job posting, required qualifications, and responsibilities here..."
              className="w-full p-3 text-xs border border-neutral-300 rounded-xl focus:ring-2 focus:ring-emerald-700 outline-none leading-relaxed"
            />
          </div>

          {jdText.trim().length > 30 ? (
            <div className="space-y-4">
              {/* Score Gauge */}
              <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50 flex items-center justify-between flex-wrap gap-3">
                <div>
                  <span className="text-xs font-bold text-neutral-600 block uppercase">ATS Keyword Match Rate</span>
                  <span className="text-3xl font-extrabold text-neutral-900">{matchRate}%</span>
                </div>
                <div className="text-xs text-right text-neutral-500">
                  <div><strong>{found.length}</strong> keywords matched</div>
                  <div><strong>{missing.length}</strong> keywords missing</div>
                </div>
              </div>

              {/* Missing Keywords (Actionable) */}
              <div>
                <h4 className="text-xs font-bold text-neutral-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span>Missing High-Value Keywords (Click to add to skills):</span>
                </h4>
                {missing.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {missing.map((kw, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleAddSkill(kw)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 hover:bg-emerald-50 text-amber-900 hover:text-emerald-800 border border-amber-200 hover:border-emerald-300 rounded-md text-xs font-medium transition"
                        title="Click to add this keyword into your skills section"
                      >
                        <span>{kw}</span>
                        <Plus className="w-3 h-3 text-emerald-700" />
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-emerald-700 font-medium">All major keywords from this JD were found in your resume!</p>
                )}
              </div>

              {/* Found Keywords */}
              <div>
                <h4 className="text-xs font-bold text-neutral-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Matched Keywords ({found.length}):</span>
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {found.map((kw, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-xs"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 text-neutral-400 text-xs">
              Paste a job description above to see real-time ATS keyword matching and gap analysis.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-200 bg-neutral-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-emerald-800 text-white text-xs font-bold rounded-xl hover:bg-emerald-900 transition shadow-sm"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
