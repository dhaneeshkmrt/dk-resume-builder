<div align="center">

# 📄 DK Resume Builder

**A 100% Free, Privacy-Friendly, Offline-First ATS Resume Builder for Developers**

*Built by a developer to help other devs create clean, high-impact resumes with zero tracking, zero subscriptions, and complete data ownership.*

[![Offline-First](https://img.shields.io/badge/Storage-100%25%20Offline--First-047857?style=for-the-badge&logo=offline&logoColor=white)](https://github.com)
[![Privacy-Friendly](https://img.shields.io/badge/Privacy-Zero%20Tracking%20%2F%20Zero%20Analytics-186750?style=for-the-badge&logo=shield&logoColor=white)](https://github.com)
[![ATS Compliant](https://img.shields.io/badge/ATS-100%25%20Compliant-065f46?style=for-the-badge&logo=checkmarx&logoColor=white)](https://github.com)
[![No AI Gimmicks](https://img.shields.io/badge/AI-None%20(Real%20Experience%20Only)-0f766e?style=for-the-badge)](https://github.com)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

</div>

---

## 📌 GitHub Repository Details

If you are maintaining or forking this repository on GitHub, here are the recommended repository settings:

- **Repository Name**: `dk-resume-builder`
- **Short Description (About)**:
  > *A 100% free, privacy-friendly, offline-first ATS resume builder for developers. Stores all data strictly in your browser's local storage with zero analytics, zero tracking, and no AI gimmicks. Built by a developer to help other devs.*
- **Website URL**: *(Your deployed domain or GitHub Pages)*
- **Topics / Tags**:
  `resume-builder`, `offline-first`, `privacy-friendly`, `localstorage`, `zero-tracking`, `developer-tools`, `ats-friendly`, `nextjs15`, `react19`, `typescript`, `tailwind-css`

---

## 💡 Why DK Resume Builder?

Most modern resume builders are filled with traps:
- **Forced Subscriptions & Paywalls**: They let you spend hours typing your resume, only to charge you $20/month just to download the PDF.
- **Privacy Invasive**: Your personal contact information, phone numbers, home address, and complete career history get stored on remote corporate servers, often sold or scraped for recruiting databases.
- **Aggressive Tracking & Analytics**: Filled with third-party trackers, Google Analytics, telemetry, and advertising pixels watching every keystroke.
- **Unreliable AI Gimmicks**: Pushy generative AI tools that hallucinate fake achievements, churn out generic buzzwords, and make resumes look like every other robot-generated profile.

**DK Resume Builder was built to fix all of that.**

Created by a developer for fellow developers, **DK Resume Builder** is designed with three core principles:
1. **100% Privacy-Friendly & Offline-First**: All your data is saved exclusively in your browser's Local Storage. No cloud database. No backend server saving your details. It works without internet.
2. **Zero Analytics & Zero Tracking**: No Google Analytics, no telemetry, no tracking pixels, no third-party cookies, and no ad scripts. Your data never leaves your computer.
3. **No AI Gimmicks**: You write your own genuine experience. You get real engineering action verbs, quantifiable metric formulas, and structural ATS guidance without black-box AI rewrites.

---

## ✨ Key Features

### 🔒 1. 100% Offline-First & Privacy-Focused
- All resumes, customizations, and settings are persisted directly to browser `localStorage`.
- No account registration, no login, and no passwords required.
- Clear, backup, or wipe your data anytime in 1 click.

### 🛡️ 2. Live ATS Audit & Score (0–100)
- Real-time applicant tracking system (ATS) scanner analyzes your resume against industry recruitment standards.
- Checks contact info completeness, quantifiable metric density (`%`, `$`, throughput numbers), action verb power, and word counts.
- Live warning alerts for common parsing hazards.

### 🎯 3. Target Job Description (JD) Keyword Matcher
- Paste any job posting description into the matcher.
- Instantly extracts high-frequency technical keywords and compares them against your resume.
- Shows missing keywords, match percentage, and suggestions to maximize interview callbacks.

### 💾 4. Multi-Resume Version Management
- Save and switch between unlimited resume variations (e.g. *Full Stack Architect*, *Backend Specialist*, *1-Page Compact*).
- Duplicate existing versions with 1 click to tailor your resume for specific job applications.

### 📄 5. Multi-Format High-Fidelity Export
- **Pixel-Perfect PDF**: Clean, print-exact vector PDF generation with zero watermark.
- **Microsoft Word (.docx)**: Standard editable ATS-compliant document.
- **Clean Markdown (.md)**: Developer-ready plain markdown formatted for GitHub profiles, developer documentation, or portfolio sites.
- **JSON Resume (.json)**: Full export and import compatible with the official open-source JSON Resume standard.
- **Plain Text (.txt)**: Clean plain text for quick copy-pasting into job application forms.

### 🎨 6. Developer-Centric Templates & Typography
- Clean templates optimized for technical roles (*Modern Developer*, *Minimal Engineering*, *Compact 1-Page*).
- Font pairings crafted for engineering readability, including **JetBrains Mono**, **Inter**, **Roboto**, **Merriweather**, and **Garamond**.
- Customizable accent palettes including **DK Emerald**, **Sapphire Navy**, and **Teal**.
- Configurable contact header styles: clean bullet dots, modern badges, or pipe dividers.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Library**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Document Generation**: [docx](https://docx.js.org/), [jsPDF](https://github.com/parallax/jsPDF), [html2canvas](https://html2canvas.hertzen.com/)
- **Storage**: Native Web Storage API (`localStorage`)

---

## 🚀 Quick Start (Local Development)

### 1. Clone the repository
```bash
git clone https://github.com/your-username/dk-resume-builder.git
cd dk-resume-builder
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to start building resumes.

### 4. Build for production
```bash
npm run build
npm start
```

---

## 📂 Project Structure

```text
dk-resume-builder/
├── public/
│   ├── favicon.svg          # Modern DK monogram favicon
│   ├── icon.svg             # App tab icon
│   └── logo.svg             # Vector brand logo
├── src/
│   ├── app/
│   │   ├── globals.css      # Print styles, Tailwind utilities
│   │   ├── icon.svg         # Next.js App Router favicon
│   │   ├── layout.tsx       # Root layout, metadata & headers
│   │   └── page.tsx         # Split-screen workspace container
│   ├── components/
│   │   ├── ats/             # ATS Score Audit & JD Matcher modals
│   │   ├── common/          # DkLogo and contact badges
│   │   ├── editor/          # Forms (Personal, Experience, Skills, Education)
│   │   ├── layout/          # Top Navbar & Footer
│   │   ├── modals/          # Saved Resumes, Import, Export, Templates
│   │   └── preview/         # Live Interactive Resume Preview & Templates
│   ├── config/              # Feature flags
│   ├── data/                # Action verbs database & sample resumes
│   ├── types/               # ResumeData TypeScript interfaces
│   └── utils/               # Storage, ATS Scorer, and PDF/DOCX/MD Exporters
└── package.json
```

---

## 🔒 Privacy & Security Guarantee

- **No Remote Telemetry**: DK Resume Builder makes zero network requests containing your resume information.
- **No Third-Party Trackers**: No Google Analytics, Segment, Mixpanel, Sentry user tracing, or advertising scripts are bundled.
- **Local Storage Only**: Your resume data is stored on your device via `localStorage`. Clearing your browser data or clicking delete permanently erases it.
- **Safe Imports & Exports**: Resumes are parsed entirely client-side without sending files to any cloud server.

---

## 🤝 Contributing

Contributions from the developer community are welcome!
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the **MIT License**. Free to use, modify, and distribute for personal and commercial resumes.

---

<div align="center">
  <sub>Built with ❤️ by a developer to help fellow developers land great roles.</sub>
</div>
