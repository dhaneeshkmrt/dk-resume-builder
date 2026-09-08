'use client';

import React, { useState, useMemo } from 'react';
import { ResumeData } from '@/types/resume';
import {
  RESUME_CONVERSION_PROMPT,
  validateResumeJson,
  cleanJsonInput,
  buildCompleteResumeFromImport,
} from '@/utils/resumeParser';
import {
  FileCode,
  Copy,
  Check,
  X,
  Upload,
  ChevronDown,
  ChevronUp,
  Sparkles,
  AlertCircle,
  FileCheck2,
  Trash2,
  Code
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onImportResume: (resume: ResumeData) => void;
}

export const ImportModal: React.FC<Props> = ({ isOpen, onClose, onImportResume }) => {
  const [jsonText, setJsonText] = useState('');
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [showPromptPreview, setShowPromptPreview] = useState(false);
  const [activeInputMode, setActiveInputMode] = useState<'paste' | 'upload'>('paste');
  const [fileName, setFileName] = useState<string | null>(null);

  // Live validation of current JSON text
  const validation = useMemo(() => {
    return validateResumeJson(jsonText);
  }, [jsonText]);

  if (!isOpen) return null;

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(RESUME_CONVERSION_PROMPT);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = event => {
      const text = event.target?.result as string;
      if (text) {
        setJsonText(cleanJsonInput(text));
        setActiveInputMode('paste');
      }
    };
    reader.readAsText(file);
  };

  const handleFormatJson = () => {
    try {
      const cleaned = cleanJsonInput(jsonText);
      const parsed = JSON.parse(cleaned);
      setJsonText(JSON.stringify(parsed, null, 2));
    } catch {
      // Keep as-is if invalid
    }
  };

  const handleLoadSample = () => {
    const sample = {
      personalInfo: {
        fullName: 'Alex Morgan',
        jobTitle: 'Senior Full Stack Engineer',
        email: 'alex.morgan@example.com',
        phone: '+1 (555) 234-5678',
        location: 'San Francisco, CA',
        website: 'https://alexmorgan.dev',
        linkedin: 'https://linkedin.com/in/alexmorgan',
        github: 'https://github.com/alexmorgan',
      },
      summary:
        'Senior Full Stack Engineer with 7+ years of experience building high-performance web applications and distributed backend architectures. Specialized in React, TypeScript, Node.js, and cloud systems.',
      experiences: [
        {
          company: 'Acme Cloud Systems',
          role: 'Lead Frontend Architect',
          location: 'San Francisco, CA',
          startDate: '2022-03',
          endDate: 'Present',
          current: true,
          bullets: [
            'Architected core micro-frontend platform serving 500k+ daily active users with 99.99% uptime.',
            'Reduced initial web bundle load time by 42% through aggressive code-splitting and edge caching.',
            'Mentored 8 mid-level engineers in component design, TypeScript patterns, and testing.',
          ],
        },
        {
          company: 'TechFlow Solutions',
          role: 'Full Stack Engineer',
          location: 'Austin, TX',
          startDate: '2019-06',
          endDate: '2022-02',
          current: false,
          bullets: [
            'Engineered event-driven microservices using Node.js, Redis, and PostgreSQL handling 25k req/sec.',
            'Collaborated with product designers to ship 14 core user-facing features on schedule.',
          ],
        },
      ],
      education: [
        {
          institution: 'University of California, Berkeley',
          degree: 'Bachelor of Science',
          fieldOfStudy: 'Computer Science',
          location: 'Berkeley, CA',
          startDate: '2015',
          endDate: '2019',
          current: false,
          gpa: '3.8/4.0',
        },
      ],
      skillCategories: [
        {
          categoryName: 'Languages & Frameworks',
          skills: ['TypeScript', 'JavaScript', 'React', 'Next.js', 'Node.js', 'Python', 'Go'],
        },
        {
          categoryName: 'Databases & Cloud',
          skills: ['PostgreSQL', 'Redis', 'AWS (S3, Lambda, ECS)', 'Docker', 'Kubernetes'],
        },
        {
          categoryName: 'Architecture & Tools',
          skills: ['Microservices', 'REST APIs', 'GraphQL', 'CI/CD', 'Git', 'System Design'],
        },
      ],
      projects: [
        {
          name: 'Developer Metrics Dashboard',
          technologies: ['React', 'TypeScript', 'Tailwind CSS', 'FastAPI'],
          bullets: [
            'Built an open-source productivity dashboard with 2,000+ GitHub stars.',
          ],
          githubUrl: 'https://github.com/alexmorgan/dev-metrics',
        },
      ],
    };

    setJsonText(JSON.stringify(sample, null, 2));
    setFileName('sample_resume.json');
  };

  const handleExecuteImport = () => {
    if (!validation.isValid || !validation.parsed) return;
    const complete = buildCompleteResumeFromImport(validation.parsed);
    onImportResume(complete);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-[#FAF8F2]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-neutral-900 text-base">Import Resume (JSON)</h3>
              <p className="text-xs text-neutral-500">
                Import directly via JSON or use our conversion prompt with your existing resume
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-700 p-1.5 rounded-lg transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {/* Step 1: Prompt Conversion Card */}
          <div className="p-4 bg-emerald-50/70 border border-emerald-200/90 rounded-xl space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-extrabold text-emerald-950 uppercase tracking-wide">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Converting an existing resume?</span>
                </div>
                <p className="text-xs text-emerald-900/90 leading-relaxed">
                  Have an existing resume in PDF, Word, LinkedIn, or text? Copy our conversion prompt, paste it into ChatGPT, Claude, or any LLM alongside your current resume, then paste the generated JSON below.
                </p>
              </div>

              {/* Copy Prompt Button */}
              <button
                type="button"
                onClick={handleCopyPrompt}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition shadow-sm ${
                  copiedPrompt
                    ? 'bg-emerald-700 text-white shadow-emerald-700/20'
                    : 'bg-emerald-800 hover:bg-emerald-900 text-white'
                }`}
              >
                {copiedPrompt ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Prompt</span>
                  </>
                )}
              </button>
            </div>

            {/* Collapsible Prompt Preview */}
            <div className="pt-1 border-t border-emerald-200/60">
              <button
                type="button"
                onClick={() => setShowPromptPreview(!showPromptPreview)}
                className="flex items-center gap-1 text-[11px] font-semibold text-emerald-800 hover:text-emerald-950 transition"
              >
                <span>{showPromptPreview ? 'Hide Prompt Details' : 'View Prompt & Schema Details'}</span>
                {showPromptPreview ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>

              {showPromptPreview && (
                <div className="mt-2 p-3 bg-white/90 border border-emerald-200 rounded-lg text-[11px] font-mono text-neutral-700 max-h-48 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                  {RESUME_CONVERSION_PROMPT}
                </div>
              )}
            </div>
          </div>

          {/* Step 2: Paste or Upload JSON */}
          <div className="space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveInputMode('paste')}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg transition ${
                    activeInputMode === 'paste'
                      ? 'bg-neutral-900 text-white'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  Paste JSON
                </button>
                <button
                  type="button"
                  onClick={() => setActiveInputMode('upload')}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg transition ${
                    activeInputMode === 'upload'
                      ? 'bg-neutral-900 text-white'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  Upload File (.json)
                </button>
              </div>

              {/* Utility shortcuts */}
              <div className="flex items-center gap-2">
                {jsonText.trim() && (
                  <>
                    <button
                      type="button"
                      onClick={handleFormatJson}
                      className="text-[11px] font-semibold text-neutral-600 hover:text-neutral-900 px-2 py-1 bg-neutral-100 hover:bg-neutral-200 rounded transition"
                      title="Format JSON"
                    >
                      Prettify
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setJsonText('');
                        setFileName(null);
                      }}
                      className="text-[11px] font-semibold text-neutral-500 hover:text-red-600 px-2 py-1 rounded transition flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      Clear
                    </button>
                  </>
                )}
                {!jsonText.trim() && (
                  <button
                    type="button"
                    onClick={handleLoadSample}
                    className="text-[11px] font-semibold text-emerald-800 hover:text-emerald-950 underline underline-offset-2 transition"
                  >
                    Load Sample JSON
                  </button>
                )}
              </div>
            </div>

            {/* Input View 1: Paste Textarea */}
            {activeInputMode === 'paste' && (
              <div className="relative">
                <textarea
                  rows={10}
                  value={jsonText}
                  onChange={e => setJsonText(e.target.value)}
                  placeholder={`Paste your JSON resume here (e.g. {\n  "personalInfo": { "fullName": "Alex Morgan", ... },\n  "experiences": [ ... ]\n})`}
                  className="w-full p-3.5 text-xs font-mono border border-neutral-300 rounded-xl focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 outline-none transition leading-relaxed bg-neutral-50/50"
                  spellCheck={false}
                />
              </div>
            )}

            {/* Input View 2: File Upload Box */}
            {activeInputMode === 'upload' && (
              <div className="border-2 border-dashed border-neutral-300 hover:border-emerald-600 rounded-xl p-8 text-center bg-neutral-50/60 transition group">
                <Upload className="w-8 h-8 text-neutral-400 group-hover:text-emerald-700 mx-auto mb-2 transition" />
                <p className="text-xs font-bold text-neutral-800 mb-1">
                  {fileName ? `Selected: ${fileName}` : 'Choose a .json resume file'}
                </p>
                <p className="text-[11px] text-neutral-500 mb-4">
                  Standard JSON Resume or DK Resume Builder export
                </p>
                <label className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-neutral-300 hover:border-emerald-600 hover:bg-emerald-50/50 text-xs font-bold text-neutral-800 rounded-xl shadow-sm cursor-pointer transition">
                  <Upload className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Select JSON File</span>
                  <input
                    type="file"
                    accept=".json,application/json"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            )}

            {/* Validation State Banner */}
            {jsonText.trim().length > 0 && (
              <div>
                {validation.isValid ? (
                  <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center gap-2.5 text-xs text-emerald-900 animate-in fade-in">
                    <FileCheck2 className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                    <div>
                      <span className="font-bold">Valid Resume JSON Detected: </span>
                      <span className="text-emerald-800">{validation.summaryText}</span>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl flex items-start gap-2.5 text-xs text-rose-900 animate-in fade-in">
                    <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <span className="font-bold">Invalid JSON: </span>
                      <span className="text-rose-800">{validation.error}</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-neutral-200 bg-[#FAF8F2] flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 transition"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleExecuteImport}
            disabled={!validation.isValid}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow-md transition disabled:opacity-40 disabled:pointer-events-none"
          >
            <FileCode className="w-4 h-4" />
            <span>Import Resume</span>
          </button>
        </div>
      </div>
    </div>
  );
};
