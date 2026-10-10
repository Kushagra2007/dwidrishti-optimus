import { getEnrichedNewsClusters } from "@/lib/context_harvester";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";

    const clusters = await getEnrichedNewsClusters();

    if (!query) {
      return Response.json({ clusters, total: clusters.length });
    }

    const qLower = query.toLowerCase().trim();
    const isCjpQuery =
      qLower.includes("cjp") ||
      qLower.includes("cockroach") ||
      (qLower.includes("protest") && !qLower.includes("rail") && !qLower.includes("toll"));

    const filtered = clusters.filter(
      (c) =>
        c.canonicalTitle.toLowerCase().includes(qLower) ||
        c.canonicalTitleHi.toLowerCase().includes(qLower) ||
        c.tag.toLowerCase().includes(qLower) ||
        c.leadFact.toLowerCase().includes(qLower) ||
        c.divergenceSummary.toLowerCase().includes(qLower) ||
        c.omissionEvidence.toLowerCase().includes(qLower) ||
        c.br?.some((b) => b.toLowerCase().includes(qLower)) ||
        c.articles.some(
          (a) =>
            a.title.toLowerCase().includes(qLower) ||
            a.snippet50w.toLowerCase().includes(qLower) ||
            a.outlet.toLowerCase().includes(qLower)
        ) ||
        ((qLower.includes("cjp") || qLower.includes("cockroach")) &&
          (c.id === "clu-02" || c.canonicalTitle.toLowerCase().includes("election commissioner")))
    );

    // Prioritize latest CJP protest on October 10, 2026 for CJP / protest queries
    if (isCjpQuery) {
      filtered.sort((a, b) => {
        const aIsCjp = a.id === "clu-02" || a.canonicalTitle.toLowerCase().includes("cjp");
        const bIsCjp = b.id === "clu-02" || b.canonicalTitle.toLowerCase().includes("cjp");
        if (aIsCjp && !bIsCjp) return -1;
        if (!aIsCjp && bIsCjp) return 1;
        return 0;
      });
    }

    return Response.json({ clusters: filtered, total: filtered.length, query });
  } catch (err: any) {
    return Response.json({ error: err.message || "Failed to fetch stories" }, { status: 500 });
  }
}
