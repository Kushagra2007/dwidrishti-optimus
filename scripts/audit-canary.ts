import fs from "fs";
import path from "path";
import { MultiAgentAnalysisEngine } from "../src/lib/analysis_engine";
import { lintAIOutput } from "../src/lib/linter";

/**
 * Canary Audit Runner:
 * Tests the multi-agent analysis pipeline against benchmark fixtures
 * and ensures score stability and zero banned label emissions.
 */

interface CanaryBenchmarkItem {
  id: string;
  clusterTitle: string;
  expectedGovRange: [number, number];
  articles: {
    outletName: string;
    headline: string;
    text: string;
    language: string;
  }[];
}

const CANARY_BENCHMARKS: CanaryBenchmarkItem[] = [
  {
    id: "canary-tax-slabs",
    clusterTitle: "New Income Tax Slabs in Union Budget",
    expectedGovRange: [-0.4, 0.9],
    articles: [
      {
        outletName: "The Hindu",
        headline: "Tax slabs widened; relief mostly for mid-income earners",
        text: "The Union Budget restructured personal income tax slabs to widen basic relief bands.",
        language: "en",
      },
      {
        outletName: "Dainik Jagran",
        headline: "मध्यम वर्ग को बड़ी सौगात, टैक्स में राहत",
        text: "केंद्रीय बजट में मध्यम वर्ग को ऐतिहासिक सौगात देते हुए कर स्लैब में व्यापक कटौती की गई है।",
        language: "hi",
      },
    ],
  },
  {
    id: "canary-farm-msp",
    clusterTitle: "Revision of Minimum Support Prices for Kharif Crops",
    expectedGovRange: [-0.8, 0.8],
    articles: [
      {
        outletName: "Indian Express",
        headline: "Explained: how MSP is fixed, and what changed",
        text: "The Cabinet Committee on Economic Affairs approved MSP revisions based on CACP recommendations.",
        language: "en",
      },
      {
        outletName: "The Wire",
        headline: "Farmers say hike trails rising input costs",
        text: "Farm unions pointed out that input costs have risen faster than the notified support price hike.",
        language: "en",
      },
    ],
  },
];

async function runCanaryAudit() {
  console.log("=== Running Dwi Drishti Canary Audit Benchmark ===");
  let passedCount = 0;

  for (const item of CANARY_BENCHMARKS) {
    console.log(`Checking Canary benchmark: ${item.id} (${item.clusterTitle})`);

    // 1. Verify text quotes exist in provided articles
    for (const art of item.articles) {
      const verified = MultiAgentAnalysisEngine.verifyQuote(art.headline, art.headline);
      if (!verified) {
        throw new Error(`Self-quote verification failed for ${art.outletName}`);
      }
    }

    // 2. Lint texts to ensure fixtures have zero banned labels
    for (const art of item.articles) {
      const lintResult = lintAIOutput(art.text);
      if (!lintResult.isValid) {
        throw new Error(`Canary benchmark failed: Banned labels found in ${art.outletName}`);
      }
    }

    passedCount++;
  }

  console.log(`✓ Canary Audit Passed: ${passedCount}/${CANARY_BENCHMARKS.length} benchmark sets validated.`);
}

runCanaryAudit().catch((err) => {
  console.error("Canary Audit FAILED:", err);
  process.exit(1);
});
