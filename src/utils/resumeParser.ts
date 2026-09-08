
import { ResumeData, ExperienceItem, EducationItem, SkillCategory } from '@/types/resume';
import { SOFTWARE_ENGINEER_SAMPLE } from '@/data/sampleResumes';

export function parseResumeFromText(rawText: string): Partial<ResumeData> {
  if (!rawText || rawText.trim().length === 0) return {};

  // Try JSON parse first
  try {
    const json = JSON.parse(rawText);
    if (json.basics || json.personalInfo) {
      return parseJsonResume(json);
    }
  } catch (e) {
    // Continue with text parsing
  }

  const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
  const result: Partial<ResumeData> = {
    personalInfo: { ...SOFTWARE_ENGINEER_SAMPLE.personalInfo },
    experiences: [],
    education: [],
    skillCategories: [],
    summary: '',
  };

  if (lines.length > 0) {
    result.personalInfo!.fullName = lines[0];
  }

  // Detect email and phone
  for (const line of lines.slice(0, 5)) {
    const emailMatch = line.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    if (emailMatch) result.personalInfo!.email = emailMatch[0];

    const phoneMatch = line.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
    if (phoneMatch) result.personalInfo!.phone = phoneMatch[0];
  }

  return result;
}

export function parseJsonResume(json: any): Partial<ResumeData> {
  const res: Partial<ResumeData> = {};

  if (json.basics) {
    res.personalInfo = {
      fullName: json.basics.name || '',
      jobTitle: json.basics.label || '',
      email: json.basics.email || '',
      phone: json.basics.phone || '',
      location: json.basics.location?.address || json.basics.location?.city || '',
      website: json.basics.url || '',
      linkedin: json.basics.profiles?.find((p: any) => p.network?.toLowerCase().includes('linkedin'))?.url || '',
      github: json.basics.profiles?.find((p: any) => p.network?.toLowerCase().includes('github'))?.url || '',
      portfolio: '',
    };
    res.summary = json.basics.summary || '';
  }

  if (Array.isArray(json.work)) {
    res.experiences = json.work.map((w: any, idx: number) => ({
      id: `exp-import-${idx}`,
      company: w.name || w.company || '',
      role: w.position || w.role || '',
      location: w.location || '',
      startDate: w.startDate || '',
      endDate: w.endDate || '',
      current: !w.endDate || w.endDate.toLowerCase() === 'present',
      bullets: Array.isArray(w.highlights) ? w.highlights : [w.summary].filter(Boolean)
    }));
  }

  if (Array.isArray(json.education)) {
    res.education = json.education.map((e: any, idx: number) => ({
      id: `edu-import-${idx}`,
      institution: e.institution || '',
      degree: e.studyType || e.degree || '',
      fieldOfStudy: e.area || e.fieldOfStudy || '',
      location: e.location || '',
      startDate: e.startDate || '',
      endDate: e.endDate || '',
      current: !e.endDate,
      gpa: e.score || e.gpa || '',
    }));
  }

  if (Array.isArray(json.skills)) {
    res.skillCategories = json.skills.map((s: any, idx: number) => ({
      id: `skill-import-${idx}`,
      categoryName: s.name || 'Technical Skills',
      skills: Array.isArray(s.keywords) ? s.keywords : [s.name]
    }));
  }

  return res;
}
