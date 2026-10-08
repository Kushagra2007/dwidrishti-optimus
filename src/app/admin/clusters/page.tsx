import React from "react";

export const dynamic = "force-dynamic";

interface MockClusterReviewItem {
  id: string;
  title: string;
  articleCount: number;
  outlets: string[];
  isBlindspot: boolean;
  confidence: number;
}

const REVIEW_CLUSTERS: MockClusterReviewItem[] = [
  {
    id: "clu-01",
    title: "Supreme Court Electoral Bonds Unconstitutional Verdict",
    articleCount: 5,
    outlets: ["The Hindu", "Indian Express", "NDTV", "Dainik Jagran", "The Wire"],
    isBlindspot: false,
    confidence: 0.94,
  },
  {
    id: "clu-02",
    title: "Protests and Blockades on Proposed Regional Freight Corridor",
    articleCount: 2,
    outlets: ["The Hindu", "Dainik Jagran"],
    isBlindspot: true,
    confidence: 0.78,
  },
  {
    id: "clu-03",
    title: "MSP Revision Before Kharif Sowing Season",
    articleCount: 4,
    outlets: ["The Hindu", "Indian Express", "Dainik Jagran", "The Wire"],
    isBlindspot: false,
    confidence: 0.88,
  },
];

export default function ClusterReviewQueuePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8 border-b border-line pb-4">
        <div>
          <h1 className="text-3xl font-extrabold font-display">Cluster Review Queue</h1>
          <p className="text-sm text-mut mt-1">
            Admin tool for validating cross-lingual clustering quality, borderline pair adjudications, and merge/split actions.
          </p>
        </div>
        <a
          href="/"
          className="px-4 py-1.5 rounded-full text-xs font-bold border border-fg hover:bg-volt/30 transition-all"
        >
          ← Back to Platform
        </a>
      </div>

      <div className="space-y-4">
        {REVIEW_CLUSTERS.map((cluster) => (
          <div
            key={cluster.id}
            className="p-5 rounded-2xl bg-card border border-line flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm"
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-xs text-mut uppercase">[{cluster.id}]</span>
                {cluster.isBlindspot && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-volt text-black">
                    Blindspot
                  </span>
                )}
                <span className="text-xs text-mut font-semibold">
                  Confidence: {Math.round(cluster.confidence * 100)}%
                </span>
              </div>
              <h2 className="text-lg font-bold font-display">{cluster.title}</h2>
              <div className="text-xs text-mut mt-1">
                Covered by {cluster.articleCount} outlets:{" "}
                <span className="text-fg font-medium">{cluster.outlets.join(", ")}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 rounded-full text-xs font-bold border border-line bg-bg hover:border-fg">
                Split Cluster
              </button>
              <button className="px-3 py-1.5 rounded-full text-xs font-bold border border-line bg-bg hover:border-fg">
                Merge Into…
              </button>
              <button className="px-3 py-1.5 rounded-full text-xs font-bold bg-volt text-black border border-fg">
                Approve ✓
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
