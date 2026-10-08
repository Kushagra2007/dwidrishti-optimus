import { FeedPoller, PollResult } from "@/lib/feed_poller";
import { OUTLETS_REGISTRY } from "@/config/outlets";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  // Allow call if internal cron secret matches or in dev mode
  const isAuthorized =
    process.env.NODE_ENV === "development" ||
    (cronSecret && authHeader === `Bearer ${cronSecret}`);

  if (!isAuthorized) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const poller = new FeedPoller();
  const results = await poller.pollAllActive();

  const summary = {
    totalActiveOutlets: OUTLETS_REGISTRY.filter((o) => o.isActive).length,
    polledFeeds: results.length,
    successfulFeeds: results.filter((r) => r.status === "success").length,
    skipped304: results.filter((r) => r.status === "skipped_304").length,
    failingFeeds: results.filter((r) => r.status === "error").length,
    totalArticlesFetched: results.reduce((acc, r) => acc + r.items.length, 0),
    timestamp: new Date().toISOString(),
    feeds: results.map((r) => ({
      outletId: r.outletId,
      url: r.url,
      status: r.status,
      itemCount: r.items.length,
      error: r.error,
    })),
  };

  return Response.json(summary);
}
