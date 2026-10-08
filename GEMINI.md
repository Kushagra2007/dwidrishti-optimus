# Project Rules: Dwi Drishti News (द्वि दृष्टि)

## Core Principles
1. **Never Issue Verdicts**: Never use or generate pejorative labels like "fake news", "propaganda", "corrupt", "godi media", "state-controlled", or "untrustworthy". Always reject these strings programmatically in all languages.
2. **Every Claim Carries Evidence**: Every loaded term, omission, or framing tag must be backed by a verified verbatim quote from the source text.
3. **Absence is Not Guilt**: Omissions are presented as neutral differences ("Entity X appears in 4 of 5 reports, but not here"), never as accusations.
4. **Transformative Fair Dealing**: Never store or display full-text articles permanently (TTL 7 days for processing cache only). Display a maximum 50-word snippet with a canonical link to the publisher.
5. **No Mock Data in Production**: All production paths use live data or database records. Fixtures belong strictly in `/fixtures` and are explicitly tagged.
6. **API Security**: API keys (`GEMINI_API_KEY`, `CONTEXT_DEV_API_KEY`, `DATABASE_URL`) must never be leaked to client bundles or git. Validate build bundles for secret leaks.
7. **Strict Validation**: All external inputs and AI responses must pass strict Zod schema validation. Failed outputs are retried once with error feedback, never silently fabricated.
8. **Reproducibility**: Version all analyses with `analysis_version`, model ID, and prompt hash.
