import { describe, it, expect } from "vitest";
import { truncateTo50Words, countWords } from "./snippet";
import { lintAIOutput } from "./linter";

describe("Snippet 50-word hard cap enforcement", () => {
  it("leaves texts with under 50 words untouched", () => {
    const text = "A Budget announcement changes the income-tax slabs across the nation.";
    expect(truncateTo50Words(text)).toBe(text);
    expect(countWords(truncateTo50Words(text))).toBe(10);
  });

  it("truncates texts exceeding 50 words to exactly 50 words with an ellipsis", () => {
    const longText = Array.from({ length: 80 }, (_, i) => `word${i + 1}`).join(" ");
    const truncated = truncateTo50Words(longText);
    const words = truncated.replace("…", "").trim().split(" ");
    expect(words.length).toBe(50);
    expect(truncated.endsWith("…")).toBe(true);
  });
});

describe("Banned-label linter", () => {
  it("passes neutral and objective analytical outputs", () => {
    const cleanOutput = {
      scoreGovernment: 0.45,
      framing: "The outlet foregrounds executive revenue considerations over opposition critiques.",
    };
    const res = lintAIOutput(cleanOutput);
    expect(res.isValid).toBe(true);
    expect(res.violations).toHaveLength(0);
  });

  it("detects and flags banned pejorative labels like 'godi media' and 'fake news'", () => {
    const badOutput = {
      framing: "This report acts like godi media and spreads fake news on the scheme.",
    };
    const res = lintAIOutput(badOutput);
    expect(res.isValid).toBe(false);
    expect(res.violations).toContain("godi media");
    expect(res.violations).toContain("fake news");
  });

  it("detects banned Hindi labels like 'गोदी मीडिया'", () => {
    const hindiBad = "यह चैनल गोदी मीडिया की तरह काम कर रहा है।";
    const res = lintAIOutput(hindiBad);
    expect(res.isValid).toBe(false);
    expect(res.violations).toContain("गोदी मीडिया");
  });
});
