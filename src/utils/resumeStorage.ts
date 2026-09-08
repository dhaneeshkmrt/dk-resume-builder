import { ResumeData } from '@/types/resume';
import { DEFAULT_RESUME } from '@/data/sampleResumes';

export const RESUMES_STORAGE_KEY = 'dk_saved_resumes_collection_v1';
export const ACTIVE_RESUME_ID_KEY = 'dk_active_resume_id_v1';
export const LEGACY_RESUMES_STORAGE_KEY = 'weekday_saved_resumes_collection_v2';
export const LEGACY_ACTIVE_RESUME_ID_KEY = 'weekday_active_resume_id_v2';
export const LEGACY_STORAGE_KEY = 'dk_resume_builder_legacy_v1';

export interface SavedResumeMeta {
  id: string;
  title: string;
  fullName: string;
  jobTitle: string;
  updatedAt: string;
  template: string;
}

/**
 * Load all saved resumes from localStorage.
 * If empty, checks for legacy storage keys or initializes with default resume.
 */
export function loadAllSavedResumes(): ResumeData[] {
  if (typeof window === 'undefined') {
    return [DEFAULT_RESUME];
  }

  try {
    let raw = localStorage.getItem(RESUMES_STORAGE_KEY);
    if (!raw) {
      // Fallback migration from previous version
      raw = localStorage.getItem(LEGACY_RESUMES_STORAGE_KEY);
      if (raw) {
        localStorage.setItem(RESUMES_STORAGE_KEY, raw);
      }
    }
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const formatMonthYear = (val: string): string => {
          if (!val || val === 'Present') return val;
          const hyphenMatch = val.match(/^(\d{4})-\s+([A-Za-z]+)$/);
          if (hyphenMatch) return `${hyphenMatch[1]} ${hyphenMatch[2]}`;
          const match = val.match(/^(\d{4})-(\d{2})$/);
          if (!match) return val;
          const year = match[1];
          const monthNum = parseInt(match[2], 10);
          const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          if (monthNum >= 1 && monthNum <= 12) {
            const m = months[monthNum - 1];
            return `${year} ${m}`;
          }
          return val;
        };

        let modified = false;
        parsed.forEach((r: ResumeData) => {
          r.experiences?.forEach(exp => {
            const newStart = formatMonthYear(exp.startDate);
            const newEnd = formatMonthYear(exp.endDate);
            if (newStart !== exp.startDate || newEnd !== exp.endDate) {
              exp.startDate = newStart;
              exp.endDate = newEnd;
              modified = true;
            }
          });
          r.projects?.forEach(p => {
            if (p.startDate) {
              const newStart = formatMonthYear(p.startDate);
              if (newStart !== p.startDate) {
                p.startDate = newStart;
                modified = true;
              }
            }
            if (p.endDate) {
              const newEnd = formatMonthYear(p.endDate);
              if (newEnd !== p.endDate) {
                p.endDate = newEnd;
                modified = true;
              }
            }
          });
          if (r.settings && r.settings.template !== 'modern' && r.settings.template !== 'twocolumn') {
            r.settings.template = 'modern';
            modified = true;
          }
        });
        if (modified) {
          saveAllResumes(parsed);
        }

        return parsed;
      }
    }

    // Check legacy single-resume storage key
    const legacyRaw = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (legacyRaw) {
      const legacyParsed = JSON.parse(legacyRaw);
      if (legacyParsed && legacyParsed.personalInfo?.fullName) {
        const initialList = [DEFAULT_RESUME, legacyParsed];
        saveAllResumes(initialList);
        return initialList;
      }
    }

    // Default: initialize with DEFAULT_RESUME
    const defaultList = [DEFAULT_RESUME];
    saveAllResumes(defaultList);
    return defaultList;
  } catch (err) {
    console.error('Failed to load saved resumes from localStorage:', err);
    return [DEFAULT_RESUME];
  }
}

/**
 * Save full list of resumes to localStorage
 */
export function saveAllResumes(resumes: ResumeData[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(RESUMES_STORAGE_KEY, JSON.stringify(resumes));
  } catch (err) {
    console.error('Failed to save resumes collection:', err);
  }
}

/**
 * Save or update an individual resume in the collection
 */
export function saveResumeToCollection(resume: ResumeData): ResumeData[] {
  const all = loadAllSavedResumes();
  const index = all.findIndex(r => r.id === resume.id);

  let updatedList: ResumeData[];
  if (index >= 0) {
    updatedList = [...all];
    updatedList[index] = resume;
  } else {
    updatedList = [resume, ...all];
  }

  saveAllResumes(updatedList);
  setActiveResumeId(resume.id);
  // Also keep legacy single key updated for backwards compatibility
  if (typeof window !== 'undefined') {
    localStorage.setItem(LEGACY_STORAGE_KEY, JSON.stringify(resume));
  }
  return updatedList;
}

/**
 * Duplicate a resume with a new ID and title
 */
export function duplicateResume(sourceId: string, newTitle?: string): { list: ResumeData[]; newResume: ResumeData } {
  const all = loadAllSavedResumes();
  const source = all.find(r => r.id === sourceId) || all[0] || DEFAULT_RESUME;

  const timestamp = Date.now();
  const title = newTitle?.trim() || `${source.title || source.personalInfo.fullName} (Copy)`;
  const newResume: ResumeData = {
    ...JSON.parse(JSON.stringify(source)),
    id: `resume-${timestamp}`,
    title,
  };

  const updatedList = [newResume, ...all];
  saveAllResumes(updatedList);
  setActiveResumeId(newResume.id);
  return { list: updatedList, newResume };
}

/**
 * Create a new blank or preset resume
 */
export function createNewResume(title: string, templateData?: ResumeData): { list: ResumeData[]; newResume: ResumeData } {
  const all = loadAllSavedResumes();
  const base = templateData || DEFAULT_RESUME;
  const timestamp = Date.now();

  const newResume: ResumeData = {
    ...JSON.parse(JSON.stringify(base)),
    id: `resume-${timestamp}`,
    title: title.trim() || `My Resume ${all.length + 1}`,
  };

  const updatedList = [newResume, ...all];
  saveAllResumes(updatedList);
  setActiveResumeId(newResume.id);
  return { list: updatedList, newResume };
}

/**
 * Delete a resume by ID. Prevents deleting the last remaining resume.
 */
export function deleteResume(id: string): { list: ResumeData[]; nextActiveResume?: ResumeData } {
  const all = loadAllSavedResumes();
  if (all.length <= 1) {
    return { list: all, nextActiveResume: all[0] };
  }

  const updatedList = all.filter(r => r.id !== id);
  saveAllResumes(updatedList);

  const nextActive = updatedList[0];
  setActiveResumeId(nextActive.id);
  return { list: updatedList, nextActiveResume: nextActive };
}

/**
 * Rename a resume
 */
export function renameResume(id: string, newTitle: string): ResumeData[] {
  const all = loadAllSavedResumes();
  const updated = all.map(r => (r.id === id ? { ...r, title: newTitle.trim() } : r));
  saveAllResumes(updated);
  return updated;
}

/**
 * Get active resume ID
 */
export function getActiveResumeId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ACTIVE_RESUME_ID_KEY) || localStorage.getItem(LEGACY_ACTIVE_RESUME_ID_KEY);
}

/**
 * Set active resume ID
 */
export function setActiveResumeId(id: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ACTIVE_RESUME_ID_KEY, id);
}
