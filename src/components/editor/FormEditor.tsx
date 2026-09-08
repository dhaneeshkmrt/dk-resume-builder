'use client';

import React, { useState } from 'react';
import { ResumeData } from '@/types/resume';
import { PersonalInfoForm } from './PersonalInfoForm';
import { SummaryForm } from './SummaryForm';
import { ExperienceForm } from './ExperienceForm';
import { SkillsForm } from './SkillsForm';
import { EducationForm } from './EducationProjectsForm';
import {
  User,
  FileText,
  Briefcase,
  Wrench,
  GraduationCap
} from 'lucide-react';

interface Props {
  resume: ResumeData;
  onChange: (resume: ResumeData) => void;
}

type TabType = 'contact' | 'summary' | 'experience' | 'skills' | 'education';

export const FormEditor: React.FC<Props> = ({ resume, onChange }) => {
  const [activeTab, setActiveTab] = useState<TabType>('contact');

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'contact', label: 'Contact', icon: <User className="w-4 h-4" /> },
    { id: 'summary', label: 'Summary', icon: <FileText className="w-4 h-4" /> },
    { id: 'experience', label: 'Experience', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'skills', label: 'Skills', icon: <Wrench className="w-4 h-4" /> },
    { id: 'education', label: 'Education', icon: <GraduationCap className="w-4 h-4" /> },
  ];

  return (
    <div className="flex flex-col h-full min-h-0 bg-white overflow-hidden">
      {/* Tab Navigation */}
      <div className="border-b border-neutral-200 bg-[#FAF8F2] px-4 pt-3 flex-shrink-0">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-lg transition whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-white text-emerald-800 shadow-sm border border-neutral-200/80'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/80'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Editor Main Content Area */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 md:p-6 space-y-6">
        {activeTab === 'contact' && (
          <div>
            <div className="mb-4">
              <h2 className="text-base font-bold text-neutral-900">Personal Information</h2>
              <p className="text-xs text-neutral-500">
                Provide accurate contact channels for ATS crawlers and hiring managers.
              </p>
            </div>
            <PersonalInfoForm
              data={resume.personalInfo}
              onChange={personalInfo => onChange({ ...resume, personalInfo })}
            />
          </div>
        )}

        {activeTab === 'summary' && (
          <div>
            <div className="mb-4">
              <h2 className="text-base font-bold text-neutral-900">Executive / Professional Summary</h2>
              <p className="text-xs text-neutral-500">
                Hook the recruiter in 3 seconds with top quantifiable achievements and core skills.
              </p>
            </div>
            <SummaryForm
              summary={resume.summary}
              resume={resume}
              onChange={summary => onChange({ ...resume, summary })}
            />
          </div>
        )}

        {activeTab === 'experience' && (
          <div>
            <div className="mb-4">
              <h2 className="text-base font-bold text-neutral-900">Work Experience</h2>
              <p className="text-xs text-neutral-500">
                Start bullet points with strong action verbs and include measurable numbers.
              </p>
            </div>
            <ExperienceForm
              experiences={resume.experiences}
              onChange={experiences => onChange({ ...resume, experiences })}
            />
          </div>
        )}

        {activeTab === 'skills' && (
          <div>
            <div className="mb-4">
              <h2 className="text-base font-bold text-neutral-900">Skills & Competencies</h2>
              <p className="text-xs text-neutral-500">
                Categorized skills pass ATS keyword parsers with high accuracy.
              </p>
            </div>
            <SkillsForm
              skillCategories={resume.skillCategories}
              onChange={skillCategories => onChange({ ...resume, skillCategories })}
            />
          </div>
        )}

        {activeTab === 'education' && (
          <div>
            <div className="mb-4">
              <h2 className="text-base font-bold text-neutral-900">Education</h2>
              <p className="text-xs text-neutral-500">Degrees, academic honors, and university details.</p>
            </div>
            <EducationForm
              education={resume.education}
              onChange={education => onChange({ ...resume, education })}
            />
          </div>
        )}
      </div>
    </div>
  );
};
