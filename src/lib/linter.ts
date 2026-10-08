/**
 * Banned-label linter enforcing ethical and non-pejorative standards:
 * No "fake news", "propaganda", "godi media", etc.
 */

export const BANNED_LABELS: string[] = [
  // English
  "fake news",
  "propaganda",
  "propaganda outlet",
  "corrupt",
  "state-controlled",
  "untrustworthy",
  "godi media",
  "lapdog",
  "anti-national",
  "presstitute",
  "tukde tukde",
  "yellow journalism",
  "dalal",
  "paid media",
  // Hindi
  "फेक न्यूज़",
  "झूठी खबर",
  "प्रोपेगैंडा",
  "गोदी मीडिया",
  "दलाल",
  "भ्रष्ट",
  "देशद्रोही",
];

export interface LintResult {
  isValid: boolean;
  violations: string[];
}

export function lintAIOutput(content: string | Record<string, any>): LintResult {
  const textToScan = typeof content === "string" ? content : JSON.stringify(content);
  const normalized = textToScan.toLowerCase();
  const violations: string[] = [];

  for (const banned of BANNED_LABELS) {
    if (normalized.includes(banned.toLowerCase())) {
      violations.push(banned);
    }
  }

  return {
    isValid: violations.length === 0,
    violations,
  };
}
