import React from 'react';

// Encode SVG string to URI for img src
function svgToDataUri(svgString: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;
}

export function getIconDataUri(name: 'mail' | 'phone' | 'location' | 'linkedin' | 'github' | 'globe', color = '#186750'): string {
  switch (name) {
    case 'mail':
      return svgToDataUri(
        `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`
      );
    case 'phone':
      return svgToDataUri(
        `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`
      );
    case 'location':
      return svgToDataUri(
        `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`
      );
    case 'linkedin':
      return svgToDataUri(
        `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>`
      );
    case 'github':
      return svgToDataUri(
        `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>`
      );
    case 'globe':
      return svgToDataUri(
        `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>`
      );
  }
}

/**
 * Robust Contact Badge Component that renders with 100% vertical centering across HTML2Canvas and print
 */
export const ContactBadge: React.FC<{
  iconName: 'mail' | 'phone' | 'location' | 'linkedin' | 'github' | 'globe';
  text: string;
  color?: string;
}> = ({ iconName, text, color = '#186750' }) => {
  const iconSrc = getIconDataUri(iconName, color);

  return (
    <table
      style={{
        borderCollapse: 'collapse',
        display: 'inline-table',
        verticalAlign: 'middle',
        marginRight: '14px',
        marginBottom: '6px',
      }}
    >
      <tbody>
        <tr>
          <td
            style={{
              verticalAlign: 'middle',
              padding: 0,
              paddingTop: '2.5px', // Shift icon down to align with lowercase text center
              paddingRight: '5px',
              lineHeight: 1,
              width: '14px',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={iconSrc}
              alt=""
              style={{
                width: '12px',
                height: '12px',
                display: 'block',
                margin: 0,
                padding: 0,
              }}
            />
          </td>
          <td
            style={{
              verticalAlign: 'middle',
              padding: 0,
              lineHeight: '16px',
              fontSize: '11px',
              color: '#475569',
              whiteSpace: 'nowrap',
            }}
          >
            {text}
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export const LinkedinIcon: React.FC<{ className?: string; style?: React.CSSProperties }> = ({
  className = 'w-3.5 h-3.5',
  style,
}) => (
  <svg
    className={className}
    style={{ display: 'block', ...style }}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export const GithubIcon: React.FC<{ className?: string; style?: React.CSSProperties }> = ({
  className = 'w-3.5 h-3.5',
  style,
}) => (
  <svg
    className={className}
    style={{ display: 'block', ...style }}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);
