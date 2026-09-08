import { ResumeData } from '@/types/resume';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { applyContentAwarePagination } from './pagination';

/**
 * Direct 1-Click PDF Download without any browser headers, footers, or page URLs.
 * High-resolution canvas render divided into exact A4 pages with smart element-aware pagination.
 */
export async function exportToDirectPdf(
  resume: ResumeData,
  elementId = 'resume-printable-area'
): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    window.print();
    return;
  }

  // Clone element to perform 1:1 unzoomed A4 canvas capture
  const clone = element.cloneNode(true) as HTMLElement;
  clone.style.transform = 'none';
  clone.style.transformOrigin = 'initial';
  clone.style.boxShadow = 'none';
  clone.style.width = '210mm';
  clone.style.margin = '0';
  clone.style.background = '#ffffff';

  // Remove any preview-only page break indicators from clone
  clone.querySelectorAll('[data-html2canvas-ignore="true"], .no-print').forEach(el => el.remove());

  // Mount at (0,0) with opacity 0 so coordinates are positive and accurate
  const mount = document.createElement('div');
  mount.style.position = 'fixed';
  mount.style.top = '0';
  mount.style.left = '0';
  mount.style.width = '210mm';
  mount.style.height = 'auto';
  mount.style.overflow = 'hidden';
  mount.style.opacity = '0';
  mount.style.pointerEvents = 'none';
  mount.style.zIndex = '-9999';
  mount.style.background = '#ffffff';
  mount.appendChild(clone);
  document.body.appendChild(mount);

  try {
    // 1. Run exact content-aware pagination on the unscaled 100% clone
    const { totalPages, a4HeightPx, a4WidthPx } = applyContentAwarePagination(clone, 100);

    // 2. Render high-DPI canvas of the unscaled A4 DOM
    const canvas = await html2canvas(clone, {
      scale: 2.5, // Ultra-sharp 2.5x retina resolution
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      width: a4WidthPx,
      windowWidth: a4WidthPx,
      windowHeight: totalPages * a4HeightPx,
    });

    // 3. Slice canvas into exact A4 pages cleanly
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidthMm = 210;
    const pageHeightMm = 297;

    const canvasWidth = canvas.width;
    const singlePageCanvasHeight = Math.round((canvasWidth * 297) / 210);

    for (let pageNum = 0; pageNum < totalPages; pageNum++) {
      if (pageNum > 0) pdf.addPage();

      const pageCanvas = document.createElement('canvas');
      pageCanvas.width = canvasWidth;
      pageCanvas.height = singlePageCanvasHeight;
      const ctx = pageCanvas.getContext('2d');

      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);

        const sourceY = pageNum * singlePageCanvasHeight;
        const sourceHeight = Math.min(singlePageCanvasHeight, canvas.height - sourceY);

        if (sourceHeight > 0) {
          ctx.drawImage(
            canvas,
            0,
            sourceY,
            canvasWidth,
            sourceHeight,
            0,
            0,
            pageCanvas.width,
            sourceHeight
          );
        }

        const pageImgData = pageCanvas.toDataURL('image/jpeg', 0.98);
        pdf.addImage(pageImgData, 'JPEG', 0, 0, pageWidthMm, pageHeightMm, undefined, 'FAST');
      }
    }

    const fileNameSlug = (resume.personalInfo.fullName || 'resume')
      .trim()
      .replace(/\s+/g, '_')
      .replace(/[^a-zA-Z0-9_-]/g, '');

    pdf.save(`${fileNameSlug}_Resume.pdf`);
  } catch (err) {
    console.error('Direct PDF export error, falling back to print:', err);
    window.print();
  } finally {
    if (document.body.contains(mount)) {
      document.body.removeChild(mount);
    }
  }
}

/**
 * Trigger browser print dialog with clean ATS print styling
 */
export function exportToPdfPrint(): void {
  setTimeout(() => {
    window.print();
  }, 100);
}

/**
 * Export to plain text ATS-optimized format (.txt)
 */
export function exportToPlainText(resume: ResumeData): string {
  const lines: string[] = [];

  // Header
  lines.push(resume.personalInfo.fullName.toUpperCase());
  if (resume.personalInfo.jobTitle) lines.push(resume.personalInfo.jobTitle);
  const contacts: string[] = [];
  if (resume.personalInfo.email) contacts.push(resume.personalInfo.email);
  if (resume.personalInfo.phone) contacts.push(resume.personalInfo.phone);
  if (resume.personalInfo.location) contacts.push(resume.personalInfo.location);
  if (resume.personalInfo.linkedin) contacts.push(resume.personalInfo.linkedin);
  if (resume.personalInfo.github) contacts.push(resume.personalInfo.github);
  if (resume.personalInfo.website) contacts.push(resume.personalInfo.website);
  lines.push(contacts.join(' | '));
  lines.push('--------------------------------------------------------------------------------');

  // Summary
  if (resume.summary?.trim()) {
    lines.push('PROFESSIONAL SUMMARY');
    lines.push(resume.summary.trim());
    lines.push('');
  }

  // Experience
  if (resume.experiences.length > 0) {
    lines.push('WORK EXPERIENCE');
    resume.experiences.forEach(exp => {
      const dates = `${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}`;
      lines.push(`${exp.role} | ${exp.company} (${exp.location}) [${dates}]`);
      exp.bullets.forEach(b => {
        if (b.trim()) lines.push(`  * ${b.trim()}`);
      });
      lines.push('');
    });
  }

  // Skills
  if (resume.skillCategories.length > 0) {
    lines.push('TECHNICAL SKILLS & COMPETENCIES');
    resume.skillCategories.forEach(cat => {
      if (cat.skills.length > 0) {
        lines.push(`  ${cat.categoryName}: ${cat.skills.join(cat.separator === 'pipe' ? ' | ' : ', ')}`);
      }
    });
    lines.push('');
  }

  // Projects
  if (resume.projects.length > 0) {
    lines.push('PROJECTS');
    resume.projects.forEach(proj => {
      const tech = proj.technologies.length > 0 ? ` (Tech: ${proj.technologies.join(', ')})` : '';
      lines.push(`${proj.name}${tech}`);
      proj.bullets.forEach(b => {
        if (b.trim()) lines.push(`  * ${b.trim()}`);
      });
      lines.push('');
    });
  }

  // Education
  if (resume.education.length > 0) {
    lines.push('EDUCATION');
    resume.education.forEach(edu => {
      const dates = `${edu.startDate} - ${edu.current ? 'Present' : edu.endDate}`;
      lines.push(`${edu.degree} in ${edu.fieldOfStudy} | ${edu.institution} (${dates})`);
      if (edu.gpa) lines.push(`  GPA: ${edu.gpa}`);
      if (edu.honors) lines.push(`  Honors: ${edu.honors}`);
      lines.push('');
    });
  }

  // Certifications
  if (resume.certifications.length > 0) {
    lines.push('CERTIFICATIONS');
    resume.certifications.forEach(c => {
      lines.push(`  * ${c.name} - ${c.issuer} (${c.issueDate})`);
    });
    lines.push('');
  }

  return lines.join('\n');
}

/**
 * Export to clean Markdown format (.md) for developers, documentation, and version control
 */
export function exportToMarkdown(resume: ResumeData): string {
  const md: string[] = [];

  md.push(`# ${resume.personalInfo.fullName}`);
  if (resume.personalInfo.jobTitle) md.push(`**${resume.personalInfo.jobTitle}**\n`);

  const contactList = [
    resume.personalInfo.email && `Email: ${resume.personalInfo.email}`,
    resume.personalInfo.phone && `Phone: ${resume.personalInfo.phone}`,
    resume.personalInfo.location && `Location: ${resume.personalInfo.location}`,
    resume.personalInfo.linkedin && `[LinkedIn](${resume.personalInfo.linkedin})`,
    resume.personalInfo.github && `[GitHub](${resume.personalInfo.github})`,
    resume.personalInfo.website && `[Portfolio](${resume.personalInfo.website})`,
  ].filter(Boolean);

  md.push(contactList.join(' • ') + '\n');

  if (resume.summary?.trim()) {
    md.push('## Summary');
    md.push(resume.summary.trim() + '\n');
  }

  if (resume.experiences.length > 0) {
    md.push('## Work Experience');
    resume.experiences.forEach(exp => {
      const dates = `${exp.startDate} – ${exp.current ? 'Present' : exp.endDate}`;
      md.push(`### ${exp.role} | ${exp.company} (${exp.location})`);
      md.push(`*${dates}*\n`);
      exp.bullets.forEach(b => {
        if (b.trim()) md.push(`- ${b.trim()}`);
      });
      md.push('');
    });
  }

  if (resume.skillCategories.length > 0) {
    md.push('## Skills');
    resume.skillCategories.forEach(cat => {
      if (cat.skills.length > 0) {
        md.push(`- **${cat.categoryName}**: ${cat.skills.join(cat.separator === 'pipe' ? ' | ' : ', ')}`);
      }
    });
    md.push('');
  }

  if (resume.projects.length > 0) {
    md.push('## Projects');
    resume.projects.forEach(p => {
      const stack = p.technologies.length > 0 ? ` (${p.technologies.join(', ')})` : '';
      md.push(`### ${p.name}${stack}`);
      p.bullets.forEach(b => {
        if (b.trim()) md.push(`- ${b.trim()}`);
      });
      md.push('');
    });
  }

  if (resume.education.length > 0) {
    md.push('## Education');
    resume.education.forEach(e => {
      const dates = `${e.startDate} – ${e.current ? 'Present' : e.endDate}`;
      md.push(`### ${e.degree}, ${e.fieldOfStudy}`);
      md.push(`**${e.institution}** | *${dates}*`);
      if (e.gpa) md.push(`- GPA: ${e.gpa}`);
      if (e.honors) md.push(`- Honors: ${e.honors}`);
      md.push('');
    });
  }

  if (resume.certifications.length > 0) {
    md.push('## Certifications');
    resume.certifications.forEach(c => {
      md.push(`- **${c.name}** – ${c.issuer} (${c.issueDate})`);
    });
    md.push('');
  }

  return md.join('\n');
}

export const exportToAgenticMarkdown = exportToMarkdown;

/**
 * Standard JSON Resume Schema v1.0 Exporter
 */
export function exportToJsonResume(resume: ResumeData): string {
  const jsonResume = {
    $schema: 'https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json',
    basics: {
      name: resume.personalInfo.fullName,
      label: resume.personalInfo.jobTitle,
      email: resume.personalInfo.email,
      phone: resume.personalInfo.phone,
      url: resume.personalInfo.website,
      summary: resume.summary,
      location: {
        address: resume.personalInfo.location,
      },
      profiles: [
        resume.personalInfo.linkedin ? { network: 'LinkedIn', url: resume.personalInfo.linkedin } : null,
        resume.personalInfo.github ? { network: 'GitHub', url: resume.personalInfo.github } : null,
      ].filter(Boolean)
    },
    work: resume.experiences.map(exp => ({
      name: exp.company,
      position: exp.role,
      location: exp.location,
      startDate: exp.startDate,
      endDate: exp.current ? null : exp.endDate,
      highlights: exp.bullets.filter(b => b.trim().length > 0)
    })),
    education: resume.education.map(edu => ({
      institution: edu.institution,
      area: edu.fieldOfStudy,
      studyType: edu.degree,
      startDate: edu.startDate,
      endDate: edu.current ? null : edu.endDate,
      score: edu.gpa || undefined,
      courses: edu.honors ? [edu.honors] : []
    })),
    skills: resume.skillCategories.map(cat => ({
      name: cat.categoryName,
      keywords: cat.skills
    })),
    projects: resume.projects.map(proj => ({
      name: proj.name,
      description: proj.bullets.join(' '),
      highlights: proj.bullets,
      keywords: proj.technologies,
      url: proj.url
    })),
    certificates: resume.certifications.map(c => ({
      name: c.name,
      issuer: c.issuer,
      date: c.issueDate,
      url: c.url
    }))
  };

  return JSON.stringify(jsonResume, null, 2);
}


export function downloadFile(content: string | Blob, filename: string, mimeType: string): void {
  const blob = typeof content === 'string' ? new Blob([content], { type: mimeType }) : content;
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
