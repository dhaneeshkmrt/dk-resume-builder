
import React from 'react';
import { ResumeData, ContactHeaderStyle } from '@/types/resume';

export interface TemplateProps {
  resume: ResumeData;
  isPrint?: boolean;
}

export function getFontFamilyClass(font: string): string {
  switch (font) {
    case 'Merriweather':
    case 'Garamond':
      return 'font-serif';
    case 'JetBrains Mono':
      return 'font-mono';
    case 'Lato':
    case 'Roboto':
    case 'Inter':
    default:
      return 'font-sans';
  }
}

export interface ContactItem {
  id: string;
  type: 'email' | 'phone' | 'location' | 'linkedin' | 'github' | 'website';
  label: string;
  value: string;
  href?: string;
}

export function getContactItems(personalInfo: ResumeData['personalInfo']): ContactItem[] {
  const items: ContactItem[] = [];

  if (personalInfo.email?.trim()) {
    items.push({
      id: 'email',
      type: 'email',
      label: 'Email',
      value: personalInfo.email.trim(),
      href: `mailto:${personalInfo.email.trim()}`,
    });
  }
  if (personalInfo.phone?.trim()) {
    items.push({
      id: 'phone',
      type: 'phone',
      label: 'Phone',
      value: personalInfo.phone.trim(),
      href: `tel:${personalInfo.phone.trim()}`,
    });
  }
  if (personalInfo.location?.trim()) {
    items.push({
      id: 'location',
      type: 'location',
      label: 'Location',
      value: personalInfo.location.trim(),
    });
  }
  if (personalInfo.linkedin?.trim()) {
    const cleanLinkedin = personalInfo.linkedin
      .trim()
      .replace(/^https?:\/\/(www\.)?/, '')
      .replace(/\/$/, '');
    items.push({
      id: 'linkedin',
      type: 'linkedin',
      label: 'LinkedIn',
      value: cleanLinkedin,
      href: personalInfo.linkedin.startsWith('http') ? personalInfo.linkedin : `https://${personalInfo.linkedin}`,
    });
  }
  if (personalInfo.github?.trim()) {
    const cleanGithub = personalInfo.github
      .trim()
      .replace(/^https?:\/\/(www\.)?/, '')
      .replace(/\/$/, '');
    items.push({
      id: 'github',
      type: 'github',
      label: 'GitHub',
      value: cleanGithub,
      href: personalInfo.github.startsWith('http') ? personalInfo.github : `https://${personalInfo.github}`,
    });
  }
  if (personalInfo.website?.trim()) {
    const cleanWebsite = personalInfo.website
      .trim()
      .replace(/^https?:\/\/(www\.)?/, '')
      .replace(/\/$/, '');
    items.push({
      id: 'website',
      type: 'website',
      label: 'Portfolio',
      value: cleanWebsite,
      href: personalInfo.website.startsWith('http') ? personalInfo.website : `https://${personalInfo.website}`,
    });
  }

  return items;
}

export const ContactIconSvg: React.FC<{ type: ContactItem['type']; color?: string }> = ({ type, color = 'currentColor' }) => {
  const commonProps = {
    width: 11,
    height: 11,
    className: 'shrink-0',
    style: { display: 'inline-block', verticalAlign: '-2px' } as React.CSSProperties,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: color,
    strokeWidth: '2',
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  switch (type) {
    case 'email':
      return (
        <svg {...commonProps}>
          <rect width="20" height="16" x="2" y="4" rx="2" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
      );
    case 'phone':
      return (
        <svg {...commonProps}>
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      );
    case 'location':
      return (
        <svg {...commonProps}>
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      );
    case 'linkedin':
      return (
        <svg {...commonProps}>
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect x="2" y="9" width="4" height="12" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      );
    case 'github':
      return (
        <svg {...commonProps}>
          <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
          <path d="M9 18c-4.51 2-5-2-7-2" />
        </svg>
      );
    case 'website':
    default:
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
          <path d="M2 12h20" />
        </svg>
      );
  }
};

export const ContactHeaderBar: React.FC<{
  personalInfo: ResumeData['personalInfo'];
  style?: ContactHeaderStyle;
  primaryColor?: string;
  className?: string;
  align?: 'left' | 'center' | 'right';
}> = ({ personalInfo, style = 'bullets', primaryColor = '#186750', className = '', align = 'left' }) => {
  const items = getContactItems(personalInfo);
  if (items.length === 0) return null;

  const alignClass = align === 'center' ? 'justify-center' : align === 'right' ? 'justify-end' : 'justify-start';

  if (style === 'pills') {
    return (
      <div className={`flex flex-wrap items-center text-xs text-slate-700 font-medium ${alignClass} ${className}`}>
        {items.map(item => (
          <span
            key={item.id}
            className="inline-block px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200 shadow-none"
            style={{
              marginRight: '6px',
              marginBottom: '4px',
              lineHeight: '1.35',
              verticalAlign: 'middle',
            }}
          >
            {item.value}
          </span>
        ))}
      </div>
    );
  }

  if (style === 'pipes') {
    return (
      <div className={`flex flex-wrap items-center text-xs text-slate-700 font-medium ${alignClass} ${className}`}>
        {items.map((item, index) => (
          <React.Fragment key={item.id}>
            {index > 0 && (
              <span className="text-slate-300 select-none font-normal" style={{ margin: '0 7px' }}>
                |
              </span>
            )}
            <span className="text-slate-700" style={{ marginBottom: '2px' }}>
              {item.value}
            </span>
          </React.Fragment>
        ))}
      </div>
    );
  }

  if (style === 'icons') {
    return (
      <div className={`flex flex-wrap items-baseline text-xs text-slate-700 font-medium gap-y-1 ${alignClass} ${className}`}>
        {items.map(item => (
          <span
            key={item.id}
            className="text-slate-700"
            style={{ marginRight: '12px' }}
          >
            <ContactIconSvg type={item.type} color={primaryColor} />
            {' '}{item.value}
          </span>
        ))}
      </div>
    );
  }

  // Default: 'bullets' (ATS Best Practice)
  return (
    <div className={`flex flex-wrap items-baseline text-xs text-slate-700 font-medium gap-y-1 ${alignClass} ${className}`}>
      {items.map((item, index) => (
        <React.Fragment key={item.id}>
          {index > 0 && (
            <span className="text-slate-400 select-none" style={{ margin: '0 7px' }}>
              •
            </span>
          )}
          <span className="text-slate-700">{item.value}</span>
        </React.Fragment>
      ))}
    </div>
  );
};

/**
 * Renders text with bold markdown/HTML support:
 * - **bold text**
 * - <b>bold text</b>
 * - <strong>bold text</strong>
 */
export function renderFormattedText(text: string): React.ReactNode {
  if (!text) return '';
  if (!text.includes('**') && !text.includes('<b>') && !text.includes('<strong>')) {
    return text;
  }

  // Handle **bold** and <b>/<strong> tags
  const tokenRegex = /(\*\*.*?\*\*|<b>.*?<\/b>|<strong>.*?<\/strong>)/g;
  const parts = text.split(tokenRegex);

  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      return (
        <strong key={i} className="font-bold text-slate-900">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('<b>') && part.endsWith('</b>')) {
      return (
        <strong key={i} className="font-bold text-slate-900">
          {part.slice(3, -4)}
        </strong>
      );
    }
    if (part.startsWith('<strong>') && part.endsWith('</strong>')) {
      return (
        <strong key={i} className="font-bold text-slate-900">
          {part.slice(8, -9)}
        </strong>
      );
    }
    return part;
  });
}

export const BulletList: React.FC<{
  bullets: string[];
  className?: string;
  bulletColor?: string;
  itemClassName?: string;
  fieldPathPrefix?: string;
}> = ({
  bullets,
  className = 'space-y-0.5 mt-0.5 text-slate-700 text-[9.5pt]',
  bulletColor = '#64748b',
  itemClassName = '',
  fieldPathPrefix,
}) => {
  const filtered = bullets.filter(b => b && b.trim());
  if (filtered.length === 0) return null;

  return (
    <div className={`flex flex-col ${className}`}>
      {filtered.map((bullet, idx) => (
        <div
          key={idx}
          className={`flex items-baseline text-left resume-bullet ${itemClassName}`}
          style={{ marginBottom: '1px' }}
          data-bullet-idx={idx}
          data-field-path={fieldPathPrefix ? `${fieldPathPrefix}.${idx}` : undefined}
        >
          <span
            className="shrink-0 select-none"
            style={{
              width: '14px',
              textAlign: 'center',
              color: bulletColor,
              lineHeight: 'inherit',
            }}
            aria-hidden="true"
          >
            •
          </span>
          <span className="flex-1 text-slate-700 leading-normal text-left" style={{ minWidth: 0 }}>
            {renderFormattedText(bullet)}
          </span>
        </div>
      ))}
    </div>
  );
};

