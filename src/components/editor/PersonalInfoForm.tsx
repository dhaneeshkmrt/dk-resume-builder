import React from 'react';
import { PersonalInfo } from '@/types/resume';
import { User, Mail, Phone, MapPin, Globe, Sparkles } from 'lucide-react';
import { LinkedinIcon, GithubIcon } from '@/components/common/Icons';

interface Props {
  data: PersonalInfo;
  onChange: (data: PersonalInfo) => void;
}

export const PersonalInfoForm: React.FC<Props> = ({
  data,
  onChange,
}) => {
  const updateField = (field: keyof PersonalInfo, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-neutral-700 mb-1">Full Name *</label>
          <div className="relative">
            <User className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={data.fullName}
              onChange={e => updateField('fullName', e.target.value)}
              placeholder="e.g. Alex Morgan"
              className="w-full pl-9 pr-3 py-2 text-sm border border-neutral-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 outline-none transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-700 mb-1">Job Title *</label>
          <input
            type="text"
            value={data.jobTitle}
            onChange={e => updateField('jobTitle', e.target.value)}
            placeholder="e.g. Senior Full Stack Engineer"
            className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 outline-none transition"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-700 mb-1">Email Address *</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
            <input
              type="email"
              value={data.email}
              onChange={e => updateField('email', e.target.value)}
              placeholder="alex.morgan@email.com"
              className="w-full pl-9 pr-3 py-2 text-sm border border-neutral-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 outline-none transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-700 mb-1">Phone Number</label>
          <div className="relative">
            <Phone className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
            <input
              type="tel"
              value={data.phone}
              onChange={e => updateField('phone', e.target.value)}
              placeholder="+1 (555) 019-2834"
              className="w-full pl-9 pr-3 py-2 text-sm border border-neutral-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 outline-none transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-700 mb-1">Location / City</label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={data.location}
              onChange={e => updateField('location', e.target.value)}
              placeholder="San Francisco, CA"
              className="w-full pl-9 pr-3 py-2 text-sm border border-neutral-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 outline-none transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-700 mb-1">LinkedIn Profile</label>
          <div className="relative">
            <div className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5 flex items-center justify-center">
              <LinkedinIcon className="w-4 h-4" />
            </div>
            <input
              type="url"
              value={data.linkedin}
              onChange={e => updateField('linkedin', e.target.value)}
              placeholder="https://linkedin.com/in/alexmorgan"
              className="w-full pl-9 pr-3 py-2 text-sm border border-neutral-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 outline-none transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-700 mb-1">GitHub / Code Repository</label>
          <div className="relative">
            <div className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5 flex items-center justify-center">
              <GithubIcon className="w-4 h-4" />
            </div>
            <input
              type="url"
              value={data.github}
              onChange={e => updateField('github', e.target.value)}
              placeholder="https://github.com/alexmorgan"
              className="w-full pl-9 pr-3 py-2 text-sm border border-neutral-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 outline-none transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-700 mb-1">Personal Website / Portfolio</label>
          <div className="relative">
            <Globe className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
            <input
              type="url"
              value={data.website}
              onChange={e => updateField('website', e.target.value)}
              placeholder="https://alexmorgan.dev"
              className="w-full pl-9 pr-3 py-2 text-sm border border-neutral-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 outline-none transition"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
