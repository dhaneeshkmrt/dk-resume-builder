import { ResumeData, ExperienceItem, EducationItem, SkillCategory, AwardItem } from '@/types/resume';
import { DEFAULT_RESUME } from '@/data/sampleResumes';

/**
 * Prompt provided to users so they can convert any existing resume (PDF, Word, text)
 * into the exact JSON schema required by DK Resume Builder using any LLM/AI tool.
 */
export const RESUME_CONVERSION_PROMPT = `Convert the following resume into the exact JSON format required for DK Resume Builder.
Return ONLY valid JSON. Do not include any markdown fences (like \`\`\`json), explanations, or text outside the JSON object.

JSON Schema:
{
  "personalInfo": {
    "fullName": "Your Full Name",
    "jobTitle": "Target Job Title / Current Title",
    "email": "your.email@example.com",
    "phone": "+1 234 567 8900",
    "location": "City, State / Country",
    "website": "https://yourportfolio.com",
    "linkedin": "https://linkedin.com/in/username",
    "github": "https://github.com/username"
  },
  "summary": "2-4 impactful sentences highlighting your core competencies, years of experience, and quantifiable achievements.",
  "experiences": [
    {
      "company": "Company Name",
      "role": "Job Title",
      "location": "City, State / Remote",
      "startDate": "YYYY-MM or YYYY",
      "endDate": "YYYY-MM or Present",
      "current": false,
      "bullets": [
        "Accomplished [X] measured by [Y] by doing [Z] with quantifiable metrics (%, $, numbers).",
        "Engineered scalable systems, reduced latency, and improved team velocity."
      ]
    }
  ],
  "education": [
    {
      "institution": "University / College Name",
      "degree": "Degree Name (e.g. Bachelor of Science)",
      "fieldOfStudy": "Field of Study (e.g. Computer Science)",
      "location": "City, State",
      "startDate": "YYYY",
      "endDate": "YYYY",
      "current": false,
      "gpa": "Optional GPA",
      "honors": "Optional Honors"
    }
  ],
  "skillCategories": [
    {
      "categoryName": "Languages & Frameworks",
      "skills": ["TypeScript", "React", "Node.js", "Python"]
    },
    {
      "categoryName": "Cloud & Infrastructure",
      "skills": ["AWS", "Docker", "Kubernetes", "PostgreSQL"]
    },
    {
      "categoryName": "Architecture & Practices",
      "skills": ["Microservices", "REST APIs", "System Design", "CI/CD"]
    }
  ]
}

--- PASTE YOUR EXISTING RESUME BELOW THIS LINE ---
`;

/**
 * Cleans input text by stripping markdown code fences (\`\`\`json ... \`\`\`)
 */
export function cleanJsonInput(rawText: string): string {
  if (!rawText) return '';
  let text = rawText.trim();
  if (text.startsWith('```json')) {
    text = text.replace(/^```json\s*/i, '');
  } else if (text.startsWith('```')) {
    text = text.replace(/^```\s*/, '');
  }
  if (text.endsWith('```')) {
    text = text.replace(/\s*```$/, '');
  }
  return text.trim();
}

/**
 * Validates whether the given raw text is valid JSON and contains recognizable resume fields
 */
export function validateResumeJson(rawText: string): {
  isValid: boolean;
  error?: string;
  parsed?: Partial<ResumeData>;
  summaryText?: string;
} {
  const cleaned = cleanJsonInput(rawText);
  if (!cleaned) {
    return { isValid: false };
  }

  try {
    const json = JSON.parse(cleaned);
    const parsed = parseJsonResume(json);

    const name = parsed.personalInfo?.fullName;
    const expCount = parsed.experiences?.length || 0;
    const eduCount = parsed.education?.length || 0;
    const skillsCount = parsed.skillCategories?.length || 0;

    if (!name && expCount === 0 && skillsCount === 0 && !parsed.summary) {
      return {
        isValid: false,
        error: 'JSON parsed successfully, but no recognizable resume data was found (missing personalInfo, experiences, or skills).',
      };
    }

    const summaryParts: string[] = [];
    if (name) summaryParts.push(name);
    if (expCount > 0) summaryParts.push(`${expCount} ${expCount === 1 ? 'position' : 'positions'}`);
    if (skillsCount > 0) summaryParts.push(`${skillsCount} skill ${skillsCount === 1 ? 'group' : 'groups'}`);
    if (eduCount > 0) summaryParts.push(`${eduCount} education`);

    return {
      isValid: true,
      parsed,
      summaryText: summaryParts.join(' • '),
    };
  } catch (err: any) {
    return {
      isValid: false,
      error: err?.message || 'Invalid JSON syntax. Check for missing quotes or commas.',
    };
  }
}

/**
 * Parse standard JSON Resume or native DK Resume Builder JSON object
 */
export function parseJsonResume(json: any): Partial<ResumeData> {
  const res: Partial<ResumeData> = {};

  // 1. Personal Info
  if (json.personalInfo) {
    res.personalInfo = {
      fullName: json.personalInfo.fullName || '',
      jobTitle: json.personalInfo.jobTitle || '',
      email: json.personalInfo.email || '',
      phone: json.personalInfo.phone || '',
      location: json.personalInfo.location || '',
      website: json.personalInfo.website || '',
      linkedin: json.personalInfo.linkedin || '',
      github: json.personalInfo.github || '',
      portfolio: json.personalInfo.portfolio || json.personalInfo.website || '',
    };
  } else if (json.basics) {
    res.personalInfo = {
      fullName: json.basics.name || '',
      jobTitle: json.basics.label || '',
      email: json.basics.email || '',
      phone: json.basics.phone || '',
      location:
        typeof json.basics.location === 'string'
          ? json.basics.location
          : json.basics.location?.address || json.basics.location?.city || '',
      website: json.basics.url || '',
      linkedin: json.basics.profiles?.find((p: any) => p.network?.toLowerCase().includes('linkedin'))?.url || '',
      github: json.basics.profiles?.find((p: any) => p.network?.toLowerCase().includes('github'))?.url || '',
      portfolio: '',
    };
  }

  // 2. Summary
  res.summary = json.summary || json.basics?.summary || '';

  // 3. Experiences / Work
  const rawWork = json.experiences || json.work;
  if (Array.isArray(rawWork)) {
    res.experiences = rawWork.map((w: any, idx: number): ExperienceItem => ({
      id: w.id || `exp-import-${idx}-${Date.now()}`,
      company: w.company || w.name || '',
      role: w.role || w.position || '',
      location: w.location || '',
      startDate: w.startDate || '',
      endDate: w.endDate || '',
      current: w.current ?? (!w.endDate || w.endDate.toLowerCase() === 'present'),
      bullets: Array.isArray(w.bullets)
        ? w.bullets
        : Array.isArray(w.highlights)
        ? w.highlights
        : [w.summary].filter(Boolean),
    }));
  }

  // 4. Education
  const rawEdu = json.education;
  if (Array.isArray(rawEdu)) {
    res.education = rawEdu.map((e: any, idx: number): EducationItem => ({
      id: e.id || `edu-import-${idx}-${Date.now()}`,
      institution: e.institution || '',
      degree: e.degree || e.studyType || '',
      fieldOfStudy: e.fieldOfStudy || e.area || '',
      location: e.location || '',
      startDate: e.startDate || '',
      endDate: e.endDate || '',
      current: e.current ?? (!e.endDate || e.endDate.toLowerCase() === 'present'),
      gpa: e.gpa || e.score || '',
      honors: e.honors || '',
    }));
  }

  // 5. Skills
  const rawSkills = json.skillCategories || json.skills;
  if (Array.isArray(rawSkills)) {
    res.skillCategories = rawSkills.map((s: any, idx: number): SkillCategory => {
      let skillsList: string[] = [];
      if (Array.isArray(s.skills)) {
        skillsList = s.skills;
      } else if (Array.isArray(s.keywords)) {
        skillsList = s.keywords;
      } else if (typeof s === 'string') {
        skillsList = [s];
      }

      return {
        id: s.id || `skill-import-${idx}-${Date.now()}`,
        categoryName: s.categoryName || s.name || `Skill Group ${idx + 1}`,
        skills: skillsList,
        separator: s.separator || 'comma',
      };
    });
  }

  // 6. Awards
  const rawAwards = json.awards;
  if (Array.isArray(rawAwards)) {
    res.awards = rawAwards.map((a: any, idx: number): AwardItem => ({
      id: a.id || `award-import-${idx}-${Date.now()}`,
      title: a.title || '',
      issuer: a.issuer || a.awarder || '',
      date: a.date || '',
      description: a.description || a.summary || '',
    }));
  }

  // 7. Custom Sections
  if (Array.isArray(json.customSections)) {
    res.customSections = json.customSections;
  }

  // 8. Settings
  if (json.settings && typeof json.settings === 'object') {
    res.settings = json.settings;
  }

  // 9. Title & ID
  if (json.title) res.title = json.title;
  if (json.id) res.id = json.id;

  return res;
}

/**
 * Builds a complete ResumeData object from imported JSON, filling in any missing defaults
 */
export function buildCompleteResumeFromImport(parsed: Partial<ResumeData>): ResumeData {
  const base = DEFAULT_RESUME;
  const fullName = parsed.personalInfo?.fullName || 'Imported Resume';
  const timestamp = Date.now();

  return {
    id: parsed.id || `imported-${timestamp}`,
    title: parsed.title || fullName,
    personalInfo: {
      ...base.personalInfo,
      ...(parsed.personalInfo || {}),
      fullName,
    },
    summary: parsed.summary ?? '',
    experiences: parsed.experiences || [],
    education: parsed.education || [],
    skillCategories: parsed.skillCategories || [],
    awards: parsed.awards || [],
    customSections: parsed.customSections || [],
    sectionOrder: parsed.sectionOrder || base.sectionOrder,
    settings: {
      ...base.settings,
      ...(parsed.settings || {}),
    },
  };
}
