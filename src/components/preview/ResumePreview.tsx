'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ResumeData, TemplateId } from '@/types/resume';
import { ModernTemplate } from './templates/ModernTemplate';
import { MinimalTemplate } from './templates/MinimalTemplate';
import {
  CompactTemplate,
  ExecutiveTemplate,
  TechnicalTemplate,
  SlateTemplate,
  AcademicTemplate,
  GraphicTemplate,
  ColorfulTemplate,
  ClassicTemplate,
  ProfessionalTemplate
} from './templates/OtherTemplates';
import { ZoomIn, ZoomOut, Download, Printer, CheckCircle2, Loader2, Bold } from 'lucide-react';
import { exportToDirectPdf, exportToPdfPrint } from '@/utils/exporters';
import { applyContentAwarePagination } from '@/utils/pagination';

interface Props {
  resume: ResumeData;
  onResumeChange?: (resume: ResumeData) => void;
  onOpenExportModal: () => void;
  onOpenTemplateModal: () => void;
}

function getFieldByPath(obj: any, path: string): string {
  const parts = path.split('.');
  let curr = obj;
  for (const part of parts) {
    if (curr === undefined || curr === null) return '';
    curr = curr[part];
  }
  return typeof curr === 'string' ? curr : '';
}

function setFieldByPath(obj: any, path: string, value: string): any {
  const parts = path.split('.');
  const cloned = JSON.parse(JSON.stringify(obj));
  let curr = cloned;
  for (let i = 0; i < parts.length - 1; i++) {
    curr = curr[parts[i]];
  }
  curr[parts[parts.length - 1]] = value;
  return cloned;
}

export const ResumePreview: React.FC<Props> = ({
  resume,
  onResumeChange,
  onOpenExportModal,
  onOpenTemplateModal,
}) => {
  const [zoom, setZoom] = useState<number>(100);
  const [pageCount, setPageCount] = useState<number>(1);
  const [isPdfDownloading, setIsPdfDownloading] = useState(false);
  const [selectionToolbar, setSelectionToolbar] = useState<{
    top: number;
    left: number;
    text: string;
    fieldPath: string;
    isAlreadyBold: boolean;
  } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Content-Aware Smart Pagination: cleanly breaks bullet points and sections across A4 pages
  useEffect(() => {
    const container = document.getElementById('resume-printable-area');
    if (!container) return;

    let isCancelled = false;

    const runPagination = () => {
      if (isCancelled) return;
      const result = applyContentAwarePagination(container, zoom);
      setPageCount(result.totalPages);
    };

    // Run pagination calculation after DOM has rendered template
    const timer = setTimeout(runPagination, 30);

    // Also re-calculate when custom web fonts finish loading to ensure pixel-perfect text metrics
    if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        if (!isCancelled) runPagination();
      });
    }

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [resume, zoom]);

  // Inline editing: make all [data-field-path] elements contentEditable
  const preEditTextRef = useRef<string>('');

  useEffect(() => {
    const container = document.getElementById('resume-printable-area');
    if (!container || !onResumeChange) return;

    const editables = container.querySelectorAll('[data-field-path]');
    editables.forEach(el => {
      const htmlEl = el as HTMLElement;
      if (htmlEl.contentEditable !== 'true') {
        htmlEl.contentEditable = 'true';
        htmlEl.style.outline = 'none';
        htmlEl.style.cursor = 'text';
      }
    });
  }, [resume, onResumeChange]);

  // Save edits on blur via event delegation (focusout bubbles, blur doesn't)
  useEffect(() => {
    const container = document.getElementById('resume-printable-area');
    if (!container || !onResumeChange) return;

    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (target.getAttribute('data-field-path')) {
        preEditTextRef.current = target.textContent || '';
      }
    };

    // Convert edited HTML back to markdown, preserving **bold** markers
    const htmlToMarkdown = (el: HTMLElement): string => {
      let result = '';
      el.childNodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) {
          result += node.textContent || '';
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          const tag = (node as HTMLElement).tagName.toLowerCase();
          const innerText = (node as HTMLElement).textContent || '';
          if (tag === 'strong' || tag === 'b') {
            result += `**${innerText}**`;
          } else {
            result += htmlToMarkdown(node as HTMLElement);
          }
        }
      });
      return result;
    };

    const handleFocusOut = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      const fieldPath = target.getAttribute('data-field-path');
      if (!fieldPath) return;

      const newVisibleText = target.textContent?.trim() || '';
      const oldVisibleText = preEditTextRef.current.trim();

      if (newVisibleText !== oldVisibleText && newVisibleText.length > 0) {
        const newValue = htmlToMarkdown(target).trim();
        const updatedResume = setFieldByPath(resume, fieldPath, newValue);
        onResumeChange(updatedResume);
      }
    };

    // Prevent Enter from inserting newlines in single-line fields
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (!target.getAttribute('data-field-path')) return;

      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        target.blur();
      }
      if (e.key === 'Escape') {
        target.textContent = preEditTextRef.current;
        target.blur();
      }
    };

    container.addEventListener('focusin', handleFocusIn);
    container.addEventListener('focusout', handleFocusOut);
    container.addEventListener('keydown', handleKeyDown);

    return () => {
      container.removeEventListener('focusin', handleFocusIn);
      container.removeEventListener('focusout', handleFocusOut);
      container.removeEventListener('keydown', handleKeyDown);
    };
  }, [resume, onResumeChange]);

  // Check selection
  const updateSelectionToolbar = useCallback(() => {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || !sel.toString().trim()) {
      setSelectionToolbar(null);
      return;
    }

    const text = sel.toString().trim();
    if (text.length === 0) {
      setSelectionToolbar(null);
      return;
    }

    const anchorNode = sel.anchorNode;
    const targetEl =
      anchorNode?.nodeType === Node.ELEMENT_NODE
        ? (anchorNode as HTMLElement).closest('[data-field-path]')
        : anchorNode?.parentElement?.closest('[data-field-path]');

    if (targetEl) {
      const fieldPath = targetEl.getAttribute('data-field-path');
      if (fieldPath) {
        const range = sel.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        const currentVal = getFieldByPath(resume, fieldPath);
        const isAlreadyBold =
          currentVal.includes(`**${text}**`) ||
          (text.startsWith('**') && text.endsWith('**'));

        setSelectionToolbar({
          top: Math.max(10, rect.top - 44),
          left: rect.left + rect.width / 2,
          text,
          fieldPath,
          isAlreadyBold,
        });
        return;
      }
    }
    setSelectionToolbar(null);
  }, [resume]);

  const handleApplyBold = useCallback(() => {
    if (!selectionToolbar || !onResumeChange) return;
    const { fieldPath, text, isAlreadyBold } = selectionToolbar;
    const currentVal = getFieldByPath(resume, fieldPath);
    if (!currentVal) return;

    let updatedVal: string;
    if (isAlreadyBold) {
      const boldPattern = `**${text}**`;
      if (currentVal.includes(boldPattern)) {
        updatedVal = currentVal.replace(boldPattern, text);
      } else if (text.startsWith('**') && text.endsWith('**')) {
        updatedVal = currentVal.replace(text, text.slice(2, -2));
      } else {
        updatedVal = currentVal.replace(text, text.replace(/\*\*/g, ''));
      }
    } else {
      updatedVal = currentVal.replace(text, `**${text}**`);
    }

    const updatedResume = setFieldByPath(resume, fieldPath, updatedVal);
    onResumeChange(updatedResume);
    setSelectionToolbar(null);
  }, [selectionToolbar, onResumeChange, resume]);

  // Keyboard shortcut: Ctrl+B or Cmd+B
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        if (selectionToolbar && onResumeChange) {
          e.preventDefault();
          handleApplyBold();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectionToolbar, onResumeChange, handleApplyBold]);

  // Dismiss toolbar on click outside or document scroll
  useEffect(() => {
    const handleScrollOrClick = (e: MouseEvent | Event) => {
      if (e.target && (e.target as HTMLElement).closest('#floating-bold-toolbar')) {
        return;
      }
      setTimeout(updateSelectionToolbar, 10);
    };

    document.addEventListener('mouseup', handleScrollOrClick);
    return () => {
      document.removeEventListener('mouseup', handleScrollOrClick);
    };
  }, [updateSelectionToolbar]);

  const handleQuickDownloadPdf = async () => {
    setIsPdfDownloading(true);
    try {
      await exportToDirectPdf(resume);
    } catch (e) {
      console.error('Failed to download PDF directly:', e);
    } finally {
      setIsPdfDownloading(false);
    }
  };

  const renderTemplate = (template: TemplateId) => {
    switch (template) {
      case 'minimal':
        return <MinimalTemplate resume={resume} />;
      case 'compact':
        return <CompactTemplate resume={resume} />;
      case 'executive':
        return <ExecutiveTemplate resume={resume} />;
      case 'technical':
        return <TechnicalTemplate resume={resume} />;
      case 'slate':
        return <SlateTemplate resume={resume} />;
      case 'academic':
        return <AcademicTemplate resume={resume} />;
      case 'graphic':
        return <GraphicTemplate resume={resume} />;
      case 'colorful':
        return <ColorfulTemplate resume={resume} />;
      case 'classic':
        return <ClassicTemplate resume={resume} />;
      case 'professional':
        return <ProfessionalTemplate resume={resume} />;
      case 'modern':
      default:
        return <ModernTemplate resume={resume} />;
    }
  };

  return (
    <div className="flex flex-col h-full min-h-0 bg-neutral-100 border-l border-neutral-200 overflow-hidden">
      {/* Top Controls Toolbar */}
      <div className="h-14 bg-white border-b border-neutral-200 px-4 flex items-center justify-between shadow-sm z-10 flex-shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenTemplateModal}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold rounded-lg transition"
          >
            <span className="capitalize">{resume.settings.template} Template</span>
            <span className="text-neutral-400">▾</span>
          </button>
          <div className="flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full font-medium border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>ATS Safe</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-700 bg-neutral-100 px-2.5 py-1 rounded-full font-medium border border-neutral-200">
            <span>{pageCount} {pageCount === 1 ? 'Page' : 'Pages'} (A4)</span>
          </div>
        </div>

        {/* Zoom & Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Bold Tool in top bar when text is selected */}
          {selectionToolbar && (
            <button
              onClick={handleApplyBold}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-lg shadow-sm animate-pulse hover:bg-slate-800 transition"
              title="Toggle Bold for selected text (Ctrl+B)"
            >
              <Bold className="w-3.5 h-3.5 text-emerald-400" />
              <span>{selectionToolbar.isAlreadyBold ? 'Unbold Selection' : 'Bold Selection'}</span>
            </button>
          )}

          <div className="flex items-center bg-neutral-100 rounded-lg p-0.5 text-xs text-neutral-700">
            <button
              onClick={() => setZoom(z => Math.max(50, z - 10))}
              className="p-1 hover:bg-white rounded transition"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 font-medium">{zoom}%</span>
            <button
              onClick={() => setZoom(z => Math.min(150, z + 10))}
              className="p-1 hover:bg-white rounded transition"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={exportToPdfPrint}
            className="flex items-center gap-1 px-3 py-1.5 text-neutral-700 bg-neutral-100 hover:bg-neutral-200 text-xs font-semibold rounded-lg transition"
            title="Clean Print / PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Print</span>
          </button>

          <button
            onClick={handleQuickDownloadPdf}
            disabled={isPdfDownloading}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-lg shadow-sm transition disabled:opacity-70"
            title="Download PDF without any browser header/footer"
          >
            {isPdfDownloading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            <span>{isPdfDownloading ? 'Saving PDF...' : 'Download PDF'}</span>
          </button>

          <button
            onClick={onOpenExportModal}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold rounded-lg transition"
            title="Export other formats (Word, Markdown, JSON, TXT)"
          >
            <span>More</span>
            <span className="text-neutral-400">▾</span>
          </button>
        </div>
      </div>

      {/* Live Preview Paper Canvas Container */}
      <div className="flex-1 min-h-0 overflow-auto p-4 md:p-8 flex justify-center items-start bg-neutral-200/70">
        <div
          id="resume-printable-area"
          style={{
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'top center',
            width: '210mm',
            minWidth: '210mm',
            maxWidth: '210mm',
            minHeight: `${pageCount * 297}mm`,
            flexShrink: 0,
            boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
            position: 'relative',
          }}
          className="bg-white rounded-sm text-slate-800"
        >
          {renderTemplate(resume.settings.template)}

          {/* Visual A4 Page Break Cut Guidelines in Live Preview (Hidden in PDF/Print) */}
          {pageCount > 1 &&
            Array.from({ length: pageCount - 1 }).map((_, i) => {
              const pageNum = i + 1;
              return (
                <div
                  key={pageNum}
                  data-html2canvas-ignore="true"
                  className="absolute left-0 right-0 pointer-events-none select-none no-print z-20"
                  style={{ top: `${pageNum * 297}mm`, transform: 'translateY(-50%)' }}
                >
                  <div className="relative flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                      <div className="w-full border-t-2 border-dashed border-emerald-500/50" />
                    </div>
                    <div className="relative flex items-center gap-1.5 px-3 py-1 bg-slate-900/90 text-white rounded-full text-[10px] font-bold tracking-wider uppercase shadow-md">
                      <span>End of Page {pageNum}</span>
                      <span className="text-emerald-400">•</span>
                      <span>Start of Page {pageNum + 1}</span>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Floating Selection Bold Toolbar */}
      {selectionToolbar && (
        <div
          id="floating-bold-toolbar"
          style={{
            position: 'fixed',
            top: `${selectionToolbar.top}px`,
            left: `${selectionToolbar.left}px`,
            transform: 'translateX(-50%)',
            zIndex: 9999,
          }}
          className="flex items-center gap-1 bg-slate-900 text-white px-2 py-1 rounded-lg shadow-2xl border border-slate-700 animate-in fade-in zoom-in duration-150 select-none"
        >
          <button
            type="button"
            onClick={handleApplyBold}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded hover:bg-slate-800 transition text-white"
            title="Toggle Bold (Ctrl+B)"
          >
            <Bold className="w-3.5 h-3.5 text-emerald-400" />
            <span>{selectionToolbar.isAlreadyBold ? 'Unbold' : 'Make Bold'}</span>
            <kbd className="ml-1 text-[10px] text-slate-400 font-mono bg-slate-950 px-1 py-0.5 rounded border border-slate-800">
              Ctrl+B
            </kbd>
          </button>
        </div>
      )}
    </div>
  );
};
