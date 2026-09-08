
export const ACTION_VERBS = [
  // Leadership & Management
  'Directed', 'Spearheaded', 'Orchestrated', 'Championed', 'Led', 'Mobilized', 'Engineered', 'Overhauled',
  'Pioneered', 'Architected', 'Supervised', 'Mentored', 'Cultivated', 'Governed', 'Streamlined', 'Transformed',
  // Engineering & Technical
  'Built', 'Developed', 'Deployed', 'Designed', 'Implemented', 'Refactored', 'Automated', 'Configured',
  'Integrated', 'Maintained', 'Programmed', 'Constructed', 'Migrated', 'Containerized', 'Scaled', 'Provisioned',
  // Analysis & Strategy
  'Analyzed', 'Formulated', 'Assessed', 'Benchmarked', 'Synthesized', 'Diagnosed', 'Evaluated', 'Investigated',
  'Quantified', 'Audited', 'Forecasted', 'Optimized', 'Surveyed', 'Modeled', 'Standardized',
  // Impact & Growth
  'Accelerated', 'Boosted', 'Elevated', 'Expanded', 'Generated', 'Increased', 'Maximized', 'Outperformed',
  'Reduced', 'Saved', 'Surpassed', 'Amplified', 'Doubled', 'Tripled', 'Cut', 'Enhanced',
  // Execution & Delivery
  'Delivered', 'Executed', 'Launched', 'Produced', 'Resolved', 'Shipped', 'Streamlined', 'Completed',
  'Dispatched', 'Published', 'Rolled out', 'Standardized', 'Secured', 'Facilitated'
];

export const POWER_WORDS = [
  'Measurably', 'Significantly', 'Strategically', 'Seamlessly', 'Cross-functionally',
  'End-to-end', 'High-throughput', 'Scalable', 'Zero-downtime', 'Production-grade',
  'Mission-critical', 'Cloud-native', 'Data-driven', 'Automated'
];

export const SAMPLE_ACTION_VERBS_BY_ROLE: Record<string, string[]> = {
  'Software Engineer': ['Architected', 'Engineered', 'Optimized', 'Deployed', 'Automated', 'Scaled', 'Refactored', 'Reduced latency by'],
  'Product Manager': ['Spearheaded', 'Launched', 'Defined', 'Prioritized', 'Increased MAU by', 'Boosted conversion by', 'Orchestrated roadmap'],
  'Data Scientist': ['Modeled', 'Analyzed', 'Trained', 'Deployed LLM', 'Improved precision by', 'Reduced error rate by', 'Extracted insights'],
  'DevOps / SRE': ['Automated', 'Provisioned', 'Decreased downtime by', 'Migrated Kubernetes', 'Configured CI/CD', 'Hardened security'],
};
