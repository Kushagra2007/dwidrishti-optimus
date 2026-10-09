# Dwi Drishti News (द्वि दृष्टि न्यूज़)
> **Every Story, Both Sights — Evidence, Not Verdicts**  
> An automated, cross-lingual Indian media perspective and framing analysis platform.

[![Next.js](https://img.shields.io/badge/Next.js-15.1.7-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.3-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Gemini](https://img.shields.io/badge/Gemini-3.5--Flash-4285F4?style=flat-square&logo=google)](https://ai.google.dev/)
[![Context.dev](https://img.shields.io/badge/Context.dev-Web_Scraping-purple?style=flat-square)](https://context.dev/)
[![License](https://img.shields.io/badge/Fair_Dealing-Section_52(1)(a)_Copyright_Act_1957-green?style=flat-square)](./src/app/methodology/page.tsx)

---

## Latest Update: API Resilience, Hindi Branding, and Environment Safety

This update improves the live analysis path and the Hindi experience, and makes local configuration safer to handle.

### Gemini response parsing

`POST /api/analyze` now extracts the first complete top-level JSON object from the model response instead of passing the entire response directly to `JSON.parse`. The extractor tracks nested objects, quoted strings, and escaped characters, so braces inside string values do not end parsing early. It rejects responses with no object, malformed JSON, or an incomplete object with a specific error; successful output continues through the existing banned-term linter before it is returned. The API response shape and its `gemini-3.5-flash` model selection are unchanged.

### Hindi interface details

When Hindi is selected, the masthead now uses Hindi lettering and the lead headline reads "एक ख़बर। दो नज़रिए।? The animated wordmark also switches to the Hindi name. Its animation iterates Unicode grapheme clusters with `Intl.Segmenter`, preserving composed Hindi characters instead of splitting them into separate code points. English retains its existing name and headline.

### Local environment protection

The root `.env` file is now ignored by Git, alongside the existing local environment files. `.env.example` uses clear placeholders for the Gemini key and cron secret. Copy the example to `.env.local` and replace placeholders locally; never commit real credentials.

### Files covered by this update

- `src/app/api/analyze/route.ts`: robust top-level JSON extraction and clearer invalid-response errors.
- `src/app/page.tsx`: Hindi masthead, localized lead headline, and grapheme-aware animated wordmark.
- `.gitignore`: ignore root `.env` files.
- `.env.example`: provide safer, explicit credential placeholders.

## 1. Project Overview & Philosophy

Modern democratic discourse in India is fractured across linguistic silos, ideological divides, and algorithmic echo chambers:
- Over **58%** of Indians consume news via YouTube, and **56%** via WhatsApp.
- Overall public trust in news institutions sits at **38–39%** (Reuters Institute / Lokniti-CSDS).
- Conventional "fact-checking" platforms often issue moralistic verdicts like *"fake news"* or *"propaganda"*, which alienate readers and trigger defensive partisan skepticism.

**Dwi Drishti News (द्वि दृष्टि)** replaces moral condemnation with **structural media transparency**:
1. **Never Uses Banned Labels**: Strictly prohibits pejorative terms such as *"fake news"*, *"propaganda"*, *"godi media"*, or *"corrupt"*.
2. **Six India-Specific Framing Axes**: Evaluates coverage along axes tailored to the subcontinent's constitutional and cultural reality:
   - **Government Alignment**: Questions Government vs. Backs Government
   - **Cultural / Ideological**: Cosmopolitan / Pluralist vs. Traditionalist / Majoritarian
   - **Federal Orientation**: State Autonomy vs. Centralized Hegemony
   - **Socio-Economic Gaze**: Labor / Agrarian / Welfare-led vs. Corporate / Market-led
   - **Social Justice**: Subaltern / Caste-cognizant vs. Status-quo / Caste-blind
   - **Journalistic Tenor**: Empirical / Restrained vs. Outrage-driven / Sensational
3. **Verbatim Evidence**: Verifies loaded nouns and verbs against actual raw quotes; displays the exact 50-word verbatim snippets.
4. **Entity Omission Index ($O_i$)**: Programmatically quantifies facts that one side covers while the other omits, proving selective omission with proof.
5. **Perspective Prep**: Converts media divergence into balanced, constitutional analysis dossiers and practice questions for civil service aspirants (UPSC, State PSC, CLAT).
6. **Newspaper Broadsheet Aesthetic**: Editorial design inspired by classical print broadsheets featuring serif typography, scrollytelling headline comparisons, interactive 6-axis SVG radar charts, and keyboard-activated **Bias Goggles**.

---

## 2. Architecture & Technical Pipeline

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
                                  │ Cross-Lingual Clustering &    │
                                  │      72h Temporal Window      │
                                  └──────────────┬────────────────┘
                                                 │
                                                 ▼
                                  ┌───────────────────────────────┐
                                  │    Gemini 3.5 Flash Engine    │
                                  │  - 6-Axis Metric Evaluation   │
                                  │  - Omission Fact Extraction   │
                                  │  - Civil Service Exam Brief   │
                                  └──────────────┬────────────────┘
                                                 │
                                                 ▼
                                  ┌───────────────────────────────┐
                                  │   Anti-Pejorative AI Linter   │
                                  │ (Rejects Banned Slander Words)│
                                  └──────────────┬────────────────┘
                                                 │
                                                 ▼
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                    Broadsheet Frontend                                          │
│  - Interactive Scrollytelling Comparator (Step 1-4 with Draggable Knob)                         │
│  - 6-Axis SVG Radar Visualizer with Toggleable Outlet Polygons                                  │
│  - Real-Time Gemini Terminal Pipeline with Streaming Feedback                                   │
│  - Bias Goggles Keyboard Toggle ('G') for Instant Loaded Phrasing                               │
│  - Dynamic Reading Diet Tracker with Persona Discovery & Balancing Nudges                      │
│  - Media Literacy Lab with 4 Interactive Lessons & Spot-the-Bias Quiz                           │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### Ingestion via Context.dev
Rather than relying solely on raw RSS feeds (which suffer from aggressive anti-scraping firewalls, incomplete RSS CDATA, and CORS restrictions), Dwi Drishti uses **Context.dev**:
- **Endpoint**: `https://api.context.dev/v1/web/scrape`
- **Payload**:
  ```json
  {
    "url": "https://indianexpress.com/section/india/",
    "formats": { "markdown": true }
  }
  ```
- **Result**: High-fidelity clean markdown parsed directly from `response.markdown.data`, stripped of advertisements, tracking scripts, and paywall bloat.

### Multi-Agent Analysis with Gemini 3.5 Flash
Calls to the Gemini API utilize `@google/genai` targeting the `gemini-3.5-flash` model (`temperature: 0.1` for maximum empirical reproducibility):
1. **Consensus Summary**: Pinpoints core undisputed facts verified across all covering outlets.
2. **Divergence Summary**: Contrasts how establishment and scrutiny outlets choose divergent headlines, framing verbs, and photo captions.
3. **Six-Axis Quantification**: Emits normalized scores ($0$ to $100$) across the 6 Indian fault lines.
4. **Selective Omission**: Identifies specific empirical facts documented by one camp but absent from the opposing camp.
5. **Perspective Prep Dossier**: Produces a 150-word balanced practice question for UPSC General Studies Papers (GS-II Governance / GS-IV Ethics).

### Fair Dealing Legal Compliance
Operating under **Section 52(1)(a) of the Indian Copyright Act, 1957**:
- Excerpts are strictly limited to the headline and a maximum 50-word verbatim snippet.
- Direct canonical links to the original publisher are provided for every single article ("Read at source").
- Full-text replication and ad-monetization are strictly prohibited.
- Statutory takedown mechanism provided in `/takedown` in compliance with **Section 79 of the Information Technology Act, 2000**.

---

## 3. Installation & Local Development

### Prerequisites
- **Node.js**: v20.x or v22.x+
- **pnpm**: v9.x or v10.x+
- **Google Gemini API Key**: [Google AI Studio](https://aistudio.google.com/)
- **Context.dev API Key**: [Context.dev](https://context.dev/)

### Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ayush00028/dwidrishti-optimus.git
   cd dwidrishti-optimus
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Configure Environment Variables:**
   Create `.env.local` in the project root:
   ```env
   # Google Gemini API
   GEMINI_API_KEY="your-gemini-api-key"
   GEMINI_MODEL_FAST="gemini-3.5-flash"
   GEMINI_MODEL_REASONING="gemini-3.5-flash"
   GEMINI_EMBEDDING_MODEL="gemini-embedding-001"

   # Context.dev Web Scraping API
   CONTEXT_DEV_API_KEY="your-context-dev-api-key"

   # Database (Optional for persistent Postgres / Neon)
   DATABASE_URL="postgres://user:password@localhost:5432/dwidrishti"

   # Automation Webhook
   CRON_SECRET="your-secure-cron-secret"
   ```

4. **Run Verification & Unit Tests:**
   ```bash
   pnpm test
   pnpm typecheck
   ```
   *All 14 Vitest unit tests covering snippet word-limits, linter exclusions, and feed parsing should pass.*

5. **Start Development Server:**
   ```bash
   pnpm dev -p 8080
   ```
   *Note: On Windows systems, ports 3000/3005 may occasionally encounter OS socket restrictions (`EACCES`). We recommend port `8080`.*

6. **Open in Browser:**
   Navigate to `http://localhost:8080` to experience the broadsheet interface.

---

## 4. Production Build & Running

To build and run the optimized production bundle:

```bash
# 1. Compile the production bundle
pnpm build

# 2. Launch production server on port 8080
pnpm start -H 127.0.0.1 -p 8080
```

---

## 5. Deployment & Hosting Guide

### Option A: Vercel (Recommended)
1. Push your repository to GitHub / GitLab.
2. Import the project into [Vercel](https://vercel.com/).
3. Set the Framework Preset to **Next.js**.
4. In **Project Settings → Environment Variables**, add:
   - `GEMINI_API_KEY`
   - `CONTEXT_DEV_API_KEY`
   - `CRON_SECRET`
5. Click **Deploy**. Vercel will handle serverless SSR and edge routes automatically.

### Option B: Docker Container

Create a `Dockerfile` in the root directory:

```dockerfile
# Stage 1: Dependencies
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN pnpm install --frozen-lockfile

# Stage 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN pnpm build

# Stage 3: Runner
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nextjs
EXPOSE 8080
ENV PORT=8080
ENV HOSTNAME="0.0.0.0"

CMD ["node", ".next/standalone/server.js"]
```

Build and run:
```bash
docker build -t dwi-drishti:latest .
docker run -p 8080:8080 \
  -e GEMINI_API_KEY="your-key" \
  -e CONTEXT_DEV_API_KEY="your-key" \
  dwi-drishti:latest
```

### Option C: Google Cloud Run
1. Build the container with Google Cloud Build:
   ```bash
   gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/dwi-drishti
   ```
2. Deploy to Cloud Run:
   ```bash
   gcloud run deploy dwi-drishti \
     --image gcr.io/YOUR_PROJECT_ID/dwi-drishti \
     --platform managed \
     --region asia-south1 \
     --allow-unauthenticated \
     --set-env-vars GEMINI_API_KEY="your-key",CONTEXT_DEV_API_KEY="your-key"
   ```

---

## 6. Real-Time API Endpoints

### 1. `GET /api/stories`
Fetches all currently clustered news stories.
- **Query Parameters**:
  - `q` *(optional)*: Search query string filtering across headlines, tags, and outlets.
- **Example Response**:
  ```json
  {
    "clusters": [
      {
        "id": "clu-01",
        "tag": "Economy",
        "canonicalTitle": "Starlink Licensing Standoff: Centre Denies Bias as Elon Musk Claims 'Oligarchs' Block Entry",
        "canonicalTitleHi": "स्टारलिंक लाइसेंसिंग विवाद: मस्क के ओलिगार्क आरोप पर केंद्र का पक्षपात से इनकार",
        "leadFact": "Union Ministry of Communications addresses allegations...",
        "divergenceSummary": "Establishment framing highlights level-playing field...",
        "omissionEvidence": "Security clearance timeline comparison with Jio Satellite",
        "omittedOutlets": ["Times of India"],
        "articles": [...]
      }
    ],
    "total": 20
  }
  ```

### 2. `POST /api/analyze`
Executes real-time multi-agent analysis on any topic or event using `gemini-3.5-flash`.
- **Request Body**:
  ```json
  {
    "topic": "Delhi air pollution GRAP-IV curbs",
    "language": "en"
  }
  ```
- **Example Response**:
  ```json
  {
    "success": true,
    "modelUsed": "gemini-3.5-flash",
    "analysis": {
      "topic": "Delhi air pollution GRAP-IV curbs",
      "canonicalTitle": "Policy vs. Breath: The Framing of Delhi's AQI Emergency and GRAP-IV Curbs",
      "consensusSummary": "Severe air quality triggers emergency vehicular and construction restrictions under GRAP Stage IV.",
      "divergenceSummary": "Establishment outlets highlight administrative enforcement and crackdowns; scrutiny outlets focus on perennial delays and unmitigated public health risks.",
      "omissionEvidence": "Comparative vehicular emission inventory data",
      "omittedOutlets": ["Dainik Jagran"],
      "outlets": [
        {
          "name": "The Hindu",
          "scoreGov": 38,
          "axes": { "gov": 38, "cul": 50, "fed": 45, "eco": 40, "cas": 30, "ten": 25 },
          "headline": "Curbs kick in as AQI crosses severe threshold; emergency action delayed"
        }
      ],
      "examBrief": {
        "question": "Critically analyze the efficacy of reactive emergency measures under GRAP in combating urban atmospheric pollution. (150 words)",
        "framework": ["Air Quality Management Commission Act 2021", "Right to Clean Environment under Article 21"]
      }
    }
  }
  ```

---

## 7. Broadsheet Feature Directory

| Feature | Keyboard / UI Trigger | Description |
| :--- | :--- | :--- |
| **Bias Goggles** | Press <kbd>G</kbd> or click 👓 button | Highlights loaded adjectives and verbs across headlines (Green/Lime = Favourable, Orange/Salmon = Critical). |
| **Headline Scrollytelling** | Scroll or drag split slider knob | 4-step comparative broadsheet split revealing how an event is framed from establishment vs. scrutiny angles. |
| **6-Axis SVG Radar** | Click any story card | Interactive multi-polygon radar chart visualizing an outlet's positioning across the 6 Indian axes. |
| **Reading Diet Tracker** | Click *"Read at source"* | Dynamically calculates your news consumption balance (Critical vs. Neutral vs. Supportive) and discovers your reader persona. |
| **Media Literacy Lab** | Click *Learn* in header | 4 interactive lessons on Framing, Omission, Loaded words, and Source mix, plus a dynamic 5-question *"Spot the bias"* quiz. |
| **Language Switcher** | Click *हिं / EN* | Toggles between English and Hindi broadsheet headlines and tags. |
| **Theme Toggle** | Click *◐* | Toggles between Warm Stone broadsheet (`#f2ede1`) and Dark Broadsheet (`#1b1a17`). |
| **Perspective Prep** | Visit `/prep` or click in story modal | UPSC Civil Service GS-II & GS-IV study briefs with 5 Prelims MCQs and Mains answer structure. |

---

## 8. Testing & Quality Assurance

```bash
# Run Vitest test suite
pnpm test

# Run TypeScript static analysis
pnpm typecheck

# Run production build validation
pnpm build
```

The test suite validates:
- **`snippet.ts`**: Verifies strict 50-word cap and absence of ellipsis truncation flaws.
- **`linter.ts`**: Verifies that 100% of banned pejorative phrases are detected and intercepted before UI rendering.
- **`clustering_engine.ts`**: Verifies cosine distance clustering and temporal 72h window grouping.
- **`feed_poller.ts`**: Verifies RSS and Context.dev fallback parsing logic.

---

## 9. Contributors & Licensing

Developed by **Team Optimus**.  
Released under the **Fair Dealing Provisions** of the **Indian Copyright Act, 1957 (Section 52(1)(a))** for non-commercial educational, analytical, and media literacy research.
