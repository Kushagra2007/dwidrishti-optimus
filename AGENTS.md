# Multi-Agent Architecture: Dwi Drishti News

## Analysis Pipeline Agents
When analyzing an event cluster, three discrete server-side agent roles execute sequentially or in parallel with temperature set between 0.0 and 0.1:

### Agent A: Statutory & Constitutional Analyst
- Evaluates articles strictly against constitutional, legal, and procedural benchmarks.
- Grounds observations in specific articles of the Indian Constitution, BNS/CrPC/IPC provisions, and official executive orders.
- Extracts factual procedural milestones without taking political sides.

### Agent B: Socio-Economic & Subaltern Analyst
- Evaluates reporting through the lens of agrarian impact, labor rights, caste dynamics, subaltern welfare, and federal state autonomy.
- Pinpoints coverage neglect regarding marginalized communities and grassroots struggles.

### Agent C: Synthesis & Normalization Engine
- Reconciles evaluations from Agent A and Agent B with source texts.
- Normalizes framing scores onto the six standard Indian axes in the range `[-1.0, 1.0]`.
- Strips any emotionally loaded or pejorative words.
- Emits structured JSON adhering strictly to `ClusterAnalysisSchema`.
- Identifies consensus facts agreed upon across all outlets and isolates key framing disputes.

## Execution Constraints
- All calls use the official `@google/genai` SDK.
- Adjudication and extraction use fast models (`gemini-2.5-flash` or `gemini-3-flash-preview`).
- Synthesis and deep analysis use reasoning models (`gemini-3-pro-preview` or `gemini-2.5-pro`).
- All citations and loaded terms must be verbatim substrings in source text.
