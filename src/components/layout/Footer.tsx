'use client';

import React from 'react';
import { ShieldCheck, Lock, HardDrive } from 'lucide-react';
import { DkLogo } from '@/components/common/DkLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#FAF8F2] border-t border-neutral-200 py-6 px-4 text-neutral-600 text-xs">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <DkLogo className="w-5 h-5 flex-shrink-0" size={20} />
          <span className="font-bold text-neutral-800">
            DK Resume Builder
          </span>
          <span className="hidden md:inline text-neutral-400">|</span>
          <span className="text-neutral-500">Built by a developer to help other devs — 100% Free & Offline-First</span>
        </div>

        <div className="flex items-center gap-4 text-neutral-500 flex-wrap justify-center">
          <span className="flex items-center gap-1">
            <HardDrive className="w-3.5 h-3.5 text-emerald-700" />
            100% Local Storage
          </span>
          <span className="flex items-center gap-1">
            <Lock className="w-3.5 h-3.5 text-emerald-700" />
            Zero Analytics & Tracking
          </span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            100% ATS Compliant
          </span>
        </div>
      </div>
    </footer>
  );
};
