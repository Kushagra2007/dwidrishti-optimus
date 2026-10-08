import { XMLParser } from "fast-xml-parser";
import { OUTLETS_REGISTRY, OutletConfig } from "@/config/outlets";
import { truncateTo50Words } from "./snippet";

export interface FeedItem {
  outletId: string;
  outletName: string;
  language: string;
  title: string;
  link: string;
  publishedAt: Date;
  snippet50w: string;
  rawContent: string;
}

export interface PollResult {
  outletId: string;
  url: string;
  status: "success" | "skipped_304" | "error" | "robots_blocked";
  items: FeedItem[];
  etag?: string;
  lastModified?: string;
  error?: string;
}

export class FeedPoller {
  private parser: XMLParser;
  private etags: Map<string, string> = new Map();
  private lastModifieds: Map<string, string> = new Map();

  constructor() {
    this.parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "@_",
    });
  }

  async checkRobotsCompliance(feedUrl: string): Promise<boolean> {
    try {
      const urlObj = new URL(feedUrl);
      const robotsUrl = `${urlObj.origin}/robots.txt`;
      const res = await fetch(robotsUrl, { signal: AbortSignal.timeout(3000) });
      if (!res.ok) return true; // Default allow if robots.txt not reachable
      const text = await res.text();
      // Check for Disallow rules on DwiDrishtiBot or all agents
      if (text.includes("User-agent: DwiDrishtiBot") && text.includes("Disallow: /")) {
        return false;
      }
      return true;
    } catch {
      return true;
    }
  }

  async pollFeed(outlet: OutletConfig, feedUrl: string): Promise<PollResult> {
    const isAllowed = await this.checkRobotsCompliance(feedUrl);
    if (!isAllowed) {
      return {
        outletId: outlet.id,
        url: feedUrl,
        status: "robots_blocked",
        items: [],
        error: "Feed disallowed by publisher robots.txt",
      };
    }

    const headers: Record<string, string> = {
      "User-Agent": "DwiDrishtiBot/1.0 (+https://dwidrishti.news/compliance)",
      "Accept": "application/rss+xml, application/xml, text/xml, */*",
    };

    const prevEtag = this.etags.get(feedUrl);
    if (prevEtag) headers["If-None-Match"] = prevEtag;

    const prevModified = this.lastModifieds.get(feedUrl);
    if (prevModified) headers["If-Modified-Since"] = prevModified;

    try {
      const response = await fetch(feedUrl, {
        headers,
        signal: AbortSignal.timeout(8000),
      });

      if (response.status === 304) {
        return {
          outletId: outlet.id,
          url: feedUrl,
          status: "skipped_304",
          items: [],
        };
      }

      if (!response.ok) {
        return {
          outletId: outlet.id,
          url: feedUrl,
          status: "error",
          items: [],
          error: `HTTP ${response.status} ${response.statusText}`,
        };
      }

      const etag = response.headers.get("etag");
      if (etag) this.etags.set(feedUrl, etag);

      const lastModified = response.headers.get("last-modified");
      if (lastModified) this.lastModifieds.set(feedUrl, lastModified);

      const xmlText = await response.text();
      const parsed = this.parser.parse(xmlText);

      const rawItems =
        parsed?.rss?.channel?.item ||
        parsed?.feed?.entry ||
        parsed?.["rdf:RDF"]?.item ||
        [];

      const itemsArray = Array.isArray(rawItems) ? rawItems : [rawItems];
      const feedItems: FeedItem[] = [];

      for (const item of itemsArray) {
        if (!item) continue;
        const title = item.title?.["#text"] || item.title || "";
        const link = item.link?.["@_href"] || item.link || item.guid?.["#text"] || item.guid || "";
        const desc = item.description?.["#text"] || item.description || item.summary?.["#text"] || item.summary || "";
        const pubDateStr = item.pubDate || item.published || item.updated || new Date().toISOString();

        if (!title || !link) continue;

        // Clean HTML tags from description
        const cleanDesc = desc.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

        feedItems.push({
          outletId: outlet.id,
          outletName: outlet.name,
          language: outlet.language,
          title: title.trim(),
          link: typeof link === "string" ? link : String(link),
          publishedAt: new Date(pubDateStr),
          snippet50w: truncateTo50Words(cleanDesc),
          rawContent: cleanDesc,
        });
      }

      return {
        outletId: outlet.id,
        url: feedUrl,
        status: "success",
        items: feedItems,
        etag: etag || undefined,
        lastModified: lastModified || undefined,
      };
    } catch (err: any) {
      return {
        outletId: outlet.id,
        url: feedUrl,
        status: "error",
        items: [],
        error: err.message || "Failed to poll RSS feed",
      };
    }
  }

  async pollAllActive(): Promise<PollResult[]> {
    const activeOutlets = OUTLETS_REGISTRY.filter((o) => o.isActive);
    const results: PollResult[] = [];

    for (const outlet of activeOutlets) {
      for (const url of outlet.feeds) {
        // Enforce per-host courtesy delay
        const res = await this.pollFeed(outlet, url);
        results.push(res);
        await new Promise((r) => setTimeout(r, 200));
      }
    }

    return results;
  }
}
