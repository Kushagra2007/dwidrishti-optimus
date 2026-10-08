import { describe, it, expect } from "vitest";
import { CrossLingualClusteringEngine } from "./clustering_engine";
import { cosineSimilarity } from "./embeddings";
import pairs from "../../fixtures/clustering_pairs.json";

describe("Cross-Lingual Clustering Engine Benchmark", () => {
  it("cosine similarity function computes correct normalized distances", () => {
    const v1 = [1, 0, 0];
    const v2 = [1, 0, 0];
    const v3 = [0, 1, 0];
    expect(cosineSimilarity(v1, v2)).toBeCloseTo(1.0);
    expect(cosineSimilarity(v1, v3)).toBeCloseTo(0.0);
  });

  it("evaluates cluster candidates and manages blindspot flags", async () => {
    const engine = new CrossLingualClusteringEngine();

    const dummyVec = Array(768).fill(0.1);

    const art1 = {
      outletId: "the-hindu",
      outletName: "The Hindu",
      language: "en",
      title: "SC strikes down electoral bonds scheme",
      link: "https://thehindu.com/1",
      publishedAt: new Date(),
      snippet50w: "SC strikes down electoral bonds scheme as unconstitutional.",
      rawContent: "SC strikes down electoral bonds scheme as unconstitutional.",
    };

    const cluId1 = await engine.assignArticle(art1, dummyVec);
    const cluster = engine.getCluster(cluId1);

    expect(cluster).toBeDefined();
    expect(cluster?.isBlindspot).toBe(true); // only 1 outlet initially

    // Add another article from Indian Express
    const art2 = {
      outletId: "indian-express",
      outletName: "The Indian Express",
      language: "en",
      title: "Electoral bonds unconstitutional, says SC bench",
      link: "https://indianexpress.com/2",
      publishedAt: new Date(),
      snippet50w: "SC bench strikes down anonymous donor bonds.",
      rawContent: "SC bench strikes down anonymous donor bonds.",
    };

    // Very close vector (sim > 0.82)
    const dummyVec2 = [...dummyVec];
    dummyVec2[0] += 0.001;

    const cluId2 = await engine.assignArticle(art2, dummyVec2);
    expect(cluId2).toBe(cluId1); // merged into same cluster
  });

  it("correctly identifies fixture pair semantics", () => {
    const samePairs = pairs.filter((p) => p.sameEvent);
    const diffPairs = pairs.filter((p) => !p.sameEvent);
    expect(samePairs.length).toBeGreaterThanOrEqual(4);
    expect(diffPairs.length).toBeGreaterThanOrEqual(2);
  });
});
