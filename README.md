# Dwi Drishti News (द्वि दृष्टि न्यूज़)
> **Every Story, Both Sights — Evidence, Not Verdicts**  
> An automated, cross-lingual Indian media perspective and framing analysis platform differentiating Left, Centre, and Right framing with empirical evidence.

[![Next.js](https://img.shields.io/badge/Next.js-15.1.11-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.3-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Gemini](https://img.shields.io/badge/Gemini-3.5--Flash-4285F4?style=flat-square&logo=google)](https://ai.google.dev/)
[![Context.dev](https://img.shields.io/badge/Context.dev-Web_Scraping-purple?style=flat-square)](https://context.dev/)
[![PostgreSQL](https://img.shields.io/badge/Neon/Supabase-Serverless_Postgres-336791?style=flat-square&logo=postgresql)](https://neon.tech/)
[![License](https://img.shields.io/badge/Fair_Dealing-Section_52(1)(a)_Copyright_Act_1957-green?style=flat-square)](./src/app/methodology/page.tsx)

---

## 1. Core Motif: Left, Centre, and Right Framing Differentiation

In democratic public life, an event is never just reported—it is framed. The core motif of **Dwi Drishti News** is revealing how the exact same factual event is mediated through three distinct orientations:

```
┌─────────────────────────────────┬─────────────────────────────────┬─────────────────────────────────┐
│        LEFT (CRITICAL)          │        CENTRE (NEUTRAL)         │       RIGHT (SUPPORTIVE)        │
│    Scrutiny & Grassroots        │    Procedural & Factual         │    Executive & Governance       │
├─────────────────────────────────┼─────────────────────────────────┼─────────────────────────────────┤
│ • Focuses on accountability     │ • Emphasizes official data,     │ • Highlights administrative     │
│ • Foreground civil society,     │   statutes, and procedural      │   decisive action, delivery,    │
│   labor, and oversight gaps     │   timelines without verdicts    │   and national milestones       │
│ • Scores < 45/100 on government │ • Scores 45–65/100              │ • Scores > 65/100               │
└─────────────────────────────────┴─────────────────────────────────┴─────────────────────────────────┘
```

### Key Principles
1. **Never Uses Pejorative Labels**: Replaces moralistic accusations (*"fake news"*, *"propaganda"*, *"godi media"*) with structured, neutral metrics.
2. **Event Summary & Perspective Dossier**: Summarizes the three essential facets of every story:
   - **What happened**: The undisputed baseline fact verified across all outlets.
   - **Where the framing splits**: How Left, Centre, and Right outlets frame the priority.
   - **What is missing**: Concrete empirical facts documented by covering outlets but omitted by others.
3. **Six India-Specific Framing Axes**:
   - **Government Alignment**: Questions Government $\leftrightarrow$ Backs Government
   - **Cultural / Ideological**: Cosmopolitan / Pluralist $\leftrightarrow$ Traditionalist / Majoritarian
   - **Federal Orientation**: State Autonomy $\leftrightarrow$ Centralized Hegemony
   - **Socio-Economic Gaze**: Labor / Agrarian / Welfare-led $\leftrightarrow$ Corporate / Market-led
   - **Social Justice**: Subaltern / Caste-cognizant $\leftrightarrow$ Status-quo / Caste-blind
   - **Journalistic Tenor**: Empirical / Restrained $\leftrightarrow$ Outrage-driven / Sensational
4. **Verbatim Quotation Verification**: Loaded verbs and nouns are highlighted in green/lime (favourable) or orange/salmon (critical) with direct 50-word verbatim source snippets.

---

## 2. Technical Architecture & Ingestion Pipeline

```
                                  ┌───────────────────────────────┐
                                  │      Context.dev Web API      │
                                  │   (High-Fidelity Markdown)    │
                                  └──────────────┬────────────────┘
                                                 │
┌──────────────────────────────┐                 │                 ┌──────────────────────────────┐
│  Indian Media Outlets (EN)   │                 ▼                 │  Regional Media Outlets (HI) │
│ The Hindu, Indian Express,   ├────► [ Context Harvester ] ◄─────┤ Dainik Jagran, Amar Ujala,   │
│ NDTV, The Wire, Scroll       │                 │                 │ BBC Hindi, Navbharat Times   │
└──────────────────────────────┘                 ▼                 └──────────────────────────────┘
                                  ┌───────────────────────────────┐
                                  │  Cloud Database / Cache (DB)  │
                                  │   Neon / Supabase Serverless  │
                                  └──────────────┬────────────────┘
                                                 │
                                                 ▼
                                  ┌───────────────────────────────┐
                                  │    Gemini 3.5 Flash Engine    │
                                  │  - Left/Centre/Right Scores   │
                                  │  - 6-Axis Metric Evaluation   │
                                  │  - Semantic Response Caching  │
                                  └──────────────┬────────────────┘
                                                 │
                                                 ▼
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                    Broadsheet UI (Prototype 5)                                  │
│  - Dedicated 3-Column Story View: Left, Centre, Right Columns with Outlets & Blindspots         │
│  - Meter Bar: Real-Time Percentage Distribution of Perspectives                                │
│  - Interactive Scrollytelling Headline Comparator (Steps 1-4 with Split Slider Knob)            │
│  - 6-Axis SVG Radar Visualizer with Toggleable Outlet Polygons                                  │
│  - Live Real-Time Analysis Terminal with Streaming Logs (< 50ms Cached Response)                │
│  - Bias Goggles Keyboard Toggle ('G') for Instant Loaded Phrasing                               │
│  - Dynamic Reading Diet Tracker with Persona Discovery & Balancing Nudges                      │
│  - Media Literacy Lab with 4 Interactive Lessons & Spot-the-Bias Quiz                           │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### Ingestion: RSS Discovery + Context.dev Scraping
- **RSS Feeds as Discovery**: Lightweight RSS/Atom polling discovers incoming article URLs from 10+ Indian newsrooms.
- **Context.dev Deep Scraper**: Rather than fragile HTML scraping that trips bot blockers, we invoke Context.dev (`https://api.context.dev/v1/web/scrape`) with `{ url, formats: { markdown: true } }`. Clean markdown text is parsed, stripped of advertisements and paywall artifacts, and ingested.

---

## 3. Database Suggestions & Cloud Architecture for Vercel

### Recommended Database: Neon Serverless Postgres
For production hosting on **Vercel**, the optimal database is **Neon Serverless Postgres** (or **Supabase**):
- **Zero Cold Starts**: HTTP connection pooling via `@neondatabase/serverless` or `pg.Pool`.
- **Drizzle ORM Integration**: Schema defined in [`src/db/schema.ts`](./src/db/schema.ts) and configured via [`src/db/index.ts`](./src/db/index.ts).
- **Graceful Fallback**: If `DATABASE_URL` is not set, the app seamlessly runs using the in-memory context harvester. When `DATABASE_URL` is supplied in Vercel environment variables, database caching activates automatically!

### Making the Analysis Engine Blazing Fast (< 50ms)
1. **Semantic Topic Caching (`topic_analyses_cache`)**:
   When any user analyzes a topic (e.g., *"air quality"*, *"Starlink"*, *"GST dues"*), the server first queries the database cache:
   ```sql
   SELECT * FROM topic_analyses_cache WHERE normalized_topic = 'air quality' LIMIT 1;
   ```
   If cached, the complete 3-perspective breakdown and 6-axis scores return in **< 50ms** without touching the AI API!
2. **Resilient Multi-Model Fallback Cascade**:
   When Google Gemini encounters peak traffic demand (HTTP 503) or rate limits (HTTP 429), the engine automatically executes an in-flight failover cascade:
   * **Primary Tier**: `gemini-3.5-flash`
   * **Secondary Failover**: `gemini-3.8-flash` (triggered automatically with a 600ms backoff)
   * **Tertiary Failover**: `gemini-3-flash-preview`
   * **Emergency Tier**: Semantic matching against the offline 20+ current reports knowledge base.
   This guarantees that the user never encounters a blank crash or unhandled model error during peak usage hours.
3. **Pre-computation Worker**:
   Scheduled cron runs (`/api/ingest`) cluster fresh articles and precompute Left-Centre-Right ratings ahead of user visits.

---

## 4. Local Hosting Instructions

### Prerequisites
- Node.js v20.x or v22.x+
- `pnpm` v9.x or v11.x+
- API Keys in `.env.local`:
  ```env
  GEMINI_API_KEY="your-gemini-api-key"
  GEMINI_MODEL_FAST="gemini-3.5-flash"
  GEMINI_MODEL_REASONING="gemini-3.5-flash"
  GEMINI_EMBEDDING_MODEL="gemini-embedding-001"
  CONTEXT_DEV_API_KEY="your-context-dev-key"

  # Optional: Cloud Postgres (Neon / Supabase)
  DATABASE_URL="postgres://user:password@ep-xyz.neon.tech/dwidrishti?sslmode=require"
  ```

### Run Locally (Production Mode)
```powershell
# 1. Build optimized bundle
pnpm build

# 2. Host locally on port 8080
pnpm start -H 127.0.0.1 -p 8080
```
Open your browser and visit: **`http://localhost:8080`** (or `http://127.0.0.1:8080`).

### Run in Development Mode
```powershell
pnpm dev -p 8080
```

---

## 5. UI Features & Keyboard Shortcuts

| Feature | Action / Shortcut | Description |
| :--- | :--- | :--- |
| **Bias Goggles** | Press <kbd>G</kbd> or click 👓 | Highlights loaded phrasing in real time (Lime = Favourable, Orange = Critical). |
| **Read Brief →** | Click on story card | Opens the dedicated 3-column Left, Centre, and Right story view with the meter bar and event summary. |
| **Compare** | Click on card / button | Opens the 6-Axis SVG Radar visualizer with toggleable outlet layers. |
| **Headline Slider** | Drag knob `↔` or scroll | Compares Establishment vs. Scrutiny front-page framing across 4 steps. |
| **Reading Diet** | Click *"Read at source"* | Calculates your Left, Centre, and Right consumption balance and discovers your reader persona. |
| **Media Literacy Lab** | Click *Learn* in header | 4 lessons on Framing, Omission, Loaded words, and Source mix + 5-question *"Spot the bias"* quiz. |
| **Language Switch** | Click *हिं / EN* | Toggles between English and Hindi broadsheet headlines and tags. |
| **Theme Switch** | Click *◐* | Toggles between Warm Stone broadsheet (`#f2ede1`) and Dark Broadsheet (`#1b1a17`). |

---

## 6. Testing & Quality Assurance

```bash
# Run Vitest test suite (all 14 tests passing)
pnpm test

# Run TypeScript static analysis
pnpm typecheck
```

---

## 7. License & Compliance
Released under the **Fair Dealing Provisions** of the **Indian Copyright Act, 1957 (Section 52(1)(a))** for non-commercial educational, analytical, and media literacy research.
