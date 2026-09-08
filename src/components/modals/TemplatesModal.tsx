'use client';

import React from 'react';
import { TemplateId, FontFamily } from '@/types/resume';
import { Layout, Check, X, Palette, Type } from 'lucide-react';
 
interface Props {
  isOpen: boolean;
  onClose: () => void;
  selectedTemplate: TemplateId;
  selectedFont: FontFamily;
  selectedColor: string;
  onSelectTemplate: (t: TemplateId) => void;
  onSelectFont: (f: FontFamily) => void;
  onSelectColor: (c: string) => void;
}

interface TemplateOption {
  id: TemplateId;
  title: string;
  description: string;
  bestFor: string;
}

const TEMPLATES: TemplateOption[] = [
  {
    id: 'modern',
    title: 'Modern Clean',
    description: 'Emerald accent headers, clean single-column layout, 100% ATS safe.',
    bestFor: 'Classic & ATS Standard',
  },
  {
    id: 'twocolumn',
    title: 'Two-Column Layout',
    description: 'Structured sidebar for contact, skills & education with a focused main column for experience.',
    bestFor: 'Engineers & Tech Leaders',
  },
];

const FONTS: FontFamily[] = ['Inter', 'Lato', 'Roboto', 'Merriweather', 'Garamond', 'JetBrains Mono'];

const COLORS = [
  { label: 'DK Emerald', hex: '#186750' },
  { label: 'Sapphire Navy', hex: '#1e3a8a' },
  { label: 'Deep Teal', hex: '#0f766e' },
  { label: 'Slate Charcoal', hex: '#334155' },
  { label: 'Burgundy Crimson', hex: '#881337' },
  { label: 'Classic Onyx', hex: '#18181b' },
];

export const TemplatesModal: React.FC<Props> = ({
  isOpen,
  onClose,
  selectedTemplate,
  selectedFont,
  selectedColor,
  onSelectTemplate,
  onSelectFont,
  onSelectColor,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-[#FAF8F2]">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
              <Layout className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-neutral-900 text-base">Templates, Fonts & Styling</h3>
              <p className="text-xs text-neutral-500">2 ATS-optimized templates tested against leading recruitment screeners</p>
            </div>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-700 p-1.5 rounded-lg transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Colors & Fonts Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl border border-neutral-200 bg-neutral-50">
            {/* Color Scheme */}
            <div>
              <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-emerald-700" />
                <span>Theme Accent Color</span>
              </label>
              <div className="flex items-center gap-2 flex-wrap">
                {COLORS.map(c => (
                  <button
                    key={c.hex}
                    onClick={() => onSelectColor(c.hex)}
                    style={{ backgroundColor: c.hex }}
                    className={`w-7 h-7 rounded-full transition-transform flex items-center justify-center ${
                      selectedColor === c.hex ? 'ring-2 ring-offset-2 ring-emerald-700 scale-110' : 'hover:scale-105'
                    }`}
                    title={c.label}
                  >
                    {selectedColor === c.hex && <Check className="w-3.5 h-3.5 text-white" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Font Family */}
            <div>
              <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Type className="w-3.5 h-3.5 text-emerald-700" />
                <span>Typography & Font</span>
              </label>
              <select
                value={selectedFont}
                onChange={e => onSelectFont(e.target.value as FontFamily)}
                className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded-lg bg-white outline-none focus:ring-1 focus:ring-emerald-700 font-medium text-slate-800"
              >
                {FONTS.map(f => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Template Cards Grid */}
          <div>
            <h4 className="text-xs font-bold text-neutral-700 uppercase tracking-wider mb-3">
              Select Template
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {TEMPLATES.map(t => (
                <button
                  key={t.id}
                  onClick={() => onSelectTemplate(t.id)}
                  className={`text-left p-4 rounded-xl border transition flex flex-col justify-between ${
                    selectedTemplate === t.id
                      ? 'border-emerald-700 bg-emerald-50/50 shadow-md ring-1 ring-emerald-700'
                      : 'border-neutral-200 hover:border-neutral-400 bg-white'
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="font-bold text-sm text-neutral-900">{t.title}</span>
                      {selectedTemplate === t.id && (
                        <span className="p-0.5 bg-emerald-700 text-white rounded-full">
                          <Check className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-500 leading-relaxed mb-3">{t.description}</p>
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100/70 px-2.5 py-1 rounded w-fit">
                    {t.bestFor}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-200 bg-neutral-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-emerald-800 text-white text-xs font-bold rounded-xl hover:bg-emerald-900 transition shadow-sm"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};
