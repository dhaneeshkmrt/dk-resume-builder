import { ResumeData } from '@/types/resume';

export const DEFAULT_RESUME: ResumeData = {
  id: 'alex-morgan-full-stack',
  title: 'Alex Morgan - Senior Full Stack Engineer',
  personalInfo: {
    fullName: 'Alex Morgan',
    jobTitle: 'Senior Full Stack Engineer | Cloud Architecture',
    email: 'alex.morgan@example.com',
    phone: '+1 (555) 234-5678',
    location: 'San Francisco, CA',
    website: 'https://alexmorgan.dev',
    linkedin: 'https://linkedin.com/in/alexmorgandev',
    github: 'https://github.com/alexmorgandev',
    portfolio: 'https://alexmorgan.dev',
  },
  summary:
    '**Senior Full Stack Engineer** with **8+ years of experience** designing and operating high-throughput enterprise web applications and distributed systems. Expert in **React**, **Next.js**, **Node.js**, **TypeScript**, **PostgreSQL**, and **AWS cloud infrastructure**. Proven track record of improving web performance by 40%+, scaling services to 1M+ active users, and mentoring cross-functional engineering teams.',
  experiences: [
    {
      id: 'exp-cloudscale',
      company: 'CloudScale Technologies',
      role: 'Staff Full Stack Engineer',
      location: 'San Francisco, CA (Hybrid)',
      startDate: '2022 Jan',
      endDate: 'Present',
      current: true,
      bullets: [
        'Architected high-throughput customer analytics platform handling **25,000+ requests/sec** using **Next.js**, **Node.js**, and **PostgreSQL**.',
        'Reduced client-side bundle size by **45% (3.8 MB to 850 KB)** through dynamic code splitting, tree-shaking, and edge asset caching.',
        'Engineered real-time notification engine using **WebSockets** and **Redis Pub/Sub**, decreasing message delivery latency from 1.2s to sub-100ms.',
        'Established automated CI/CD pipeline using **GitHub Actions**, **Docker**, and **AWS ECS**, cutting release deployment time by **60%**.',
        'Led architecture design reviews and mentored **6 junior and mid-level software engineers** on clean code and system scalability.'
      ]
    },
    {
      id: 'exp-apex',
      company: 'Apex Enterprise Solutions',
      role: 'Senior Software Engineer',
      location: 'Austin, TX',
      startDate: '2019 Jun',
      endDate: '2021 Dec',
      current: false,
      bullets: [
        'Spearheaded the migration of a legacy monolithic platform into **14 domain-driven microservices** using **Node.js**, **Express**, and **RabbitMQ**.',
        'Designed and implemented secure OAuth 2.0 / OIDC role-based authentication service serving **500k+ enterprise users**.',
        'Optimized slow database queries and implemented **Redis multi-layer caching**, improving API response times by **65%**.',
        'Enforced automated end-to-end testing with **Playwright** and **Jest**, elevating test coverage from 42% to **88%** across core workflows.'
      ]
    },
    {
      id: 'exp-nexar',
      company: 'Nexar Media Systems',
      role: 'Full Stack Developer',
      location: 'Seattle, WA',
      startDate: '2016 Aug',
      endDate: '2019 May',
      current: false,
      bullets: [
        'Developed responsive client portals and reusable UI components in **React** and **TypeScript**, maintaining strict WCAG 2.1 AA accessibility standards.',
        'Created RESTful data ingestion APIs in **Python (FastAPI)** and integrated with third-party payment gateways (Stripe, PayPal).',
        'Decreased database deadlocks by 90% by redesigning database schema indexes and transaction boundaries.'
      ]
    }
  ],
  education: [
    {
      id: 'edu-ucb',
      institution: 'University of California, Berkeley',
      degree: 'Bachelor of Science',
      fieldOfStudy: 'Computer Science',
      location: 'Berkeley, CA',
      startDate: '2012',
      endDate: '2016',
      current: false,
      gpa: '3.8/4.0',
      honors: 'Dean\'s Honor List'
    }
  ],
  skillCategories: [
    {
      id: 'skills-frontend',
      categoryName: 'Frontend Platform',
      skills: ['TypeScript', 'JavaScript (ES6+)', 'React 19', 'Next.js', 'Tailwind CSS', 'Redux / Zustand', 'HTML5 & Modern CSS'],
      separator: 'comma'
    },
    {
      id: 'skills-backend',
      categoryName: 'Backend & APIs',
      skills: ['Node.js', 'Express', 'Python / FastAPI', 'REST APIs', 'GraphQL', 'gRPC', 'Microservices Architecture'],
      separator: 'comma'
    },
    {
      id: 'skills-cloud',
      categoryName: 'Cloud & DevOps',
      skills: ['AWS (ECS, S3, RDS, Lambda)', 'Docker', 'Kubernetes', 'CI/CD (GitHub Actions)', 'Terraform', 'Datadog'],
      separator: 'comma'
    },
    {
      id: 'skills-db',
      categoryName: 'Databases & Storage',
      skills: ['PostgreSQL', 'Redis', 'MongoDB', 'DynamoDB', 'Elasticsearch'],
      separator: 'comma'
    }
  ],
  projects: [
    {
      id: 'proj-offline-tasker',
      name: 'OpenMetrics: Developer Analytics Engine',
      role: 'Creator & Lead Maintainer',
      url: 'https://openmetrics-demo.example.com',
      githubUrl: 'https://github.com/alexmorgandev/openmetrics',
      technologies: ['TypeScript', 'Next.js', 'Tailwind CSS', 'PostgreSQL'],
      bullets: [
        'Built an open-source engineering metrics dashboard with **1,500+ GitHub stars** used by 200+ developer teams.',
        'Designed lightweight local-storage first caching engine with instant zero-latency visual rendering.'
      ],
      startDate: '2023 Jan',
      endDate: '2023 Dec'
    }
  ],
  certifications: [
    {
      id: 'cert-aws-saa',
      name: 'AWS Certified Solutions Architect – Associate',
      issuer: 'Amazon Web Services',
      issueDate: '2023',
    },
    {
      id: 'cert-k8s',
      name: 'Certified Kubernetes Application Developer (CKAD)',
      issuer: 'Cloud Native Computing Foundation (CNCF)',
      issueDate: '2022',
    }
  ],
  awards: [
    {
      id: 'award-hackathon',
      title: 'First Place – Enterprise Cloud Hackathon',
      issuer: 'Cloud Developer Summit',
      date: '2022',
      description: 'Awarded 1st place among 80 teams for architecting real-time anomaly detection workflow.'
    }
  ],
  customSections: [],
  sectionOrder: ['summary', 'experience', 'skills', 'projects', 'education', 'certifications'],
  settings: {
    template: 'modern',
    fontFamily: 'Inter',
    fontSize: 10,
    lineSpacing: 'normal',
    primaryColor: '#186750',
    pageSize: 'A4',
    showSectionIcons: true,
    twoColumnLayout: false,
    contactHeaderStyle: 'bullets',
  }
};

export const BACKEND_ARCHITECT_RESUME: ResumeData = {
  id: 'jordan-lee-backend-architect',
  title: 'Jordan Lee - Backend & Cloud Architect',
  personalInfo: {
    fullName: 'Jordan Lee',
    jobTitle: 'Principal Backend Engineer | Distributed Systems',
    email: 'jordan.lee@example.com',
    phone: '+1 (555) 987-6543',
    location: 'New York, NY',
    website: 'https://jordanlee.example.com',
    linkedin: 'https://linkedin.com/in/jordanleedev',
    github: 'https://github.com/jordanleedev',
    portfolio: 'https://jordanlee.example.com',
  },
  summary:
    '**Principal Backend Engineer** with **10+ years of experience** specializing in high-concurrency distributed systems, transactional databases, and resilient microservice architectures. Proven track record of scaling mission-critical platforms to **50M+ daily transactions** with 99.999% availability.',
  experiences: [
    {
      id: 'exp-strata',
      company: 'Strata Financial Cloud',
      role: 'Principal Systems Architect',
      location: 'New York, NY',
      startDate: '2021 Mar',
      endDate: 'Present',
      current: true,
      bullets: [
        'Architected real-time transaction ledger processing **$2B+ in annual transaction volume** with sub-millisecond execution times.',
        'Designed fault-tolerant event pipeline across **Kafka** and **Apache Flink**, reducing data replication lag by 80%.',
        'Standardized infrastructure-as-code using **Terraform** and **AWS EKS**, automating multi-region disaster recovery.'
      ]
    },
    {
      id: 'exp-beacon',
      company: 'Beacon Cloud Infrastructure',
      role: 'Staff Software Engineer',
      location: 'Boston, MA',
      startDate: '2017 Jul',
      endDate: '2021 Feb',
      current: false,
      bullets: [
        'Engineered core API gateway handling **40k req/sec** using **Go** and **gRPC**, lowering CPU overhead by 35%.',
        'Implemented distributed database sharding for **PostgreSQL**, sustaining 5x customer data growth without query degradation.'
      ]
    }
  ],
  education: [
    {
      id: 'edu-mit',
      institution: 'Massachusetts Institute of Technology',
      degree: 'Master of Science',
      fieldOfStudy: 'Computer Science',
      location: 'Cambridge, MA',
      startDate: '2015',
      endDate: '2017',
      current: false,
      gpa: '3.9/4.0'
    }
  ],
  skillCategories: [
    {
      id: 'skills-backend-core',
      categoryName: 'Core Backend',
      skills: ['Go (Golang)', 'Java / Spring Boot', 'Python', 'gRPC & Protocol Buffers', 'RESTful Systems'],
      separator: 'comma'
    },
    {
      id: 'skills-infra',
      categoryName: 'Cloud & Distributed Systems',
      skills: ['AWS', 'Kubernetes', 'Apache Kafka', 'Docker', 'Terraform', 'Prometheus & Grafana'],
      separator: 'comma'
    },
    {
      id: 'skills-storage',
      categoryName: 'Databases & Caching',
      skills: ['PostgreSQL', 'Redis', 'Cassandra', 'Database Sharding', 'ACID Transactions'],
      separator: 'comma'
    }
  ],
  projects: [
    {
      id: 'proj-grpc-proxy',
      name: 'High-Throughput gRPC Proxy Engine',
      technologies: ['Go', 'Docker', 'Kubernetes'],
      bullets: [
        'Published lightweight reverse proxy benchmarking 100k+ concurrent requests with zero packet drop.'
      ],
      githubUrl: 'https://github.com/jordanleedev/grpc-proxy'
    }
  ],
  certifications: [
    {
      id: 'cert-aws-pro',
      name: 'AWS Certified Solutions Architect – Professional',
      issuer: 'Amazon Web Services',
      issueDate: '2023'
    }
  ],
  awards: [],
  customSections: [],
  sectionOrder: ['summary', 'experience', 'skills', 'education', 'certifications', 'projects'],
  settings: {
    template: 'compact',
    fontFamily: 'Roboto',
    fontSize: 10,
    lineSpacing: 'compact',
    primaryColor: '#1e3a8a',
    pageSize: 'A4',
    showSectionIcons: true,
    twoColumnLayout: false,
    contactHeaderStyle: 'pipes',
  }
};

export const FRONTEND_ENGINEER_RESUME: ResumeData = {
  id: 'taylor-rivera-frontend',
  title: 'Taylor Rivera - Staff Frontend Engineer',
  personalInfo: {
    fullName: 'Taylor Rivera',
    jobTitle: 'Staff Frontend Engineer | Design Systems',
    email: 'taylor.rivera@example.com',
    phone: '+1 (555) 456-7890',
    location: 'Seattle, WA',
    website: 'https://taylorrivera.example.com',
    linkedin: 'https://linkedin.com/in/taylorriveradev',
    github: 'https://github.com/taylorriveradev',
    portfolio: 'https://taylorrivera.example.com',
  },
  summary:
    '**Staff Frontend Engineer** with **7+ years of experience** architecting high-scale design systems, accessible web interfaces, and modern React architectures. Champion of web performance, zero-bundle overhead patterns, and developer experience (DX).',
  experiences: [
    {
      id: 'exp-pulse',
      company: 'Pulse Design Platform',
      role: 'Staff Frontend Engineer',
      location: 'Seattle, WA',
      startDate: '2022 Mar',
      endDate: 'Present',
      current: true,
      bullets: [
        'Architected comprehensive design system consumed by **40+ product teams** across web and mobile web.',
        'Increased Core Web Vitals (LCP, CLS, INP) scores to 99% across high-traffic checkout flows.',
        'Authored open-source headless UI library adopted by **10,000+ developers**.'
      ]
    }
  ],
  education: [
    {
      id: 'edu-uw',
      institution: 'University of Washington',
      degree: 'Bachelor of Science',
      fieldOfStudy: 'Human Centered Design & Engineering',
      location: 'Seattle, WA',
      startDate: '2014',
      endDate: '2018',
      current: false,
      gpa: '3.85/4.0'
    }
  ],
  skillCategories: [
    {
      id: 'skills-fe-core',
      categoryName: 'Frontend Core',
      skills: ['TypeScript', 'React 19', 'Next.js', 'Tailwind CSS', 'CSS Modules', 'Web Performance Optimization'],
      separator: 'comma'
    },
    {
      id: 'skills-tooling',
      categoryName: 'Design Systems & Testing',
      skills: ['Storybook', 'Figma Tokens', 'Jest', 'Playwright', 'WCAG 2.1 AA Accessibility', 'Vite'],
      separator: 'comma'
    }
  ],
  projects: [],
  certifications: [],
  awards: [],
  customSections: [],
  sectionOrder: ['summary', 'experience', 'skills', 'education'],
  settings: {
    template: 'minimal',
    fontFamily: 'Inter',
    fontSize: 11,
    lineSpacing: 'normal',
    primaryColor: '#0f766e',
    pageSize: 'A4',
    showSectionIcons: false,
    twoColumnLayout: false,
    contactHeaderStyle: 'bullets',
  }
};


export const SAMPLE_RESUMES = [
  {
    id: 'alex-morgan-full-stack',
    label: 'Alex Morgan - Senior Full Stack Engineer',
    data: DEFAULT_RESUME
  },
  {
    id: 'jordan-lee-backend-architect',
    label: 'Jordan Lee - Backend & Cloud Architect',
    data: BACKEND_ARCHITECT_RESUME
  },
  {
    id: 'taylor-rivera-frontend',
    label: 'Taylor Rivera - Staff Frontend Engineer',
    data: FRONTEND_ENGINEER_RESUME
  },
];
