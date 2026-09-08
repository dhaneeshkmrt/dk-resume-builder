'use client';

import React, { useState } from 'react';
import { ResumeData } from '@/types/resume';
import { SAMPLE_RESUMES } from '@/data/sampleResumes';
import { parseResumeFromText } from '@/utils/resumeParser';
import { Upload, FileCode, Check, X, Sparkles, FolderOpen } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onImportResume: (resume: ResumeData) => void;
}

export const ImportModal: React.FC<Props> = ({ isOpen, onClose, onImportResume }) => {
  const [pasteText, setPasteText] = useState('');
  const [activeTab, setActiveTab] = useState<'presets' | 'paste' | 'file'>('presets');

  if (!isOpen) return null;

  const handleSelectPreset = (data: ResumeData) => {
    onImportResume(data);
    onClose();
  };

  const handleImportPasted = () => {
    const parsed = parseResumeFromText(pasteText);
    if (parsed) {
      onImportResume({
        ...SAMPLE_RESUMES[0].data,
        ...parsed,
        id: `imported-${Date.now()}`,
      } as ResumeData);
      onClose();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      const text = event.target?.result as string;
      if (text) {
        const parsed = parseResumeFromText(text);
        onImportResume({
          ...SAMPLE_RESUMES[0].data,
          ...parsed,
          id: `file-imported-${Date.now()}`,
        } as ResumeData);
        onClose();
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-[#FAF8F2]">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
              <FolderOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-neutral-900 text-base">Import Resume / Load Template</h3>
              <p className="text-xs text-neutral-500">Pick an industry sample or import your existing profile</p>
            </div>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-700 p-1.5 rounded-lg transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Header */}
        <div className="flex border-b border-neutral-200 bg-neutral-50 px-6 pt-2 gap-2 text-xs font-bold">
          <button
            onClick={() => setActiveTab('presets')}
            className={`pb-2.5 px-3 border-b-2 transition ${
              activeTab === 'presets'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            Curated Industry Presets
          </button>
          <button
            onClick={() => setActiveTab('paste')}
            className={`pb-2.5 px-3 border-b-2 transition ${
              activeTab === 'paste'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            Paste Text / JSON Resume
          </button>
          <button
            onClick={() => setActiveTab('file')}
            className={`pb-2.5 px-3 border-b-2 transition ${
              activeTab === 'file'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            Upload File
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {activeTab === 'presets' && (
            <div className="space-y-3">
              <p className="text-xs text-neutral-600">
                Choose a pre-filled, highly optimized ATS resume tailored for top tech and business roles:
              </p>
              <div className="space-y-2">
                {SAMPLE_RESUMES.map(preset => (
                  <button
                    key={preset.id}
                    onClick={() => handleSelectPreset(preset.data)}
                    className="w-full text-left p-4 rounded-xl border border-neutral-200 hover:border-emerald-600 hover:bg-emerald-50/40 transition flex items-center justify-between group shadow-sm"
                  >
                    <div>
                      <div className="font-bold text-sm text-neutral-900 group-hover:text-emerald-800">
                        {preset.label}
                      </div>
                      <div className="text-xs text-neutral-500 mt-0.5">
                        {preset.data.personalInfo.fullName} • {preset.data.experiences.length} Positions • {preset.data.skillCategories.length} Skill Groups
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-lg">
                      Load
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'paste' && (
            <div className="space-y-3">
              <textarea
                rows={8}
                value={pasteText}
                onChange={e => setPasteText(e.target.value)}
                placeholder="Paste JSON Resume schema (jsonresume.org) or raw text of your resume..."
                className="w-full p-3 text-xs border border-neutral-300 rounded-xl focus:ring-1 focus:ring-emerald-700 outline-none font-mono"
              />
              <button
                type="button"
                onClick={handleImportPasted}
                disabled={!pasteText.trim()}
                className="w-full py-2 bg-emerald-800 hover:bg-emerald-900 disabled:bg-neutral-300 text-white rounded-xl text-xs font-bold transition shadow-sm"
              >
                Parse and Import
              </button>
            </div>
          )}

          {activeTab === 'file' && (
            <div className="text-center py-10 border-2 border-dashed border-neutral-300 rounded-xl bg-neutral-50">
              <Upload className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
              <p className="text-xs font-semibold text-neutral-700 mb-1">Select JSON, TXT, or MD resume file</p>
              <p className="text-[11px] text-neutral-400 mb-4">Files will be parsed automatically</p>
              <label className="cursor-pointer px-4 py-2 bg-white border border-neutral-300 hover:bg-neutral-100 text-xs font-bold text-neutral-700 rounded-xl shadow-sm transition">
                Choose File
                <input type="file" accept=".json,.txt,.md" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
