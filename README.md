# Dwi Drishti News (द्वि दृष्टि)

> Same news, two views: an automated, cross-lingual Indian media perspective and framing analysis platform.

Built with Next.js 15, TypeScript Strict, Tailwind CSS, `@google/genai` Gemini SDK, and Drizzle ORM.

---

## 1. Quick Start

### Prerequisites
- Node.js v20+ / v24+
- `pnpm` v9+ / v11+
- Gemini API Key (`GEMINI_API_KEY`)
- Context.dev API Key (`CONTEXT_DEV_API_KEY`)

### Setup Instructions

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Configure environment:**
   Verify your keys in `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   Ensure `GEMINI_API_KEY` and `CONTEXT_DEV_API_KEY` are provided.

3. **Run test suite & Canary audit:**
   ```bash
   pnpm test
   pnpm audit:canary
   ```

4. **Run the development server:**
   ```bash
   pnpm dev -p 8080
   ```
   Or build and run the production server:
   ```bash
   pnpm build
   pnpm start -H 127.0.0.1 -p 8080
   ```

---

## 2. Key Architecture & Features

- **Language Gate**: Full-screen Indic language selector covering 12 Indian languages with native scripts, RTL support (Urdu), and persistent cookie (`NEXT_LOCALE`).
- **Cross-Lingual Clustering Engine**: 72h incremental window clustering with Gemini `text-embedding-004` (768 dimensions), cosine distance, and LLM adjudication for borderline pairs.
- **Three-Agent Analysis Engine**:
  - **Agent A**: Statutory & Constitutional Analyst (Articles 14, 19, 21, BNS, federal statutes).
  - **Agent B**: Socio-Economic & Subaltern Analyst (caste equity, agrarian/labor impact, grassroots).
  - **Agent C**: Synthesis & Normalization Engine (emits 6 calibrated axes and consensus facts).
- **Verbatim Quotation Verification**: Programmatic verification ensuring loaded terms or framing tags exist in source texts.
- **Entity Omission Index ($O_i$)**: $O_i = 1 - |E_i \cap E_{core}| / |E_{core}|$, quantifying omission without pejorative accusation.
- **Banned-Label Linter**: Automatically filters pejorative terms like "fake news", "propaganda", "godi media", etc.
- **Perspective Prep**: UPSC/State PSC/CLAT study dossiers with constitutional statutes, balanced arguments, 5 Prelims MCQs, Mains essay outlines, and print-ready PDF export.
- **Statutory Grievance Redressal**: Section 79 IT Act automated takedown and right-of-reply form with 48h SLA acknowledgment.

---

## 3. Product Routes

- `/` - Home page (Two-views hero, bias goggles, language switch, story feed)
- `/stories/[id]` - Story cluster detail (Six-axis SVG radar, omission evidence, compare view, how we scored this)
- `/prep` - Perspective Prep exam briefs & print PDF export
- `/methodology` - Open scoring rubric, fair-dealing legal documentation
- `/takedown` - IT Act Section 79 publisher takedown & right-of-reply portal
- `/admin/ingestion` - Ingestion health, outlet registry & robots compliance
- `/admin/clusters` - Clustering review queue, confidence metrics, split/merge tools
- `/api/ingest` - Scheduled ingestion endpoint protected by `CRON_SECRET`
