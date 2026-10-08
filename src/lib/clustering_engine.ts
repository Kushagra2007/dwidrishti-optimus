import { GoogleGenAI } from "@google/genai";
import { getGenAIClient, FAST_MODEL } from "./gemini";
import { generateEmbedding, cosineSimilarity } from "./embeddings";
import { FeedItem } from "./feed_poller";

export interface ArticleWithEmbedding extends FeedItem {
  id: string;
  embedding: number[];
}

export interface ClusterCandidate {
  id: string;
  canonicalTitle: string;
  tag: string;
  articles: ArticleWithEmbedding[];
  centroid: number[];
  isBlindspot: boolean;
  blindspotReason?: string;
  lastUpdated: Date;
}

export class CrossLingualClusteringEngine {
  private clusters: Map<string, ClusterCandidate> = new Map();
  private readonly SIMILARITY_THRESHOLD = 0.82;
  private readonly BORDERLINE_LOWER = 0.72;

  /**
   * Adjudicate borderline story match with fast Gemini model
   */
  async adjudicatePair(articleTitle: string, clusterTitle: string): Promise<{ sameEvent: boolean; reason: string }> {
    try {
      const client = getGenAIClient();
      const prompt = `Determine if the following two news headlines describe the EXACT SAME specific news event.
Headline A: "${articleTitle}"
Headline B: "${clusterTitle}"

Respond strictly with valid JSON conforming to this schema:
{
  "same_event": boolean,
  "reason": string
}`;

      const response = await client.models.generateContent({
        model: FAST_MODEL,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.0,
        },
      });

      const parsed = JSON.parse(response.text || "{}");
      return {
        sameEvent: Boolean(parsed.same_event),
        reason: parsed.reason || "Adjudicated by Gemini",
      };
    } catch (err) {
      console.error("[ClusteringEngine] Adjudication error:", err);
      // Fallback conservative
      return { sameEvent: false, reason: "Fallback on error" };
    }
  }

  /**
   * Adds an article to existing clusters or creates a new cluster
   */
  async assignArticle(article: FeedItem, precomputedEmbedding?: number[]): Promise<string> {
    const embedding = precomputedEmbedding || (await generateEmbedding(`${article.title}\n\n${article.snippet50w}`));
    const articleWithVec: ArticleWithEmbedding = {
      ...article,
      id: `${article.outletId}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      embedding,
    };

    let bestClusterId: string | null = null;
    let highestSim = -1;

    for (const [id, cluster] of this.clusters.entries()) {
      const sim = cosineSimilarity(embedding, cluster.centroid);
      if (sim > highestSim) {
        highestSim = sim;
        bestClusterId = id;
      }
    }

    if (bestClusterId && highestSim >= this.SIMILARITY_THRESHOLD) {
      this.addToCluster(bestClusterId, articleWithVec);
      return bestClusterId;
    }

    // Borderline band check: [0.72, 0.82)
    if (bestClusterId && highestSim >= this.BORDERLINE_LOWER) {
      const bestCluster = this.clusters.get(bestClusterId)!;
      const adjudication = await this.adjudicatePair(article.title, bestCluster.canonicalTitle);
      if (adjudication.sameEvent) {
        this.addToCluster(bestClusterId, articleWithVec);
        return bestClusterId;
      }
    }

    // Initialize new cluster
    const newClusterId = `clu-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newCluster: ClusterCandidate = {
      id: newClusterId,
      canonicalTitle: article.title,
      tag: "General",
      articles: [articleWithVec],
      centroid: [...embedding],
      isBlindspot: true, // initial state until multi-outlet consensus
      blindspotReason: "Only 1 outlet covering so far",
      lastUpdated: new Date(),
    };

    this.clusters.set(newClusterId, newCluster);
    return newClusterId;
  }

  private addToCluster(clusterId: string, article: ArticleWithEmbedding) {
    const cluster = this.clusters.get(clusterId);
    if (!cluster) return;

    cluster.articles.push(article);
    cluster.lastUpdated = new Date();

    // Recalculate centroid average
    const n = cluster.articles.length;
    for (let i = 0; i < cluster.centroid.length; i++) {
      cluster.centroid[i] = (cluster.centroid[i] * (n - 1) + article.embedding[i]) / n;
    }

    // Assess Blindspot status
    const distinctOutlets = new Set(cluster.articles.map((a) => a.outletId)).size;
    if (distinctOutlets <= 3) {
      cluster.isBlindspot = true;
      cluster.blindspotReason = `Covered by only ${distinctOutlets} outlets`;
    } else {
      cluster.isBlindspot = false;
      cluster.blindspotReason = undefined;
    }
  }

  getClusters(): ClusterCandidate[] {
    return Array.from(this.clusters.values());
  }

  getCluster(id: string): ClusterCandidate | undefined {
    return this.clusters.get(id);
  }
}
