import React from "react";

export const dynamic = "force-dynamic";

export default function MethodologyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8 border-b border-line pb-4">
        <div>
          <h1 className="text-3xl font-extrabold font-display">Methodology & Scoring Rubric</h1>
          <p className="text-sm text-mut mt-1">
            How Dwi Drishti News measures framing, detects factual omissions, and calculates the six India-specific axes.
          </p>
        </div>
        <a href="/" className="px-4 py-1.5 rounded-full text-xs font-bold border border-fg hover:bg-volt/30">
          ← Home
        </a>
      </div>

      <div className="space-y-8 text-xs sm:text-sm leading-relaxed text-fg">
        <section className="p-6 rounded-3xl bg-card border border-line">
          <h2 className="text-lg font-bold font-display mb-3">1. Philosophy: Evidence, Not Verdicts</h2>
          <p className="text-mut mb-2">
            Unlike Western aggregators that reduce politics to a single Left-Right spectrum, or fact-checkers that issue pejorative verdicts such as &ldquo;fake news&rdquo; or &ldquo;propaganda&rdquo;, Dwi Drishti News displays verifiable evidence.
          </p>
          <p className="text-mut">
            Every score is an algorithmic estimate calibrated against source text. If our model notes that an outlet used a loaded adjective or omitted a consensus fact, it provides a verbatim quote and an exact mathematical omission ratio.
          </p>
        </section>

        <section className="p-6 rounded-3xl bg-card border border-line">
          <h2 className="text-lg font-bold font-display mb-3">2. The Six India-Specific Framing Axes</h2>
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-bg border border-line">
              <b>1. Government Alignment [-1.0 to +1.0]:</b> Opposition scrutiny / Hyper-critical vs. Official establishment amplification.
            </div>
            <div className="p-3 rounded-xl bg-bg border border-line">
              <b>2. Ideological & Cultural Framing [-1.0 to +1.0]:</b> Constitutional secularism & pluralism vs. Majoritarian cultural nationalism.
            </div>
            <div className="p-3 rounded-xl bg-bg border border-line">
              <b>3. Federal Orientation [-1.0 to +1.0]:</b> Regional state autonomy vs. New Delhi centralism.
            </div>
            <div className="p-3 rounded-xl bg-bg border border-line">
              <b>4. Socio-Economic Gaze [-1.0 to +1.0]:</b> Agrarian & labor welfare vs. Corporate & conglomerate alignment.
            </div>
            <div className="p-3 rounded-xl bg-bg border border-line">
              <b>5. Social Justice & Caste [-1.0 to +1.0]:</b> Subaltern representation & affirmative action vs. Caste-blind hegemony.
            </div>
            <div className="p-3 rounded-xl bg-bg border border-line">
              <b>6. Journalistic Tenor [-1.0 to +1.0]:</b> Empirical measured prose vs. Sensationalist prime-time outrage.
            </div>
          </div>
        </section>

        <section className="p-6 rounded-3xl bg-card border border-line">
          <h2 className="text-lg font-bold font-display mb-3">3. Entity Omission Index (EOI)</h2>
          <p className="text-mut mb-2">
            Calculated as: <span className="font-mono text-fg font-bold">O_i = 1 - |E_i ∩ E_core| / |E_core|</span>
          </p>
          <p className="text-mut">
            Where E_core represents entities and facts confirmed in at least 60% of all reporting outlets in that cluster. Absence is strictly reported as a neutral numerical difference, never as an accusation.
          </p>
        </section>

        <section className="p-6 rounded-3xl bg-card border border-line">
          <h2 className="text-lg font-bold font-display mb-3">4. Legal Protections & Safe Harbor</h2>
          <p className="text-mut mb-2">
            • <b>Fair Dealing:</b> Complies with Section 52(1)(a)(i) of the Indian Copyright Act, 1957. Article extracts are hard-capped at 50 words and full texts are stored transiently (7 days TTL) solely for linguistic research (*ANI Media v. OpenAI, Delhi High Court 2026*).
          </p>
          <p className="text-mut">
            • <b>IT Act Section 79:</b> Operates as an intermediary with an automated publisher takedown and right-of-reply grievance mechanism with a statutory 48-hour SLA.
          </p>
        </section>
      </div>
    </div>
  );
}
