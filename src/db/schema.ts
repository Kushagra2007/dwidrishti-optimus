import { pgTable, text, timestamp, boolean, integer, real, jsonb, vector } from "drizzle-orm/pg-core";

export const outlets = pgTable("outlets", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  language: text("language").notNull(), // 'en', 'hi', 'ta', etc.
  region: text("region").notNull(),
  ownershipType: text("ownership_type").notNull(),
  ownershipDetails: text("ownership_details").notNull(),
  ownershipCitationUrl: text("ownership_citation_url").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const feeds = pgTable("feeds", {
  id: text("id").primaryKey(),
  outletId: text("outlet_id").references(() => outlets.id).notNull(),
  feedUrl: text("feed_url").notNull(),
  etag: text("etag"),
  lastModified: text("last_modified"),
  lastPolledAt: timestamp("last_polled_at"),
  status: text("status").default("active").notNull(), // 'active', 'failing', 'disabled'
  failureCount: integer("failure_count").default(0).notNull(),
  lastError: text("last_error"),
});

export const articles = pgTable("articles", {
  id: text("id").primaryKey(),
  outletId: text("outlet_id").references(() => outlets.id).notNull(),
  feedId: text("feed_id").references(() => feeds.id),
  canonicalUrl: text("canonical_url").notNull(),
  title: text("title").notNull(),
  snippet50w: text("snippet_50w").notNull(),
  language: text("language").notNull(),
  publishedAt: timestamp("published_at").notNull(),
  contentHash: text("content_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Full text storage is strictly transient with a 7-day TTL
export const articleTextCache = pgTable("article_text_cache", {
  articleId: text("article_id").primaryKey().references(() => articles.id, { onDelete: "cascade" }),
  cleanFullText: text("clean_full_text").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
});

export const articleEmbeddings = pgTable("article_embeddings", {
  articleId: text("article_id").primaryKey().references(() => articles.id, { onDelete: "cascade" }),
  embedding: vector("embedding", { dimensions: 768 }).notNull(),
  modelId: text("model_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const clusters = pgTable("clusters", {
  id: text("id").primaryKey(),
  canonicalTitle: text("canonical_title").notNull(),
  tag: text("tag").notNull(), // 'Politics', 'Economy', 'Environment', 'Federal', etc.
  isBlindspot: boolean("is_blindspot").default(false).notNull(),
  blindspotReason: text("blindspot_reason"),
  articleCount: integer("article_count").default(0).notNull(),
  firstSeenAt: timestamp("first_seen_at").defaultNow().notNull(),
  lastUpdatedAt: timestamp("last_updated_at").defaultNow().notNull(),
});

export const clusterArticles = pgTable("cluster_articles", {
  clusterId: text("cluster_id").references(() => clusters.id, { onDelete: "cascade" }).notNull(),
  articleId: text("article_id").references(() => articles.id, { onDelete: "cascade" }).notNull(),
  similarityScore: real("similarity_score"),
  addedAt: timestamp("added_at").defaultNow().notNull(),
});

export const articleAnalyses = pgTable("article_analyses", {
  id: text("id").primaryKey(),
  articleId: text("article_id").references(() => articles.id, { onDelete: "cascade" }).notNull(),
  clusterId: text("cluster_id").references(() => clusters.id, { onDelete: "cascade" }).notNull(),
  
  // 6 India-specific framing axes [-1.0, 1.0]
  scoreGovernment: real("score_government").notNull(),
  scoreCulture: real("score_culture").notNull(),
  scoreFederal: real("score_federal").notNull(),
  scoreEconomic: real("score_economic").notNull(),
  scoreCaste: real("score_caste").notNull(),
  scoreTenor: real("score_tenor").notNull(),
  
  uncertaintyScore: real("uncertainty_score").notNull(), // [0.0, 1.0]
  omissionIndex: real("omission_index").notNull(), // [0.0, 1.0]
  omissionExplanation: text("omission_explanation"),
  
  analysisVersion: text("analysis_version").notNull(),
  modelId: text("model_id").notNull(),
  promptHash: text("prompt_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const evidenceQuotes = pgTable("evidence_quotes", {
  id: text("id").primaryKey(),
  analysisId: text("analysis_id").references(() => articleAnalyses.id, { onDelete: "cascade" }).notNull(),
  category: text("category").notNull(), // 'loaded_term', 'framing', 'omission_counter'
  verbatimQuote: text("verbatim_quote").notNull(),
  polarity: text("polarity"), // 'favourable', 'critical', 'neutral'
  isVerified: boolean("is_verified").default(false).notNull(),
});

export const clusterAnalyses = pgTable("cluster_analyses", {
  id: text("id").primaryKey(),
  clusterId: text("cluster_id").references(() => clusters.id, { onDelete: "cascade" }).notNull(),
  language: text("language").notNull(),
  consensusSummary: jsonb("consensus_summary").notNull(), // facts all agree upon
  keyDisputes: jsonb("key_disputes").notNull(), // divergent narrative frames
  analysisVersion: text("analysis_version").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const briefs = pgTable("briefs", {
  id: text("id").primaryKey(),
  clusterId: text("cluster_id").references(() => clusters.id, { onDelete: "cascade" }).notNull(),
  language: text("language").notNull(),
  neutralBackground: text("neutral_background").notNull(),
  constitutionalStatutes: jsonb("constitutional_statutes").notNull(),
  governmentJustification: text("government_justification").notNull(),
  counterArguments: text("counter_arguments").notNull(),
  prelimsMcqs: jsonb("prelims_mcqs").notNull(),
  mainsQuestions: jsonb("mains_questions").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const takedownRequests = pgTable("takedown_requests", {
  id: text("id").primaryKey(),
  outletName: text("outlet_name").notNull(),
  contactEmail: text("contact_email").notNull(),
  articleUrl: text("article_url").notNull(),
  reason: text("reason").notNull(),
  status: text("status").default("pending").notNull(),
  acknowledgedAt: timestamp("acknowledged_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const aiUsage = pgTable("ai_usage", {
  id: text("id").primaryKey(),
  date: text("date").notNull(), // 'YYYY-MM-DD'
  tokensPrompt: integer("tokens_prompt").notNull(),
  tokensCompletion: integer("tokens_completion").notNull(),
  costUsd: real("cost_usd").notNull(),
  clusterCount: integer("cluster_count").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
