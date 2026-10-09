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

    const qLower = query.toLowerCase();
    const filtered = clusters.filter(
      (c) =>
        c.canonicalTitle.toLowerCase().includes(qLower) ||
        c.canonicalTitleHi.toLowerCase().includes(qLower) ||
        c.tag.toLowerCase().includes(qLower) ||
        c.articles.some((a) => a.title.toLowerCase().includes(qLower))
    );

    return Response.json({ clusters: filtered, total: filtered.length, query });
  } catch (err: any) {
    return Response.json({ error: err.message || "Failed to fetch stories" }, { status: 500 });
  }
}
