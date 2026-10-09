# Multi-Agent Architecture: Dwi Drishti News

## Analysis Pipeline Agents
When analyzing an event cluster, three discrete server-side agent roles execute sequentially or in parallel with temperature set between 0.0 and 0.1:

### Agent A: Statutory & Constitutional Analyst (Executive & Institutional Gaze)
- Evaluates articles strictly against constitutional, legal, and procedural benchmarks.
- Grounds observations in specific articles of the Indian Constitution, statutory provisions (BNS/CrPC/IPC), and official executive orders.
- Extracts factual procedural milestones without taking partisan sides.
- Informs the **Right (Supportive / Executive)** and **Centre (Neutral / Procedural)** framing metrics.

### Agent B: Socio-Economic & Subaltern Analyst (Scrutiny & Grassroots Gaze)
- Evaluates reporting through the lens of agrarian impact, labor rights, caste dynamics, subaltern welfare, and federal state autonomy.
- Pinpoints coverage neglect regarding marginalized communities and grassroots struggles.
- Informs the **Left (Critical / Scrutiny)** framing metrics.

### Agent C: Synthesis & Normalization Engine
- Reconciles evaluations from Agent A and Agent B with raw source texts.
- Normalizes framing scores onto the six standard Indian axes in the range `[0, 100]`:
  1. Government Alignment (Questions govt $\leftrightarrow$ Backs govt)
  2. Cultural / Ideological (Cosmopolitan $\leftrightarrow$ Traditionalist)
  3. Federal Orientation (State-first $\leftrightarrow$ Centre-first)
  4. Socio-Economic Gaze (Welfare-led $\leftrightarrow$ Market-led)
  5. Social Justice (Subaltern $\leftrightarrow$ Caste-blind)
  6. Journalistic Tenor (Neutral $\leftrightarrow$ Outrage-driven)
- Employs strict anti-pejorative linter to eliminate emotionally loaded insults (*"fake news"*, *"propaganda"*, *"godi media"*).
- Emits structured JSON adhering strictly to analytical schemas.
- Produces the 3-perspective framing summaries:
  - `leftFraming`: Accountability, institutional gaps, grassroots impact.
  - `centreFraming`: Procedural overview, statistical records, data benchmarks.
  - `rightFraming`: Administrative compliance, governance delivery, developmental impact.

## Execution Constraints & Model Resilience
- All calls use the official `@google/genai` SDK with strict JSON schema outputs.
- **Resilient Model Cascade**:
  - Primary: `gemini-3.5-flash`
  - Failover Tier 1: `gemini-3.8-flash` (triggered on 503 high demand or 429 quota exhaustion)
  - Failover Tier 2: `gemini-3-flash-preview`
  - Emergency Tier 3: Curated offline knowledge-base matching
- All citations and loaded terms must be verbatim substrings in source text.
- Responses are cached in the cloud database (`topic_analyses_cache`) to guarantee sub-50ms repeat inference.
