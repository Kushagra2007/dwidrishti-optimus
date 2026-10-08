import { describe, it, expect } from "vitest";
import { FeedPoller } from "./feed_poller";
import { OUTLETS_REGISTRY } from "@/config/outlets";

describe("FeedPoller and Outlet Registry", () => {
  it("has exactly 8 active outlets configured for Phase 1", () => {
    const active = OUTLETS_REGISTRY.filter((o) => o.isActive);
    expect(active.length).toBe(8);

    const languages = new Set(active.map((o) => o.language));
    expect(languages.has("en")).toBe(true);
    expect(languages.has("hi")).toBe(true);
    expect(languages.has("ta")).toBe(true);
  });

  it("every outlet has verified ownership citation URLs", () => {
    for (const outlet of OUTLETS_REGISTRY) {
      expect(outlet.ownershipCitationUrl.startsWith("http")).toBe(true);
      expect(outlet.ownershipDetails.length).toBeGreaterThan(15);
    }
  });

  it("correctly parses mock RSS feeds without errors", async () => {
    const poller = new FeedPoller();
    const mockXml = `<?xml version="1.0" encoding="UTF-8"?>
    <rss version="2.0">
      <channel>
        <title>Mock News</title>
        <item>
          <title>Supreme Court upholds federal taxation principles</title>
          <link>https://example.com/sc-verdict</link>
          <description>The Supreme Court ruled today on federal autonomy and financial transfers.</description>
          <pubDate>Mon, 08 Oct 2026 12:00:00 GMT</pubDate>
        </item>
      </channel>
    </rss>`;

    // Test parser with XML directly
    const parsed = (poller as any).parser.parse(mockXml);
    const item = parsed.rss.channel.item;
    expect(item.title).toContain("Supreme Court");
    expect(item.link).toBe("https://example.com/sc-verdict");
  });
});
