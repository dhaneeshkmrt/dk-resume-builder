'use client';

import React, { useState } from 'react';
import { ExperienceItem } from '@/types/resume';
import { Plus, Trash2, GripVertical, ChevronUp, ChevronDown } from 'lucide-react';

interface Props {
  experiences: ExperienceItem[];
  onChange: (experiences: ExperienceItem[]) => void;
}

export const ExperienceForm: React.FC<Props> = ({ experiences, onChange }) => {
  const [draggingBullet, setDraggingBullet] = useState<{ expIdx: number; bIdx: number } | null>(null);
  const [dragOverBullet, setDragOverBullet] = useState<{ expIdx: number; bIdx: number } | null>(null);

  const addExperience = () => {
    const newItem: ExperienceItem = {
      id: `exp-${Date.now()}`,
      company: '',
      role: '',
      location: '',
      startDate: '',
      endDate: '',
      current: true,
      bullets: ['']
    };
    onChange([newItem, ...experiences]);
  };

  const updateExp = (index: number, updated: ExperienceItem) => {
    const list = [...experiences];
    list[index] = updated;
    onChange(list);
  };

  const deleteExp = (index: number) => {
    onChange(experiences.filter((_, i) => i !== index));
  };

  const addBullet = (expIndex: number) => {
    const list = [...experiences];
    list[expIndex].bullets.push('');
    onChange(list);
  };

  const updateBullet = (expIndex: number, bulletIndex: number, val: string) => {
    const list = [...experiences];
    list[expIndex].bullets[bulletIndex] = val;
    onChange(list);
  };

  const deleteBullet = (expIndex: number, bulletIndex: number) => {
    const list = [...experiences];
    list[expIndex].bullets = list[expIndex].bullets.filter((_, i) => i !== bulletIndex);
    onChange(list);
  };

  const moveBullet = (expIndex: number, fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= experiences[expIndex].bullets.length) return;
    const list = [...experiences];
    const bullets = [...list[expIndex].bullets];
    const [moved] = bullets.splice(fromIndex, 1);
    bullets.splice(toIndex, 0, moved);
    list[expIndex] = { ...list[expIndex], bullets };
    onChange(list);
  };


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <span className="text-xs text-neutral-500 font-medium">
          Add your work history in reverse chronological order.
        </span>
        <button
          type="button"
          onClick={addExperience}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-800 text-white rounded-lg text-xs font-bold hover:bg-emerald-900 transition shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Position</span>
        </button>
      </div>

      {experiences.length === 0 && (
        <div className="text-center py-8 border-2 border-dashed border-neutral-200 rounded-xl bg-neutral-50/50">
          <p className="text-sm text-neutral-500 mb-3">No work experience added yet.</p>
          <button
            onClick={addExperience}
            className="px-4 py-2 bg-white border border-neutral-300 rounded-lg text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition"
          >
            + Add First Job
          </button>
        </div>
      )}

      {experiences.map((exp, expIdx) => (
        <div key={exp.id} className="p-4 border border-neutral-200 rounded-xl bg-white shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-neutral-100 pb-2">
            <span className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
              {exp.role || 'Position'} {exp.company ? `@ ${exp.company}` : ''}
            </span>
            <button
              onClick={() => deleteExp(expIdx)}
              className="text-neutral-400 hover:text-red-600 transition p-1"
              title="Delete Position"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Job Title *</label>
              <input
                type="text"
                value={exp.role}
                onChange={e => updateExp(expIdx, { ...exp, role: e.target.value })}
                placeholder="e.g. Senior Software Engineer"
                className="w-full px-3 py-1.5 text-sm border border-neutral-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 outline-none transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Company / Organization *</label>
              <input
                type="text"
                value={exp.company}
                onChange={e => updateExp(expIdx, { ...exp, company: e.target.value })}
                placeholder="e.g. Stripe"
                className="w-full px-3 py-1.5 text-sm border border-neutral-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 outline-none transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Location</label>
              <input
                type="text"
                value={exp.location}
                onChange={e => updateExp(expIdx, { ...exp, location: e.target.value })}
                placeholder="e.g. San Francisco, CA (Remote)"
                className="w-full px-3 py-1.5 text-sm border border-neutral-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 outline-none transition"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Start Date</label>
                <input
                  type="text"
                  value={exp.startDate}
                  onChange={e => updateExp(expIdx, { ...exp, startDate: e.target.value })}
                  placeholder="2024 Apr"
                  className="w-full px-3 py-1.5 text-sm border border-neutral-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 outline-none transition"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">End Date</label>
                <input
                  type="text"
                  disabled={exp.current}
                  value={exp.current ? 'Present' : exp.endDate}
                  onChange={e => updateExp(expIdx, { ...exp, endDate: e.target.value })}
                  placeholder="2025 May"
                  className="w-full px-3 py-1.5 text-sm border border-neutral-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 outline-none transition disabled:bg-neutral-100 disabled:text-neutral-500"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id={`current-${exp.id}`}
              checked={exp.current}
              onChange={e => updateExp(expIdx, { ...exp, current: e.target.checked })}
              className="rounded text-emerald-800 focus:ring-emerald-800 h-4 w-4"
            />
            <label htmlFor={`current-${exp.id}`} className="text-xs text-neutral-700 font-medium cursor-pointer">
              I currently work in this role
            </label>
          </div>

          {/* Bullet points section */}
          <div className="space-y-1.5 pt-2 border-t border-neutral-100">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-neutral-700">Achievement Bullets</label>
              <button
                type="button"
                onClick={() => addBullet(expIdx)}
                className="text-xs text-emerald-800 font-semibold hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Bullet</span>
              </button>
            </div>

            {exp.bullets.map((bullet, bIdx) => {
              const isDragging = draggingBullet?.expIdx === expIdx && draggingBullet?.bIdx === bIdx;
              const isOver = dragOverBullet?.expIdx === expIdx && dragOverBullet?.bIdx === bIdx;

              return (
                <div
                  key={bIdx}
                  draggable
                  onDragStart={e => {
                    setDraggingBullet({ expIdx, bIdx });
                    e.dataTransfer.effectAllowed = 'move';
                    e.dataTransfer.setData('text/plain', `${expIdx}:${bIdx}`);
                  }}
                  onDragOver={e => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = 'move';
                    if (draggingBullet && draggingBullet.expIdx === expIdx && draggingBullet.bIdx !== bIdx) {
                      setDragOverBullet({ expIdx, bIdx });
                    }
                  }}
                  onDragLeave={() => {
                    if (dragOverBullet?.expIdx === expIdx && dragOverBullet?.bIdx === bIdx) {
                      setDragOverBullet(null);
                    }
                  }}
                  onDrop={e => {
                    e.preventDefault();
                    if (draggingBullet && draggingBullet.expIdx === expIdx && draggingBullet.bIdx !== bIdx) {
                      moveBullet(expIdx, draggingBullet.bIdx, bIdx);
                    }
                    setDraggingBullet(null);
                    setDragOverBullet(null);
                  }}
                  onDragEnd={() => {
                    setDraggingBullet(null);
                    setDragOverBullet(null);
                  }}
                  className={`space-y-1 p-2 rounded-lg border transition ${
                    isDragging
                      ? 'opacity-40 border-dashed border-emerald-500 bg-emerald-50/30'
                      : isOver
                      ? 'border-emerald-600 ring-2 ring-emerald-500/30 bg-emerald-50/60'
                      : 'bg-neutral-50/70 border-neutral-200/70 hover:border-neutral-300'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {/* Reorder controls: Drag handle & Move Up/Down */}
                    <div className="flex flex-col items-center gap-0.5 pt-1 flex-shrink-0">
                      <div
                        className="cursor-grab active:cursor-grabbing text-neutral-400 hover:text-neutral-700 p-0.5 rounded"
                        title="Drag to reorder bullet"
                      >
                        <GripVertical className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex flex-col">
                        <button
                          type="button"
                          disabled={bIdx === 0}
                          onClick={() => moveBullet(expIdx, bIdx, bIdx - 1)}
                          className="p-0.5 text-neutral-400 hover:text-neutral-800 disabled:opacity-20 disabled:hover:text-neutral-400 rounded transition"
                          title="Move bullet up"
                        >
                          <ChevronUp className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          disabled={bIdx === exp.bullets.length - 1}
                          onClick={() => moveBullet(expIdx, bIdx, bIdx + 1)}
                          className="p-0.5 text-neutral-400 hover:text-neutral-800 disabled:opacity-20 disabled:hover:text-neutral-400 rounded transition"
                          title="Move bullet down"
                        >
                          <ChevronDown className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <textarea
                      rows={2}
                      value={bullet}
                      onChange={e => updateBullet(expIdx, bIdx, e.target.value)}
                      placeholder="e.g. Architected and led real-time streaming engine, cutting latency by 45% and scaling to 1M+ users..."
                      className="flex-1 p-2 text-xs border border-neutral-300 rounded focus:ring-1 focus:ring-emerald-700 focus:border-emerald-700 outline-none transition bg-white"
                    />

                    <button
                      type="button"
                      onClick={() => deleteBullet(expIdx, bIdx)}
                      className="text-neutral-400 hover:text-red-500 p-1 self-start"
                      title="Remove Bullet"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>


                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
