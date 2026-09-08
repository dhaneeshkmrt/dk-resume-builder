
import { ResumeData, AtsAuditResult } from '@/types/resume';
import { ACTION_VERBS } from '@/data/actionVerbs';

// Regular expressions to detect quantifiable metrics (numbers, %, $, time, scale)
const METRIC_REGEX = /((\d+(\.\d+)?%|\$\d+([\d,.]*[kmbKMB])?|\d+([\d,.]*[kmbKMB])|\d+\+?(\s*(years|months|users|events|teams|engineers|customers|projects|leads|clients|requests|req\/sec|ms|s|hours|pts|points|x|X))|sub-\d+ms|p9[0-9]|\b(first|top\s+\d+|#\d+)\b))/gi;

const COMMON_STOPWORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from',
  'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
  'i', 'you', 'he', 'she', 'it', 'we', 'they', 'their', 'our', 'my', 'your', 'his', 'her',
  'this', 'that', 'these', 'those', 'will', 'would', 'shall', 'should', 'can', 'could', 'may', 'might',
  'must', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'any', 'as', 'because',
  'before', 'below', 'between', 'both', 'during', 'each', 'few', 'further', 'here', 'how', 'if',
  'into', 'more', 'most', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very',
  'what', 'when', 'where', 'which', 'while', 'who', 'whom', 'why', 'working', 'experience', 'responsible'
]);

export function extractKeywords(text: string): string[] {
  if (!text) return [];
  // Tokenize words, normalize, filter stopwords and short tokens
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9+#.-]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2 && !COMMON_STOPWORDS.has(w));

  const freqMap: Record<string, number> = {};
  for (const w of words) {
    freqMap[w] = (freqMap[w] || 0) + 1;
  }

  // Sort by frequency
  return Object.keys(freqMap)
    .sort((a, b) => freqMap[b] - freqMap[a])
    .slice(0, 30);
}

export function calculateAtsAudit(resume: ResumeData, jobDescription?: string): AtsAuditResult {
  const issues: AtsAuditResult['issues'] = [];

  // 1. Completeness Audit
  let completenessScore = 100;
  if (!resume.personalInfo.fullName?.trim()) {
    completenessScore -= 25;
    issues.push({ type: 'critical', message: 'Full name is missing', section: 'Contact Info' });
  }
  if (!resume.personalInfo.email?.trim() || !resume.personalInfo.email.includes('@')) {
    completenessScore -= 20;
    issues.push({ type: 'critical', message: 'Valid email address is missing', section: 'Contact Info' });
  }
  if (!resume.personalInfo.phone?.trim()) {
    completenessScore -= 15;
    issues.push({ type: 'warning', message: 'Phone number is missing', section: 'Contact Info' });
  }
  if (!resume.personalInfo.location?.trim()) {
    completenessScore -= 10;
    issues.push({ type: 'info', message: 'Location/City is recommended for local ATS filters', section: 'Contact Info' });
  }
  if (!resume.summary?.trim()) {
    completenessScore -= 15;
    issues.push({ type: 'warning', message: 'Professional summary is empty', section: 'Summary' });
  }
  if (resume.experiences.length === 0) {
    completenessScore -= 30;
    issues.push({ type: 'critical', message: 'No work experience added', section: 'Experience' });
  }
  if (resume.skillCategories.length === 0 || resume.skillCategories.every(c => c.skills.length === 0)) {
    completenessScore -= 20;
    issues.push({ type: 'critical', message: 'Skills section is empty or missing', section: 'Skills' });
  }
  completenessScore = Math.max(0, completenessScore);

  // 2. Metrics & Quantifiable Impact Audit
  let totalBullets = 0;
  let bulletsWithMetrics = 0;
  let totalWords = 0;
  const allResumeTextParts: string[] = [
    resume.summary,
    resume.personalInfo.jobTitle,
  ];

  const lowerVerbsSet = new Set(ACTION_VERBS.map(v => v.toLowerCase()));
  let actionVerbsFoundCount = 0;

  resume.experiences.forEach(exp => {
    exp.bullets.forEach(b => {
      if (!b.trim()) return;
      totalBullets++;
      const words = b.trim().split(/\s+/);
      totalWords += words.length;
      allResumeTextParts.push(b);

      // Check first word action verb
      const firstWord = words[0]?.replace(/[^a-zA-Z]/g, '').toLowerCase();
      if (lowerVerbsSet.has(firstWord)) {
        actionVerbsFoundCount++;
      }

      // Check quantifiable metrics
      if (METRIC_REGEX.test(b)) {
        bulletsWithMetrics++;
      }
    });
  });

  resume.projects.forEach(proj => {
    proj.bullets.forEach(b => {
      if (!b.trim()) return;
      totalBullets++;
      const words = b.trim().split(/\s+/);
      totalWords += words.length;
      allResumeTextParts.push(b);

      if (METRIC_REGEX.test(b)) {
        bulletsWithMetrics++;
      }
    });
  });

  resume.skillCategories.forEach(cat => {
    cat.skills.forEach(s => allResumeTextParts.push(s));
  });

  const fullResumeText = allResumeTextParts.join(' ').toLowerCase();

  // Metric Score (Target: at least 60% of bullets have numbers/impact)
  const metricRatio = totalBullets > 0 ? (bulletsWithMetrics / totalBullets) : 0;
  let impactScore = Math.min(100, Math.round(metricRatio * 130));
  if (metricRatio < 0.4 && totalBullets > 0) {
    issues.push({
      type: 'warning',
      message: `Only ${bulletsWithMetrics} of ${totalBullets} bullet points contain quantifiable metrics (%, $, numbers).`,
      suggestion: 'Use the Google XYZ Formula: Accomplished [X] as measured by [Y] by doing [Z].'
    });
  } else if (metricRatio >= 0.6) {
    issues.push({
      type: 'success',
      message: `Strong quantifiable impact! ${bulletsWithMetrics} of ${totalBullets} bullets include metrics.`
    });
  }

  // Action Verbs Score
  const actionVerbRatio = totalBullets > 0 ? (actionVerbsFoundCount / totalBullets) : 0;
  let actionVerbScore = Math.min(100, Math.round(actionVerbRatio * 140));
  if (actionVerbRatio < 0.5 && totalBullets > 0) {
    issues.push({
      type: 'warning',
      message: 'Start more bullet points with strong power action verbs (e.g., Spearheaded, Architected, Automated).',
      suggestion: 'Avoid weak passive phrasing like "Responsible for" or "Assisted with".'
    });
  }

  // 3. Formatting & ATS Layout Audit
  let formattingScore = 100;
  if (resume.settings.twoColumnLayout) {
    formattingScore -= 10;
    issues.push({
      type: 'info',
      message: 'Two-column layout active. While modern, single-column is 100% foolproof on older legacy ATS parsers.'
    });
  }
  if (totalWords < 200) {
    formattingScore -= 20;
    issues.push({
      type: 'warning',
      message: 'Resume text is brief (under 200 words). Aim for 350-600 words for a standard 1-page resume.'
    });
  } else if (totalWords > 950) {
    formattingScore -= 10;
    issues.push({
      type: 'info',
      message: 'Resume exceeds 900 words and might spill awkwardly into page 2. Consider trimming for conciseness.'
    });
  }

  // 4. Job Description Matcher (if provided)
  let jdMatchResult: AtsAuditResult['jdMatch'] = undefined;
  let keywordScore = 85;

  if (jobDescription && jobDescription.trim().length > 30) {
    const jdKeywords = extractKeywords(jobDescription);
    const foundKeywords: string[] = [];
    const missingKeywords: string[] = [];

    jdKeywords.forEach(kw => {
      if (fullResumeText.includes(kw)) {
        foundKeywords.push(kw);
      } else {
        missingKeywords.push(kw);
      }
    });

    const matchRate = jdKeywords.length > 0 ? Math.round((foundKeywords.length / jdKeywords.length) * 100) : 100;
    keywordScore = matchRate;

    jdMatchResult = {
      matchRate,
      foundKeywords,
      missingKeywords
    };

    if (matchRate < 60) {
      issues.push({
        type: 'critical',
        message: `ATS Job Match is low (${matchRate}%). Missing critical keywords: ${missingKeywords.slice(0, 5).join(', ')}`,
        suggestion: 'Incorporate these exact terms in your skills and experience bullets.'
      });
    } else if (matchRate >= 80) {
      issues.push({
        type: 'success',
        message: `Excellent keyword match (${matchRate}%) with the target Job Description!`
      });
    }
  }

  // Overall Weighted Score
  const overallScore = Math.round(
    completenessScore * 0.25 +
    impactScore * 0.25 +
    actionVerbScore * 0.20 +
    formattingScore * 0.15 +
    keywordScore * 0.15
  );

  const readingTimeMinutes = Math.max(1, Math.ceil(totalWords / 200));
  const pageEstimate = totalWords < 450 ? 1 : totalWords < 900 ? 2 : 3;

  return {
    overallScore: Math.min(100, Math.max(0, overallScore)),
    breakdown: {
      completeness: Math.min(100, completenessScore),
      impactMetrics: Math.min(100, impactScore),
      actionVerbs: Math.min(100, actionVerbScore),
      formatting: Math.min(100, formattingScore),
      keywords: Math.min(100, keywordScore),
    },
    metricsFoundCount: bulletsWithMetrics,
    actionVerbsCount: actionVerbsFoundCount,
    totalWordCount: totalWords,
    readingTimeMinutes,
    pageEstimate,
    issues,
    jdMatch: jdMatchResult
  };
}
