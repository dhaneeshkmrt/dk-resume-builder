'use client';

import React, { useState } from 'react';
import { ResumeData } from '@/types/resume';
import {
  exportToDirectPdf,
  exportToPdfPrint,
  exportToPlainText,
  exportToAgenticMarkdown,
  exportToJsonResume,
  downloadFile
} from '@/utils/exporters';
import { Download, FileText, Printer, FileCode, Check, X, Loader2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  resume: ResumeData;
}

export const ExportModal: React.FC<Props> = ({ isOpen, onClose, resume }) => {
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);

  if (!isOpen) return null;

  const fileNameSlug = (resume.personalInfo.fullName || 'resume')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_');

  const handleDirectDownloadPdf = async () => {
    setIsPdfGenerating(true);
    try {
      await exportToDirectPdf(resume);
      onClose();
    } catch (err) {
      console.error('Error generating PDF:', err);
    } finally {
      setIsPdfGenerating(false);
    }
  };

  const handlePrintPdf = () => {
    onClose();
    // Wait for modal transition/unmount before calling print
    exportToPdfPrint();
  };


  const handleDownloadTxt = () => {
    const text = exportToPlainText(resume);
    downloadFile(text, `${fileNameSlug}_resume.txt`, 'text/plain');
  };

  const handleDownloadMarkdown = () => {
    const md = exportToAgenticMarkdown(resume);
    downloadFile(md, `${fileNameSlug}_resume.md`, 'text/markdown');
  };

  const handleDownloadJson = () => {
    const json = exportToJsonResume(resume);
    downloadFile(json, `${fileNameSlug}_resume.json`, 'application/json');
  };

  const handleCopyMarkdown = () => {
    const md = exportToAgenticMarkdown(resume);
    navigator.clipboard.writeText(md);
    setCopiedFormat('md');
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-[#FAF8F2]">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-neutral-900 text-base">Export & Download Resume</h3>
              <p className="text-xs text-neutral-500">Download clean ATS-friendly PDF, Markdown, or JSON</p>
            </div>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-700 p-1.5 rounded-lg transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Export Options Grid */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {/* Direct 1-Click PDF Download */}
          <button
            onClick={handleDirectDownloadPdf}
            disabled={isPdfGenerating}
            className="w-full text-left p-4 rounded-xl border-2 border-emerald-600 bg-emerald-50/40 hover:bg-emerald-50 transition flex items-center justify-between group shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-700 text-white rounded-xl">
                {isPdfGenerating ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <FileText className="w-5 h-5" />
                )}
              </div>
              <div>
                <div className="font-bold text-sm text-emerald-950 flex items-center gap-2">
                  <span>Download Clean PDF (.pdf)</span>
                  <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full font-bold uppercase">
                    Recommended
                  </span>
                </div>
                <div className="text-xs text-neutral-600 mt-0.5">
                  Direct download with zero browser headers, footers, dates, or page URLs
                </div>
              </div>
            </div>
            <Download className="w-5 h-5 text-emerald-700 group-hover:scale-110 transition" />
          </button>

          {/* System Print Dialog Option */}
          <button
            onClick={handlePrintPdf}
            className="w-full text-left p-3.5 rounded-xl border border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50 transition flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-neutral-100 text-neutral-700 rounded-lg">
                <Printer className="w-4 h-4" />
              </div>
              <div>
                <div className="font-semibold text-xs text-neutral-800">
                  Open Browser Print Dialog (Ctrl+P)
                </div>
                <div className="text-[11px] text-neutral-500">
                  Clean print preview formatted for A4 paper
                </div>
              </div>
            </div>
            <Printer className="w-4 h-4 text-neutral-400 group-hover:text-neutral-700" />
          </button>


          {/* Clean Markdown */}
          <div className="p-3.5 rounded-xl border border-neutral-200 bg-neutral-50/50 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-xs text-neutral-900">
                    Clean Markdown (.md)
                  </div>
                  <div className="text-[11px] text-neutral-500">
                    Plain-text markdown formatted for developers, GitHub, and documentation
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyMarkdown}
                  className="px-2.5 py-1 bg-white hover:bg-neutral-100 border border-neutral-200 text-xs font-semibold rounded-lg transition"
                >
                  {copiedFormat === 'md' ? 'Copied!' : 'Copy'}
                </button>
                <button
                  onClick={handleDownloadMarkdown}
                  className="p-1 text-neutral-500 hover:text-emerald-800 transition"
                  title="Download .md"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* JSON Resume (Standard Schema) */}
          <button
            onClick={handleDownloadJson}
            className="w-full text-left p-3.5 rounded-xl border border-neutral-200 hover:border-amber-600 hover:bg-amber-50/30 transition flex items-center justify-between group shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 text-amber-800 rounded-lg">
                <FileCode className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-xs text-neutral-900 group-hover:text-amber-800">
                  Standard JSON Resume (.json)
                </div>
                <div className="text-[11px] text-neutral-500">
                  Official jsonresume.org schema for programmatic API usage
                </div>
              </div>
            </div>
            <Download className="w-4 h-4 text-neutral-400 group-hover:text-amber-700" />
          </button>

          {/* Plain Text TXT */}
          <button
            onClick={handleDownloadTxt}
            className="w-full text-left p-3.5 rounded-xl border border-neutral-200 hover:border-neutral-600 hover:bg-neutral-100 transition flex items-center justify-between group shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-neutral-200 text-neutral-800 rounded-lg">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-xs text-neutral-900">
                  Plain Text (.txt)
                </div>
                <div className="text-[11px] text-neutral-500">
                  Unformatted pure ASCII text for legacy job portals
                </div>
              </div>
            </div>
            <Download className="w-4 h-4 text-neutral-400" />
          </button>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-200 bg-neutral-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-neutral-200 text-neutral-800 text-xs font-semibold rounded-xl hover:bg-neutral-300 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
