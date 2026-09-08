'use client';

import React from 'react';
import {
  ShieldCheck,
  Target,
  Download,
  FolderOpen,
  Layout,
  FolderArchive
} from 'lucide-react';
import { DkLogo } from '@/components/common/DkLogo';

interface Props {
  atsScore: number;
  currentResumeTitle?: string;
  savedResumesCount?: number;
  onOpenSavedResumesModal?: () => void;
  onOpenAtsAudit: () => void;
  onOpenJdMatcher: () => void;
  onOpenImportModal: () => void;
  onOpenExportModal: () => void;
  onOpenTemplatesModal: () => void;
}

export const Navbar: React.FC<Props> = ({
  atsScore,
  currentResumeTitle,
  savedResumesCount = 1,
  onOpenSavedResumesModal,
  onOpenAtsAudit,
  onOpenJdMatcher,
  onOpenImportModal,
  onOpenExportModal,
  onOpenTemplatesModal,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F2]/90 backdrop-blur-md border-b border-neutral-200/80 px-4 py-2.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <a href="/" className="flex items-center gap-2.5 group">
            <DkLogo className="w-8 h-8 flex-shrink-0" />
            <div className="flex flex-col">
              <span className="font-extrabold text-neutral-900 text-sm tracking-tight flex items-center gap-1.5">
                DK Resume Builder
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/90 px-1.5 py-0.5 rounded uppercase tracking-wider">
                  Offline-First
                </span>
              </span>
              <span className="text-[10px] text-neutral-500 font-medium -mt-0.5">
                Privacy-First • 100% Local Storage • ATS Ready
              </span>
            </div>
          </a>
        </div>

        {/* Center: Live ATS Audit Pill & JD Matcher */}
        <div className="flex items-center gap-2">
          {/* Live ATS Score button */}
          <button
            onClick={onOpenAtsAudit}
            className="flex items-center gap-2 px-3 py-1.5 bg-white hover:bg-emerald-50/70 border border-neutral-200 hover:border-emerald-300 rounded-full text-xs font-semibold text-neutral-800 transition shadow-sm"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>ATS Score:</span>
            <span className={`px-2 py-0.5 rounded-full font-bold text-[11px] ${
              atsScore >= 80
                ? 'bg-emerald-100 text-emerald-800'
                : atsScore >= 60
                ? 'bg-amber-100 text-amber-800'
                : 'bg-rose-100 text-rose-800'
            }`}>
              {atsScore}/100
            </span>
          </button>

          {/* Target JD Matcher */}
          <button
            onClick={onOpenJdMatcher}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-neutral-50 border border-neutral-200 rounded-full text-xs font-semibold text-neutral-700 transition shadow-sm"
          >
            <Target className="w-3.5 h-3.5 text-neutral-500" />
            <span>Target JD Matcher</span>
          </button>
        </div>

        {/* Right: Actions (My Resumes, Import, Templates, Export) */}
        <div className="flex items-center gap-2">
          {onOpenSavedResumesModal && (
            <button
              onClick={onOpenSavedResumesModal}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-neutral-300 hover:border-emerald-600 hover:bg-emerald-50/50 text-neutral-800 text-xs font-bold rounded-lg transition shadow-sm"
              title="View, save new versions, and switch between your resumes"
            >
              <FolderArchive className="w-3.5 h-3.5 text-emerald-700" />
              <span>My Resumes</span>
              <span className="px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">
                {savedResumesCount}
              </span>
            </button>
          )}

          <button
            onClick={onOpenImportModal}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold rounded-lg transition"
          >
            <FolderOpen className="w-3.5 h-3.5" />
            <span>Import / Samples</span>
          </button>

          <button
            onClick={onOpenTemplatesModal}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold rounded-lg transition"
          >
            <Layout className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Templates</span>
          </button>

          <button
            onClick={onOpenExportModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-lg shadow-sm transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>
        </div>
      </div>
    </header>
  );
};
