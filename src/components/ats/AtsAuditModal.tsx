'use client';

import React from 'react';
import { ResumeData } from '@/types/resume';
import { calculateAtsAudit } from '@/utils/atsScorer';
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Info,
  X,
  TrendingUp,
  FileCheck2,
  Zap,
  Clock,
  BookOpen
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  resume: ResumeData;
  onOpenJdMatcher: () => void;
}

export const AtsAuditModal: React.FC<Props> = ({
  isOpen,
  onClose,
  resume,
  onOpenJdMatcher,
}) => {
  if (!isOpen) return null;

  const audit = calculateAtsAudit(resume, resume.targetJobDescription);

  const getScoreBadgeColor = (score: number) => {
    if (score >= 80) return 'text-emerald-700 bg-emerald-50 border-emerald-300';
    if (score >= 60) return 'text-amber-700 bg-amber-50 border-amber-300';
    return 'text-rose-700 bg-rose-50 border-rose-300';
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-[#FAF8F2]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-neutral-900 text-base">Live ATS Readiness & Audit Report</h3>
              <p className="text-xs text-neutral-500">Comprehensive screening audit against modern applicant tracking and recruiter parsing systems</p>
            </div>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-700 p-1.5 rounded-lg transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Main Score & Metrics Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className={`p-4 rounded-xl border flex flex-col items-center justify-center text-center ${getScoreBadgeColor(audit.overallScore)}`}>
              <span className="text-xs font-bold uppercase tracking-wider mb-1">ATS Score</span>
              <span className="text-4xl font-extrabold">{audit.overallScore}</span>
              <span className="text-[10px] mt-1 font-semibold uppercase">
                {audit.overallScore >= 80 ? 'Excellent' : audit.overallScore >= 60 ? 'Good' : 'Needs Work'}
              </span>
            </div>

            <div className="p-3.5 rounded-xl border border-neutral-200 bg-neutral-50 flex flex-col justify-center">
              <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-semibold mb-1">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                <span>Impact Metrics</span>
              </div>
              <span className="text-xl font-bold text-neutral-900">{audit.metricsFoundCount}</span>
              <span className="text-[11px] text-neutral-500">Quantifiable bullets</span>
            </div>

            <div className="p-3.5 rounded-xl border border-neutral-200 bg-neutral-50 flex flex-col justify-center">
              <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-semibold mb-1">
                <Zap className="w-3.5 h-3.5 text-amber-600" />
                <span>Action Verbs</span>
              </div>
              <span className="text-xl font-bold text-neutral-900">{audit.actionVerbsCount}</span>
              <span className="text-[11px] text-neutral-500">Power action verbs</span>
            </div>

            <div className="p-3.5 rounded-xl border border-neutral-200 bg-neutral-50 flex flex-col justify-center">
              <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-semibold mb-1">
                <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                <span>Length & Read</span>
              </div>
              <span className="text-xl font-bold text-neutral-900">{audit.totalWordCount}</span>
              <span className="text-[11px] text-neutral-500">Words (~{audit.pageEstimate} page)</span>
            </div>
          </div>

          {/* Granular Breakdown Bars */}
          <div className="p-4 border border-neutral-200 rounded-xl bg-neutral-50/50 space-y-3">
            <h4 className="text-xs font-bold text-neutral-800 uppercase tracking-wider">Scoring Breakdown</h4>
            <div className="space-y-2 text-xs">
              <div>
                <div className="flex justify-between font-medium text-neutral-700 mb-1">
                  <span>Section Completeness</span>
                  <span>{audit.breakdown.completeness}%</span>
                </div>
                <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${audit.breakdown.completeness}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-medium text-neutral-700 mb-1">
                  <span>Quantifiable Impact & Metrics (Google XYZ Formula)</span>
                  <span>{audit.breakdown.impactMetrics}%</span>
                </div>
                <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: `${audit.breakdown.impactMetrics}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-medium text-neutral-700 mb-1">
                  <span>Action Verbs & Power Phrasing</span>
                  <span>{audit.breakdown.actionVerbs}%</span>
                </div>
                <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-600 rounded-full" style={{ width: `${audit.breakdown.actionVerbs}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-medium text-neutral-700 mb-1">
                  <span>Formatting & Single-Column Compatibility</span>
                  <span>{audit.breakdown.formatting}%</span>
                </div>
                <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-600 rounded-full" style={{ width: `${audit.breakdown.formatting}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Actionable Recommendations List */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-neutral-800 uppercase tracking-wider">Recommendations & Fixes</h4>
            <div className="space-y-2">
              {audit.issues.map((issue, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border text-xs flex gap-2.5 ${
                    issue.type === 'critical'
                      ? 'bg-rose-50 border-rose-200 text-rose-900'
                      : issue.type === 'warning'
                      ? 'bg-amber-50 border-amber-200 text-amber-900'
                      : issue.type === 'success'
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : 'bg-neutral-50 border-neutral-200 text-neutral-800'
                  }`}
                >
                  {issue.type === 'critical' || issue.type === 'warning' ? (
                    <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  ) : issue.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  ) : (
                    <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-0.5">
                    <div className="font-semibold">{issue.message}</div>
                    {issue.suggestion && (
                      <div className="text-[11px] opacity-90">{issue.suggestion}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-200 bg-neutral-50 flex items-center justify-between">
          <button
            onClick={() => {
              onClose();
              onOpenJdMatcher();
            }}
            className="text-xs font-bold text-emerald-800 hover:underline"
          >
            🎯 Open Target Job Description Matcher
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-emerald-800 text-white text-xs font-bold rounded-xl hover:bg-emerald-900 transition shadow-sm"
          >
            Close Report
          </button>
        </div>
      </div>
    </div>
  );
};
