'use client';

import React from 'react';
import {
  Download,
  FileCode,
  Layout,
  FolderArchive
} from 'lucide-react';
import { DkLogo } from '@/components/common/DkLogo';

interface Props {
  currentResumeTitle?: string;
  savedResumesCount?: number;
  onOpenSavedResumesModal?: () => void;
  onOpenImportModal: () => void;
  onOpenExportModal: () => void;
  onOpenTemplatesModal: () => void;
}

export const Navbar: React.FC<Props> = ({
  currentResumeTitle,
  savedResumesCount = 1,
  onOpenSavedResumesModal,
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
            title="Import resume from JSON or convert your existing resume via prompt"
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Import JSON</span>
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
