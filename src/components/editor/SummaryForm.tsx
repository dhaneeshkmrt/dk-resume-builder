'use client';

import React from 'react';
import { ResumeData } from '@/types/resume';

interface Props {
  summary: string;
  resume: ResumeData;
  onChange: (summary: string) => void;
}

export const SummaryForm: React.FC<Props> = ({ summary, onChange }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-neutral-700">
          Professional Summary / Objective
        </label>
      </div>
      <textarea
        rows={4}
        value={summary}
        onChange={e => onChange(e.target.value)}
        placeholder="Brief overview highlighting your key qualifications, years of experience, top technical competencies, and quantifiable achievements..."
        className="w-full p-3 text-sm border border-neutral-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 outline-none transition leading-relaxed"
      />
      <p className="text-xs text-neutral-500">
        Tip: ATS algorithms scan summaries for target job title keywords and key competencies. Aim for 2-4 impactful sentences.
      </p>
    </div>
  );
};
