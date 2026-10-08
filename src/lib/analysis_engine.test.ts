import { describe, it, expect } from "vitest";
import { MultiAgentAnalysisEngine } from "./analysis_engine";
import { ClusterSynthesisSchema } from "./analysis_schemas";

describe("MultiAgentAnalysisEngine verification and metrics", () => {
  it("verifies verbatim quotations against normalized source text", () => {
    const sourceText = `The Finance Ministry announced new income-tax slabs, stating that this provides substantial relief for middle-income taxpayers.`;

    // Exact quote
    expect(
      MultiAgentAnalysisEngine.verifyQuote("substantial relief for middle-income taxpayers", sourceText)
    ).toBe(true);

    // Quote with minor punctuation/casing variations
    expect(
      MultiAgentAnalysisEngine.verifyQuote("Substantial relief for middle-income taxpayers.", sourceText)
    ).toBe(true);

    // Hallucinated quote
    expect(
      MultiAgentAnalysisEngine.verifyQuote("massive economic windfall for the rich", sourceText)
    ).toBe(false);
  });

  it("calculates Entity Omission Index correctly", () => {
    const coreEntities = ["Finance Ministry", "Income Tax Slabs", "Section 87A", "Middle Class"];
    const articleEntities = ["Finance Ministry", "Income Tax Slabs"];

    const res = MultiAgentAnalysisEngine.calculateOmissionIndex(articleEntities, coreEntities);
    expect(res.omissionIndex).toBe(0.5);
    expect(res.missingEntities).toEqual(["Section 87A", "Middle Class"]);
  });

  it("validates cluster synthesis payload with Zod schema", () => {
    const samplePayload = {
      canonicalTitle: "Income Tax Slabs Announcement",
      consensusSummary: ["Finance Ministry announced new income tax slabs for the upcoming fiscal year."],
      keyDisputes: ["Outlets disagree on whether upper-middle earners experience net benefit."],
      consensusEntities: ["Tax Slabs", "Budget"],
      articleEvaluations: [
        {
          outletName: "The Hindu",
          headline: "Tax slabs revised in Budget",
          primaryAngle: "Impact on salaried middle class",
          scoreGovernment: 0.1,
          scoreCulture: 0.0,
          scoreFederal: 0.0,
          scoreEconomic: -0.2,
          scoreCaste: 0.0,
          scoreTenor: -0.5,
          uncertaintyScore: 0.1,
          quotes: [
            {
              quote: "tax slabs revised",
              outlet: "The Hindu",
              category: "framing",
              polarity: "neutral",
              rationale: "Factual headline",
            },
          ],
          omittedConsensusFacts: [],
        },
      ],
    };

    const parsed = ClusterSynthesisSchema.safeParse(samplePayload);
    expect(parsed.success).toBe(true);
  });
});
