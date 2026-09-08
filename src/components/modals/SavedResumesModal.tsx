'use client';

import React, { useState } from 'react';
import { ResumeData } from '@/types/resume';
import {
  FileText,
  Plus,
  Copy,
  Trash2,
  Check,
  X,
  Edit2,
  FolderArchive,
  Sparkles,
  ArrowRight,
  Clock,
  Layout
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  savedResumes: ResumeData[];
  activeResumeId: string;
  onSelectResume: (resume: ResumeData) => void;
  onSaveNewResume: (title: string) => void;
  onDuplicateResume: (id: string) => void;
  onRenameResume: (id: string, newTitle: string) => void;
  onDeleteResume: (id: string) => void;
}

export const SavedResumesModal: React.FC<Props> = ({
  isOpen,
  onClose,
  savedResumes,
  activeResumeId,
  onSelectResume,
  onSaveNewResume,
  onDuplicateResume,
  onRenameResume,
  onDeleteResume,
}) => {
  const [newTitle, setNewTitle] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  if (!isOpen) return null;

  const handleCreateNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onSaveNewResume(newTitle.trim());
    setNewTitle('');
  };

  const startRename = (r: ResumeData) => {
    setEditingId(r.id);
    setEditingTitle(r.title || r.personalInfo.fullName);
  };

  const submitRename = (id: string) => {
    if (editingTitle.trim()) {
      onRenameResume(id, editingTitle.trim());
    }
    setEditingId(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-[#FAF8F2]">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
              <FolderArchive className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-neutral-900 text-base">My Saved Resumes & Versions</h3>
              <p className="text-xs text-neutral-500">
                Manage different variations (e.g. Architect, Backend Lead, 1-Page Compact) saved in your browser
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-700 p-1.5 rounded-lg transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Save As New Version Box */}
          <form onSubmit={handleCreateNew} className="p-4 bg-emerald-50/60 border border-emerald-200/80 rounded-xl space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
              <Plus className="w-4 h-4 text-emerald-700" />
              <span>Save Current Resume As New Version</span>
            </div>
            <p className="text-[11px] text-emerald-800/80">
              Create an independent copy with customized keywords, bolded highlights, or different target job titles.
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder="e.g. Alex Morgan - Senior Full Stack Engineer"
                className="flex-1 px-3 py-2 text-xs border border-emerald-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-emerald-700 text-slate-800"
              />
              <button
                type="submit"
                disabled={!newTitle.trim()}
                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-lg shadow-sm transition disabled:opacity-50 whitespace-nowrap"
              >
                Save New Version
              </button>
            </div>
          </form>

          {/* Resumes List */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
                Saved Resumes ({savedResumes.length})
              </h4>
            </div>

            <div className="space-y-3">
              {savedResumes.map(r => {
                const isActive = r.id === activeResumeId;
                const isEditing = editingId === r.id;

                return (
                  <div
                    key={r.id}
                    className={`p-4 rounded-xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isActive
                        ? 'border-emerald-600 bg-emerald-50/30 ring-1 ring-emerald-600'
                        : 'border-neutral-200 bg-white hover:border-neutral-300'
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      {isEditing ? (
                        <div className="flex items-center gap-2 mb-1">
                          <input
                            type="text"
                            value={editingTitle}
                            onChange={e => setEditingTitle(e.target.value)}
                            className="px-2 py-1 text-xs border border-emerald-500 rounded font-semibold text-slate-900 flex-1 outline-none"
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={() => submitRename(r.id)}
                            className="p-1 bg-emerald-700 text-white rounded hover:bg-emerald-800"
                            title="Save title"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingId(null)}
                            className="p-1 text-slate-400 hover:text-slate-600"
                            title="Cancel"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-sm text-slate-900 truncate">
                            {r.title || r.personalInfo.fullName || 'Untitled Resume'}
                          </span>
                          {isActive && (
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full border border-emerald-200">
                              Active
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => startRename(r)}
                            className="text-slate-400 hover:text-slate-700 p-0.5 transition"
                            title="Rename"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}

                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span className="truncate">{r.personalInfo.jobTitle || 'No title'}</span>
                        <span>•</span>
                        <span className="capitalize">{r.settings?.template || 'modern'} template</span>
                        <span>•</span>
                        <span>{r.experiences?.length || 0} jobs</span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 shrink-0">
                      {!isActive ? (
                        <button
                          type="button"
                          onClick={() => {
                            onSelectResume(r);
                            onClose();
                          }}
                          className="flex items-center gap-1 px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-lg shadow-sm transition"
                        >
                          <span>Switch to This</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <span className="text-xs text-emerald-700 font-semibold px-2 py-1 bg-emerald-100/60 rounded">
                          Currently Editing
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() => onDuplicateResume(r.id)}
                        className="p-2 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
                        title="Duplicate this resume"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>

                      {savedResumes.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Delete "${r.title || 'this resume'}"? This cannot be undone.`)) {
                              onDeleteResume(r.id);
                            }
                          }}
                          className="p-2 text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 rounded-lg transition"
                          title="Delete resume"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-200 bg-neutral-50 flex justify-between items-center text-xs text-slate-500">
          <span>All resumes are saved automatically to your local browser storage.</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-neutral-800 text-white text-xs font-bold rounded-lg hover:bg-neutral-900 transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
