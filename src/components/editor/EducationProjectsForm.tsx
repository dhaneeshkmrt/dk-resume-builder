'use client';

import React from 'react';
import { EducationItem } from '@/types/resume';
import { Plus, Trash2 } from 'lucide-react';

interface EduProps {
  education: EducationItem[];
  onChange: (education: EducationItem[]) => void;
}

export const EducationForm: React.FC<EduProps> = ({ education, onChange }) => {
  const addEdu = () => {
    const newItem: EducationItem = {
      id: `edu-${Date.now()}`,
      institution: '',
      degree: '',
      fieldOfStudy: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
    };
    onChange([...education, newItem]);
  };

  const updateEdu = (idx: number, item: EducationItem) => {
    const list = [...education];
    list[idx] = item;
    onChange(list);
  };

  const deleteEdu = (idx: number) => {
    onChange(education.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-xs text-neutral-500 font-medium">Add degrees and colleges.</span>
        <button
          type="button"
          onClick={addEdu}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-800 text-white rounded-lg text-xs font-bold hover:bg-emerald-900 transition shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Degree</span>
        </button>
      </div>

      {education.map((edu, idx) => (
        <div key={edu.id} className="p-3.5 border border-neutral-200 rounded-xl bg-white shadow-sm space-y-3">
          <div className="flex justify-between items-center border-b border-neutral-100 pb-1">
            <span className="text-xs font-bold text-neutral-800 uppercase">
              {edu.degree || 'Degree'} {edu.institution ? `– ${edu.institution}` : ''}
            </span>
            <button onClick={() => deleteEdu(idx)} className="text-neutral-400 hover:text-red-500 p-1">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[11px] font-semibold text-neutral-700 mb-0.5">School / University *</label>
              <input
                type="text"
                value={edu.institution}
                onChange={e => updateEdu(idx, { ...edu, institution: e.target.value })}
                placeholder="e.g. UC Berkeley"
                className="w-full px-2.5 py-1.5 text-xs border border-neutral-300 rounded focus:ring-1 focus:ring-emerald-700 outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-neutral-700 mb-0.5">Degree *</label>
              <input
                type="text"
                value={edu.degree}
                onChange={e => updateEdu(idx, { ...edu, degree: e.target.value })}
                placeholder="e.g. Bachelor of Science"
                className="w-full px-2.5 py-1.5 text-xs border border-neutral-300 rounded focus:ring-1 focus:ring-emerald-700 outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-neutral-700 mb-0.5">Field of Study</label>
              <input
                type="text"
                value={edu.fieldOfStudy}
                onChange={e => updateEdu(idx, { ...edu, fieldOfStudy: e.target.value })}
                placeholder="e.g. Computer Science"
                className="w-full px-2.5 py-1.5 text-xs border border-neutral-300 rounded focus:ring-1 focus:ring-emerald-700 outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 mb-0.5">Start Date</label>
                <input
                  type="text"
                  value={edu.startDate}
                  onChange={e => updateEdu(idx, { ...edu, startDate: e.target.value })}
                  placeholder="2016-09"
                  className="w-full px-2.5 py-1.5 text-xs border border-neutral-300 rounded focus:ring-1 focus:ring-emerald-700 outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 mb-0.5">End Date</label>
                <input
                  type="text"
                  value={edu.endDate}
                  onChange={e => updateEdu(idx, { ...edu, endDate: e.target.value })}
                  placeholder="2020-05"
                  className="w-full px-2.5 py-1.5 text-xs border border-neutral-300 rounded focus:ring-1 focus:ring-emerald-700 outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
