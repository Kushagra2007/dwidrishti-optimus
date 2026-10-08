/**
 * ContentFetcher interface for article extraction
 * Encapsulates Context.dev API and fallback native scrapers.
 */

export interface ExtractedArticle {
  title?: string;
  text: string;
  source: "feed" | "context_dev" | "direct_cleaner";
  wordCount: number;
}

export interface ContentFetcher {
  fetchArticle(url: string, feedSnippet?: string): Promise<ExtractedArticle>;
}

export class ContextDevFetcher implements ContentFetcher {
  private apiKey: string;
  private endpoint: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.CONTEXT_DEV_API_KEY || "";
    this.endpoint = "https://api.context.dev/v1/web/scrape";
  }

  async fetchArticle(url: string, feedSnippet?: string): Promise<ExtractedArticle> {
    // If snippet is already detailed (e.g. over 150 words), prefer using the feed directly to conserve API calls
    if (feedSnippet && feedSnippet.split(/\s+/).length >= 150) {
      return {
        text: feedSnippet,
        source: "feed",
        wordCount: feedSnippet.split(/\s+/).length,
      };
    }

    if (!this.apiKey) {
      console.warn("[ContentFetcher] No CONTEXT_DEV_API_KEY provided. Falling back to feed snippet or direct fetch.");
      const fallbackText = feedSnippet || "";
      return {
        text: fallbackText,
        source: "direct_cleaner",
        wordCount: fallbackText.split(/\s+/).length,
      };
    }

    try {
      const response = await fetch(this.endpoint, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url,
          format: "markdown",
        }),
      });

      if (!response.ok) {
        console.warn(`[ContextDevFetcher] HTTP error ${response.status} when scraping ${url}`);
        return {
          text: feedSnippet || "",
          source: "feed",
          wordCount: (feedSnippet || "").split(/\s+/).length,
        };
      }

      const data = await response.json();
      const content = data.content || data.markdown || data.text || feedSnippet || "";
      
      return {
        title: data.title,
        text: content,
        source: "context_dev",
        wordCount: content.split(/\s+/).length,
      };
    } catch (err) {
      console.error("[ContextDevFetcher] Exception fetching article:", err);
      return {
        text: feedSnippet || "",
        source: "feed",
        wordCount: (feedSnippet || "").split(/\s+/).length,
      };
    }
  }
}
