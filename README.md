# GRANTLY - The Scholarship Gazette

> A scholarship discovery and management platform for Indian students, built for **THE OUTPOST 2026 (Frontend Arena)**.

- **Live Application**: [https://the-outpost-2026.vercel.app](https://the-outpost-2026.vercel.app)
- **GitHub Repository**: [https://github.com/Anii206/the-outpost-2026](https://github.com/Anii206/the-outpost-2026)

---

## The Problem It Solves

Finding scholarships in India is notoriously difficult: criteria, deadlines, income ceilings, and document requirements are scattered across dozens of central portals (NSP, AICTE, UGC), state welfare boards, and corporate CSR websites. Students frequently miss opportunities due to complex eligibility rules, buried notifications, and lost deadlines.

**GRANTLY** unifies the entire scholarship journey into a single, cohesive broadside-style interface—from discovering relevant opportunities and verifying eligibility to organizing documents and tracking applications across every stage.

---

## Features

- **Discover & Search**: Real-time keyword search, single-select minimum amount filter chips, collapsible facet sections (Academic Level, Scheme Type, State Domicile), multi-parameter sorting, and a `Ctrl+K` / `Cmd+K` Command Palette for rapid navigation.
- **24 Curated Indian Schemes**: Comprehensive catalog spanning central government schemes (NSP CSSS, PMSS, AICTE Pragati), state initiatives, and premier foundation programs (Reliance Foundation, Tata Trusts, HDFC Parivartan, ONGC, Siemens, etc.).
- **Profile Wizard & Rule-Based Matching Engine**: Multi-step onboarding to capture education level, academic percentage, category (General, OBC, SC, ST, EWS), annual income bracket, gender, state domicile, and special criteria. Evaluates scholarships against strict rules with transparent **Met**, **Not met**, and **Review** criteria breakdowns.
- **Eligibility Finder**: Dedicated workflow allowing students to run instant criteria checks against all available schemes.
- **Scholarship Detail Pages**: Live countdown timer to application deadlines, interactive document checklists, step-by-step application blueprints, official portal links, and one-click calendar export (`.ics`).
- **Application Tracker**: Kanban-style workflow board supporting drag-and-drop across pipeline stages (*Saved*, *Applying*, *Applied*, *Under Review*, *Awarded*, *Rejected*).
- **Analytics Dashboard**: High-level overview of application progress, upcoming deadline alerts, potential funding metrics, monthly distribution schedules, and pipeline charts.
- **Scheme Comparison**: Side-by-side matrix comparing up to 3 scholarships across funding, eligibility requirements, target categories, and mandatory documentation.
- **Share Shortlist**: One-click export summarizing saved and tracked opportunities sorted by closest deadline, supporting the mobile Web Share API (`navigator.share`) with automatic clipboard fallback.
- **Theme & Accessibility**: Newspaper-inspired editorial aesthetics featuring Fraunces and Instrument Serif typography, persistent Light and Dark themes, smooth Lenis scrolling, responsive design, and accessible keyboard-navigable controls.

---

## Tech Stack

- **Framework & Language**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite 8](https://vite.dev/)
- **Routing**: [React Router v7](https://reactrouter.com/) (`react-router-dom`)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) (`@tailwindcss/vite`) with custom CSS theme variables
- **Typography**: [Fontsource](https://fontsource.org/) (`@fontsource/instrument-serif`, `@fontsource/fraunces`, `@fontsource/dm-sans`)
- **Animations & Effects**: [Framer Motion](https://www.framer.com/motion/), [Lenis](https://github.com/darkroomengineering/lenis) (smooth scroll), [Canvas Confetti](https://github.com/catdad/canvas-confetti)
- **UI & Icons**: [Phosphor Icons](https://phosphoricons.com/) (`@phosphor-icons/react`), [CMDK](https://cmdk.paco.me/) command palette, [Number Flow](https://number-flow.barvian.me/) (`@number-flow/react`)
- **Data Visualization**: [Recharts](https://recharts.org/)
- **Feedback & Notifications**: [Sonner](https://sonner.emilkowal.ski/) toast management

---

## How to Run Locally

### Prerequisites
- Node.js (v18 or higher recommended)
- npm, pnpm, or yarn

### Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Anii206/the-outpost-2026.git
   cd the-outpost-2026
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

4. **Build for production**:
   ```bash
   npm run build
   ```

---

## Notes & Architecture

- **Client-Side Architecture**: GRANTLY operates entirely on the client side with no dedicated backend server. Sample data in `src/data/scholarships.ts` is accessed through an asynchronous service layer in `src/services/api.ts`.
- **Local Persistence**: User profile details, saved shortlist items, and tracker states persist locally in browser `localStorage`.
- **Application Portal Disclaimer**: GRANTLY does not submit scholarship applications on behalf of students. All links redirect to official government and organization portals.
- **Demonstration Notice**: Scholarship details, amounts, and dates are curated samples for demonstration; applicants should always confirm official requirements on the designated portal.
- **Development**: Built with AI-assisted pair programming ([Google Antigravity](https://deepmind.google/)), reviewed, architected, and tested by the author.
