'use client';

import React, { useState } from 'react';
import { SkillCategory } from '@/types/resume';
import { Plus, Trash2, X, GripVertical, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  skillCategories: SkillCategory[];
  onChange: (categories: SkillCategory[]) => void;
}

export const SkillsForm: React.FC<Props> = ({ skillCategories, onChange }) => {
  const [newSkillInput, setNewSkillInput] = useState<{ [catId: string]: string }>({});

  // Drag & drop state for categories
  const [draggingCatIdx, setDraggingCatIdx] = useState<number | null>(null);
  const [dragOverCatIdx, setDragOverCatIdx] = useState<number | null>(null);

  // Drag & drop state for individual skills within categories
  const [draggingSkill, setDraggingSkill] = useState<{ catId: string; sIdx: number } | null>(null);
  const [dragOverSkill, setDragOverSkill] = useState<{ catId: string; sIdx: number } | null>(null);

  const addCategory = () => {
    const newCat: SkillCategory = {
      id: `cat-${Date.now()}`,
      categoryName: 'New Category',
      skills: []
    };
    onChange([...skillCategories, newCat]);
  };

  const updateCategoryName = (catId: string, name: string) => {
    onChange(
      skillCategories.map(c => (c.id === catId ? { ...c, categoryName: name } : c))
    );
  };

  const deleteCategory = (catId: string) => {
    onChange(skillCategories.filter(c => c.id !== catId));
  };

  const moveCategory = (fromIdx: number, toIdx: number) => {
    if (toIdx < 0 || toIdx >= skillCategories.length) return;
    const list = [...skillCategories];
    const [moved] = list.splice(fromIdx, 1);
    list.splice(toIdx, 0, moved);
    onChange(list);
  };

  const updateCategorySeparator = (catId: string, separator: 'comma' | 'pipe') => {
    onChange(
      skillCategories.map(c => (c.id === catId ? { ...c, separator } : c))
    );
  };

  const addSkillToCategory = (catId: string, overrideText?: string) => {
    const text = (overrideText !== undefined ? overrideText : (newSkillInput[catId] || '')).trim();
    if (!text) return;

    // Support comma (,) and pipe (|) separated multi-skills
    const incoming = text
      .split(/[,|]/)
      .map(s => s.trim())
      .filter(Boolean);

    if (incoming.length === 0) return;

    onChange(
      skillCategories.map(c => {
        if (c.id === catId) {
          const currentSkills = [...c.skills];
          incoming.forEach(skill => {
            if (!currentSkills.includes(skill)) {
              currentSkills.push(skill);
            }
          });
          return { ...c, skills: currentSkills };
        }
        return c;
      })
    );
    setNewSkillInput({ ...newSkillInput, [catId]: '' });
  };

  const removeSkillFromCategory = (catId: string, skill: string) => {
    onChange(
      skillCategories.map(c => {
        if (c.id === catId) {
          return { ...c, skills: c.skills.filter(s => s !== skill) };
        }
        return c;
      })
    );
  };

  const moveSkill = (catId: string, fromIdx: number, toIdx: number) => {
    const cat = skillCategories.find(c => c.id === catId);
    if (!cat || toIdx < 0 || toIdx >= cat.skills.length) return;
    const skills = [...cat.skills];
    const [moved] = skills.splice(fromIdx, 1);
    skills.splice(toIdx, 0, moved);
    onChange(
      skillCategories.map(c => (c.id === catId ? { ...c, skills } : c))
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-xs text-neutral-500 font-medium">
          Group skills into clear categories for better ATS categorization. Reorder groups or skills via drag-and-drop or arrows.
        </span>
        <button
          type="button"
          onClick={addCategory}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-800 text-white rounded-lg text-xs font-bold hover:bg-emerald-900 transition shadow-sm flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Skill Group</span>
        </button>
      </div>

      <div className="space-y-3">
        {skillCategories.map((cat, catIdx) => {
          const isCatDragging = draggingCatIdx === catIdx;
          const isCatOver = dragOverCatIdx === catIdx;

          return (
            <div
              key={cat.id}
              draggable
              onDragStart={e => {
                // Only initiate category drag if not dragging an inner skill
                if (draggingSkill) return;
                setDraggingCatIdx(catIdx);
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/plain', `category:${catIdx}`);
              }}
              onDragOver={e => {
                if (draggingSkill) return;
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                if (draggingCatIdx !== null && draggingCatIdx !== catIdx) {
                  setDragOverCatIdx(catIdx);
                }
              }}
              onDragLeave={() => {
                if (dragOverCatIdx === catIdx) {
                  setDragOverCatIdx(null);
                }
              }}
              onDrop={e => {
                if (draggingSkill) return;
                e.preventDefault();
                if (draggingCatIdx !== null && draggingCatIdx !== catIdx) {
                  moveCategory(draggingCatIdx, catIdx);
                }
                setDraggingCatIdx(null);
                setDragOverCatIdx(null);
              }}
              onDragEnd={() => {
                setDraggingCatIdx(null);
                setDragOverCatIdx(null);
              }}
              className={`p-3.5 border rounded-xl bg-white shadow-sm space-y-3 transition ${
                isCatDragging
                  ? 'opacity-40 border-dashed border-emerald-500 bg-emerald-50/20'
                  : isCatOver
                  ? 'border-emerald-600 ring-2 ring-emerald-500/30 bg-emerald-50/40'
                  : 'border-neutral-200 hover:border-neutral-300'
              }`}
            >
              {/* Category Header with Reorder Controls & Delete */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1">
                  {/* Category Drag Handle */}
                  <div
                    className="cursor-grab active:cursor-grabbing text-neutral-400 hover:text-neutral-700 p-0.5 rounded"
                    title="Drag to reorder skill group"
                  >
                    <GripVertical className="w-4 h-4" />
                  </div>
                  {/* Category Move Up / Down Buttons */}
                  <div className="flex items-center">
                    <button
                      type="button"
                      disabled={catIdx === 0}
                      onClick={() => moveCategory(catIdx, catIdx - 1)}
                      className="p-1 text-neutral-400 hover:text-neutral-800 disabled:opacity-20 disabled:hover:text-neutral-400 rounded transition"
                      title="Move skill group up"
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={catIdx === skillCategories.length - 1}
                      onClick={() => moveCategory(catIdx, catIdx + 1)}
                      className="p-1 text-neutral-400 hover:text-neutral-800 disabled:opacity-20 disabled:hover:text-neutral-400 rounded transition"
                      title="Move skill group down"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <input
                  type="text"
                  value={cat.categoryName}
                  onChange={e => updateCategoryName(cat.id, e.target.value)}
                  placeholder="Category Name (e.g. Languages, Cloud, Frameworks)"
                  className="font-bold text-xs text-neutral-800 border-b border-transparent hover:border-neutral-300 focus:border-emerald-700 outline-none px-1 py-0.5 flex-1"
                />

                {/* Separator style toggle: Comma vs Pipe */}
                <div className="flex items-center gap-1 bg-neutral-100 p-0.5 rounded-lg border border-neutral-200 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => updateCategorySeparator(cat.id, 'comma')}
                    className={`px-2 py-0.5 text-[10px] font-bold rounded transition ${
                      (cat.separator || 'comma') === 'comma'
                        ? 'bg-white text-emerald-800 shadow-xs'
                        : 'text-neutral-500 hover:text-neutral-800'
                    }`}
                    title="Render skills separated by comma (,)"
                  >
                    , Comma
                  </button>
                  <button
                    type="button"
                    onClick={() => updateCategorySeparator(cat.id, 'pipe')}
                    className={`px-2 py-0.5 text-[10px] font-bold rounded transition ${
                      cat.separator === 'pipe'
                        ? 'bg-white text-emerald-800 shadow-xs'
                        : 'text-neutral-500 hover:text-neutral-800'
                    }`}
                    title="Render skills separated by pipe (|)"
                  >
                    | Pipe
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => deleteCategory(cat.id)}
                  className="text-neutral-400 hover:text-red-500 p-1"
                  title="Delete Group"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Tag Pills with Drag & Drop and Move Left/Right */}
              <div className="flex flex-wrap gap-1.5 min-h-[30px] p-1 bg-neutral-50/50 rounded-lg border border-neutral-100">
                {cat.skills.length === 0 && (
                  <span className="text-[11px] text-neutral-400 italic py-0.5 px-1">
                    No skills in this group yet. Add below.
                  </span>
                )}
                {cat.skills.map((skill, sIdx) => {
                  const isSkillDragging = draggingSkill?.catId === cat.id && draggingSkill?.sIdx === sIdx;
                  const isSkillOver = dragOverSkill?.catId === cat.id && dragOverSkill?.sIdx === sIdx;

                  return (
                    <span
                      key={sIdx}
                      draggable
                      onDragStart={e => {
                        e.stopPropagation();
                        setDraggingSkill({ catId: cat.id, sIdx });
                        e.dataTransfer.effectAllowed = 'move';
                        e.dataTransfer.setData('text/plain', `skill:${cat.id}:${sIdx}`);
                      }}
                      onDragOver={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        e.dataTransfer.dropEffect = 'move';
                        if (draggingSkill && (draggingSkill.catId !== cat.id || draggingSkill.sIdx !== sIdx)) {
                          setDragOverSkill({ catId: cat.id, sIdx });
                        }
                      }}
                      onDragLeave={e => {
                        e.stopPropagation();
                        if (dragOverSkill?.catId === cat.id && dragOverSkill?.sIdx === sIdx) {
                          setDragOverSkill(null);
                        }
                      }}
                      onDrop={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        if (draggingSkill && draggingSkill.catId === cat.id && draggingSkill.sIdx !== sIdx) {
                          moveSkill(cat.id, draggingSkill.sIdx, sIdx);
                        }
                        setDraggingSkill(null);
                        setDragOverSkill(null);
                      }}
                      onDragEnd={e => {
                        e.stopPropagation();
                        setDraggingSkill(null);
                        setDragOverSkill(null);
                      }}
                      className={`inline-flex items-center gap-1 pl-1.5 pr-2 py-1 text-xs rounded-md transition font-medium group cursor-grab active:cursor-grabbing ${
                        isSkillDragging
                          ? 'opacity-40 border border-dashed border-emerald-500 bg-emerald-50'
                          : isSkillOver
                          ? 'ring-2 ring-emerald-500 bg-emerald-100 text-emerald-900'
                          : 'bg-neutral-100 hover:bg-neutral-200/80 text-neutral-800'
                      }`}
                      title="Drag to reorder skill, or use arrow buttons"
                    >
                      {/* Left Reorder Arrow */}
                      <button
                        type="button"
                        disabled={sIdx === 0}
                        onClick={e => {
                          e.stopPropagation();
                          moveSkill(cat.id, sIdx, sIdx - 1);
                        }}
                        className="opacity-0 group-hover:opacity-100 hover:text-emerald-700 disabled:opacity-0 p-0.2 transition"
                        title="Move left"
                      >
                        <ChevronLeft className="w-3 h-3" />
                      </button>

                      <span>{skill}</span>

                      {/* Right Reorder Arrow */}
                      <button
                        type="button"
                        disabled={sIdx === cat.skills.length - 1}
                        onClick={e => {
                          e.stopPropagation();
                          moveSkill(cat.id, sIdx, sIdx + 1);
                        }}
                        className="opacity-0 group-hover:opacity-100 hover:text-emerald-700 disabled:opacity-0 p-0.2 transition"
                        title="Move right"
                      >
                        <ChevronRight className="w-3 h-3" />
                      </button>

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={e => {
                          e.stopPropagation();
                          removeSkillFromCategory(cat.id, skill);
                        }}
                        className="text-neutral-400 hover:text-red-500 ml-0.5"
                        title="Remove skill"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  );
                })}
              </div>

              {/* Add Skill Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSkillInput[cat.id] || ''}
                  onChange={e => {
                    const val = e.target.value;
                    // If user typed a comma or pipe at the end, immediately add the skill
                    if (val.endsWith(',') || val.endsWith('|')) {
                      const beforeSep = val.slice(0, -1).trim();
                      if (beforeSep) {
                        addSkillToCategory(cat.id, beforeSep);
                        return;
                      }
                    }
                    setNewSkillInput({ ...newSkillInput, [cat.id]: val });
                  }}
                  onPaste={e => {
                    const pasted = e.clipboardData.getData('text');
                    if (pasted && (pasted.includes(',') || pasted.includes('|'))) {
                      e.preventDefault();
                      addSkillToCategory(cat.id, pasted);
                    }
                  }}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addSkillToCategory(cat.id);
                    }
                  }}
                  placeholder="Type or paste skills (supports comma , or pipe | e.g. React, Next.js | TypeScript)..."
                  className="flex-1 px-2.5 py-1 text-xs border border-neutral-300 rounded focus:ring-1 focus:ring-emerald-700 focus:border-emerald-700 outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => addSkillToCategory(cat.id)}
                  className="px-3 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold rounded transition"
                >
                  Add
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
