'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ResumeData, TemplateId, FontFamily } from '@/types/resume';
import { DEFAULT_RESUME } from '@/data/sampleResumes';
import { calculateAtsAudit } from '@/utils/atsScorer';
import {
  loadAllSavedResumes,
  saveResumeToCollection,
  duplicateResume,
  createNewResume,
  renameResume,
  deleteResume,
  getActiveResumeId,
  setActiveResumeId,
} from '@/utils/resumeStorage';
import { Navbar } from '@/components/layout/Navbar';
import { FormEditor } from '@/components/editor/FormEditor';
import { ResumePreview } from '@/components/preview/ResumePreview';
import { AtsAuditModal } from '@/components/ats/AtsAuditModal';
import { JobDescriptionMatcher } from '@/components/ats/JobDescriptionMatcher';
import { ImportModal } from '@/components/modals/ImportModal';
import { ExportModal } from '@/components/modals/ExportModal';
import { TemplatesModal } from '@/components/modals/TemplatesModal';
import { SavedResumesModal } from '@/components/modals/SavedResumesModal';
import { GripVertical } from 'lucide-react';

export default function ResumeBuilderPage() {
  const [resume, setResume] = useState<ResumeData>(DEFAULT_RESUME);
  const [savedResumes, setSavedResumes] = useState<ResumeData[]>([DEFAULT_RESUME]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [splitPercent, setSplitPercent] = useState<number>(50);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Modals state
  const [isAtsModalOpen, setIsAtsModalOpen] = useState(false);
  const [isJdModalOpen, setIsJdModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isTemplatesModalOpen, setIsTemplatesModalOpen] = useState(false);
  const [isSavedResumesModalOpen, setIsSavedResumesModalOpen] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const all = loadAllSavedResumes();
      setSavedResumes(all);

      const activeId = getActiveResumeId();
      const current = (activeId && all.find(r => r.id === activeId)) || all[0] || DEFAULT_RESUME;
      setResume(current);

      const savedSplit = localStorage.getItem('dk_resume_builder_split_percent') || localStorage.getItem('weekday_resume_builder_split_percent');
      if (savedSplit) {
        const val = parseFloat(savedSplit);
        if (!isNaN(val) && val >= 20 && val <= 80) {
          setSplitPercent(val);
        }
      }
    } catch (e) {
      console.error('Failed to load saved resumes from localStorage', e);
      setResume(DEFAULT_RESUME);
    }
    setIsLoaded(true);
  }, []);

  // Save split percent whenever it changes
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem('weekday_resume_builder_split_percent', splitPercent.toString());
      } catch {}
    }
  }, [splitPercent, isLoaded]);

  // Auto-save to localStorage whenever the active resume changes
  useEffect(() => {
    if (isLoaded && resume) {
      try {
        const updatedList = saveResumeToCollection(resume);
        setSavedResumes(updatedList);
      } catch (e) {
        console.error('Failed to save to localStorage', e);
      }
    }
  }, [resume, isLoaded]);

  // Multiple resumes management handlers
  const handleSelectResume = (selected: ResumeData) => {
    setResume(selected);
    setActiveResumeId(selected.id);
  };

  const handleSaveNewResume = (title: string) => {
    const { list, newResume } = createNewResume(title, resume);
    setSavedResumes(list);
    setResume(newResume);
  };

  const handleDuplicateResume = (id: string) => {
    const { list, newResume } = duplicateResume(id);
    setSavedResumes(list);
    setResume(newResume);
  };

  const handleRenameResume = (id: string, newTitle: string) => {
    const list = renameResume(id, newTitle);
    setSavedResumes(list);
    if (resume.id === id) {
      setResume({ ...resume, title: newTitle });
    }
  };

  const handleDeleteResume = (id: string) => {
    const { list, nextActiveResume } = deleteResume(id);
    setSavedResumes(list);
    if (nextActiveResume && resume.id === id) {
      setResume(nextActiveResume);
    }
  };

  const handleResetSplit = () => {
    setSplitPercent(50);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    e.preventDefault();
    setIsDragging(true);

    const onPointerMove = (moveEvent: PointerEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      if (rect.width <= 0) return;
      const currentX = moveEvent.clientX - rect.left;
      const newPercent = (currentX / rect.width) * 100;
      const clamped = Math.min(Math.max(Math.round(newPercent * 10) / 10, 20), 80);
      setSplitPercent(clamped);
    };

    const onPointerUp = () => {
      setIsDragging(false);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      document.body.style.removeProperty('cursor');
      document.body.style.removeProperty('user-select');
    };

    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  const audit = calculateAtsAudit(resume, resume.targetJobDescription);

  return (
    <div className="h-screen max-h-screen flex flex-col overflow-hidden bg-[#FAF8F2]">
      {/* Top DK Navbar */}
      <div className="flex-shrink-0 z-30">
        <Navbar
          atsScore={audit.overallScore}
          currentResumeTitle={resume.title || resume.personalInfo.fullName}
          savedResumesCount={savedResumes.length}
          onOpenSavedResumesModal={() => setIsSavedResumesModalOpen(true)}
          onOpenAtsAudit={() => setIsAtsModalOpen(true)}
          onOpenJdMatcher={() => setIsJdModalOpen(true)}
          onOpenImportModal={() => setIsImportModalOpen(true)}
          onOpenExportModal={() => setIsExportModalOpen(true)}
          onOpenTemplatesModal={() => setIsTemplatesModalOpen(true)}
        />
      </div>

      {/* Main Workspace (Split Screen) - Independently Scrollable Left and Right Panes with Draggable Center Divider */}
      <main
        ref={containerRef}
        style={{ '--split-left': `${splitPercent}%` } as React.CSSProperties}
        className="flex-1 min-h-0 flex flex-col lg:flex-row overflow-hidden relative"
      >
        {/* Left Pane: Form Editor (Own Scrollbar) */}
        <section
          className={`w-full lg:w-[var(--split-left)] h-1/2 lg:h-full min-h-0 flex flex-col border-b lg:border-b-0 border-neutral-200 overflow-hidden shrink-0 ${
            isDragging ? 'pointer-events-none select-none' : ''
          }`}
        >
          <FormEditor
            resume={resume}
            onChange={setResume}
            onOpenJdMatcher={() => setIsJdModalOpen(true)}
            onOpenAtsScore={() => setIsAtsModalOpen(true)}
          />
        </section>

        {/* Center Drag Line (Desktop Only) */}
        <div
          onPointerDown={handlePointerDown}
          onDoubleClick={handleResetSplit}
          title="Drag to adjust panel width • Double-click to reset (50/50)"
          className={`hidden lg:flex items-center justify-center w-3 -mx-1.5 z-20 cursor-col-resize select-none relative group ${
            isDragging ? 'bg-emerald-500/20' : 'hover:bg-emerald-500/10'
          } transition-colors`}
        >
          {/* Vertical line indicator */}
          <div
            className={`w-[2px] h-full transition-colors ${
              isDragging ? 'bg-emerald-600' : 'bg-neutral-200 group-hover:bg-emerald-500'
            }`}
          />

          {/* Center handle badge */}
          <div
            className={`absolute top-1/2 -translate-y-1/2 w-4 h-9 rounded-full border shadow-sm flex items-center justify-center transition-all ${
              isDragging
                ? 'bg-emerald-600 border-emerald-700 text-white scale-110 shadow-md'
                : 'bg-white border-neutral-300 text-neutral-400 group-hover:border-emerald-500 group-hover:text-emerald-600 group-hover:scale-105'
            }`}
          >
            <GripVertical className="w-3 h-3" />
          </div>
        </div>

        {/* Right Pane: Live Interactive Resume Preview (Own Scrollbar) */}
        <section
          className={`w-full lg:w-auto lg:flex-1 h-1/2 lg:h-full min-h-0 flex flex-col overflow-hidden ${
            isDragging ? 'pointer-events-none select-none' : ''
          }`}
        >
          <ResumePreview
            resume={resume}
            onResumeChange={setResume}
            onOpenExportModal={() => setIsExportModalOpen(true)}
            onOpenTemplateModal={() => setIsTemplatesModalOpen(true)}
          />
        </section>
      </main>

      {/* Modals */}
      <AtsAuditModal
        isOpen={isAtsModalOpen}
        onClose={() => setIsAtsModalOpen(false)}
        resume={resume}
        onOpenJdMatcher={() => {
          setIsAtsModalOpen(false);
          setIsJdModalOpen(true);
        }}
      />

      <JobDescriptionMatcher
        isOpen={isJdModalOpen}
        onClose={() => setIsJdModalOpen(false)}
        resume={resume}
        onUpdateResume={setResume}
      />

      <ImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportResume={setResume}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        resume={resume}
      />

      <TemplatesModal
        isOpen={isTemplatesModalOpen}
        onClose={() => setIsTemplatesModalOpen(false)}
        selectedTemplate={resume.settings.template}
        selectedFont={resume.settings.fontFamily}
        selectedColor={resume.settings.primaryColor}
        selectedContactStyle={resume.settings.contactHeaderStyle || 'bullets'}
        onSelectTemplate={(t: TemplateId) =>
          setResume({ ...resume, settings: { ...resume.settings, template: t } })
        }
        onSelectFont={(f: FontFamily) =>
          setResume({ ...resume, settings: { ...resume.settings, fontFamily: f } })
        }
        onSelectColor={(c: string) =>
          setResume({ ...resume, settings: { ...resume.settings, primaryColor: c } })
        }
        onSelectContactStyle={(contactHeaderStyle) =>
          setResume({ ...resume, settings: { ...resume.settings, contactHeaderStyle } })
        }
      />

      <SavedResumesModal
        isOpen={isSavedResumesModalOpen}
        onClose={() => setIsSavedResumesModalOpen(false)}
        savedResumes={savedResumes}
        activeResumeId={resume.id}
        onSelectResume={handleSelectResume}
        onSaveNewResume={handleSaveNewResume}
        onDuplicateResume={handleDuplicateResume}
        onRenameResume={handleRenameResume}
        onDeleteResume={handleDeleteResume}
      />
    </div>
  );
}
