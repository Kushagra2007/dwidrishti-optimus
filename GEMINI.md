# Project Rules: Dwi Drishti News (द्वि दृष्टि)

## Core Principles
1. **Never Issue Verdicts**: Never use or generate pejorative labels like "fake news", "propaganda", "corrupt", "godi media", "state-controlled", or "untrustworthy". Always reject these strings programmatically in all languages via `lintAIOutput`.
2. **Every Claim Carries Evidence**: Every loaded term, omission, or framing tag must be backed by a verified verbatim quote from the source text.
3. **Absence is Not Guilt**: Omissions are presented as neutral empirical differences ("Entity X appears in 4 of 5 reports, but not here"), never as accusations.
4. **Transformative Fair Dealing**: Never store or display full-text articles permanently (TTL 7 days for processing cache only). Display a maximum 50-word snippet with a direct canonical link to the publisher ("Read at source"). Complies strictly with Section 52(1)(a) of the Indian Copyright Act, 1957.
5. **No Mock Data in Production**: All production paths use live Context.dev web scraper, RSS discovery feeds, or database records. Curated clusters are strictly based on verified Indian news events.
6. **API Security**: API keys (`GEMINI_API_KEY`, `CONTEXT_DEV_API_KEY`, `DATABASE_URL`) must never be leaked to client bundles or git. Root `.env` and `.env.local` files must remain strictly ignored.
7. **Strict Validation**: All external inputs and AI responses must pass strict JSON extraction (`parseJsonObject`) and schema validation. Failed outputs are retried via the model cascade, never silently fabricated.
8. **Reproducibility**: Version all analyses with `analysis_version`, model ID, and prompt hash.
9. **Multi-Model Cascade Resilience**: When models encounter peak demand (HTTP 503) or rate limits (HTTP 429), automatically fail over across the verified model cascade (`gemini-3.5-flash` $\to$ `gemini-3.8-flash` $\to$ `gemini-3-flash-preview` $\to$ offline knowledge-base). Zero crashes allowed in production.
