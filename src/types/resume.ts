
export type TemplateId =
  | 'modern'
  | 'minimal'
  | 'compact'
  | 'executive'
  | 'technical'
  | 'slate'
  | 'academic'
  | 'graphic'
  | 'colorful'
  | 'classic'
  | 'professional'
  | 'impact'
  | 'twocolumn';

export type FontFamily = 'Inter' | 'Lato' | 'Merriweather' | 'Garamond' | 'Roboto' | 'JetBrains Mono';

export type PageSize = 'A4' | 'Letter';

export type LineSpacing = 'compact' | 'normal' | 'relaxed';

export type ContactHeaderStyle = 'bullets' | 'pills' | 'pipes' | 'icons';

export interface ResumeSettings {
  template: TemplateId;
  fontFamily: FontFamily;
  fontSize: number; // e.g. 10, 11, 12 pt
  lineSpacing: LineSpacing;
  primaryColor: string;
  pageSize: PageSize;
  showSectionIcons: boolean;
  twoColumnLayout: boolean;
  contactHeaderStyle?: ContactHeaderStyle;
}

export interface PersonalInfo {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  github: string;
  portfolio: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bullets: string[];
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  gpa?: string;
  honors?: string;
}

export interface SkillCategory {
  id: string;
  categoryName: string;
  skills: string[];
  separator?: 'comma' | 'pipe';
}

export interface ProjectItem {
  id: string;
  name: string;
  role?: string;
  url?: string;
  githubUrl?: string;
  technologies: string[];
  bullets: string[];
  startDate?: string;
  endDate?: string;
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expirationDate?: string;
  credentialId?: string;
  url?: string;
}

export interface AwardItem {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description: string;
}

export interface CustomSectionItem {
  id: string;
  title: string;
  subtitle?: string;
  date?: string;
  bullets: string[];
}

export interface CustomSection {
  id: string;
  title: string;
  items: CustomSectionItem[];
}

export interface ResumeSectionOrder {
  id: string;
  name: string;
  enabled: boolean;
}

export interface ResumeData {
  id: string;
  title: string;
  personalInfo: PersonalInfo;
  summary: string;
  experiences: ExperienceItem[];
  education: EducationItem[];
  skillCategories: SkillCategory[];
  projects: ProjectItem[];
  certifications: CertificationItem[];
  awards: AwardItem[];
  customSections: CustomSection[];
  sectionOrder: string[];
  settings: ResumeSettings;
  targetJobDescription?: string;
}

export interface AtsAuditResult {
  overallScore: number;
  breakdown: {
    formatting: number; // 0-100
    impactMetrics: number; // 0-100
    actionVerbs: number; // 0-100
    keywords: number; // 0-100
    completeness: number; // 0-100
  };
  metricsFoundCount: number;
  actionVerbsCount: number;
  totalWordCount: number;
  readingTimeMinutes: number;
  pageEstimate: number;
  issues: {
    type: 'critical' | 'warning' | 'info' | 'success';
    message: string;
    section?: string;
    suggestion?: string;
  }[];
  jdMatch?: {
    matchRate: number;
    foundKeywords: string[];
    missingKeywords: string[];
  };
}
