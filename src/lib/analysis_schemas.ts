import { z } from "zod";

export const VerbatimQuoteSchema = z.object({
  quote: z.string().min(3),
  outlet: z.string(),
  category: z.enum(["loaded_term", "framing", "omission_counter"]),
  polarity: z.enum(["favourable", "critical", "neutral"]),
  rationale: z.string(),
});

export const ArticleFramingEvaluationSchema = z.object({
  outletName: z.string(),
  headline: z.string(),
  primaryAngle: z.string(),
  
  // 6 India-specific axes: range [-1.0, 1.0]
  scoreGovernment: z.number().min(-1.0).max(1.0),
  scoreCulture: z.number().min(-1.0).max(1.0),
  scoreFederal: z.number().min(-1.0).max(1.0),
  scoreEconomic: z.number().min(-1.0).max(1.0),
  scoreCaste: z.number().min(-1.0).max(1.0),
  scoreTenor: z.number().min(-1.0).max(1.0),

  uncertaintyScore: z.number().min(0.0).max(1.0),
  quotes: z.array(VerbatimQuoteSchema),
  omittedConsensusFacts: z.array(z.string()),
});

export const ClusterSynthesisSchema = z.object({
  canonicalTitle: z.string(),
  consensusSummary: z.array(z.string()).min(1),
  keyDisputes: z.array(z.string()).min(1),
  consensusEntities: z.array(z.string()).min(1),
  articleEvaluations: z.array(ArticleFramingEvaluationSchema),
});

export type VerbatimQuote = z.infer<typeof VerbatimQuoteSchema>;
export type ArticleFramingEvaluation = z.infer<typeof ArticleFramingEvaluationSchema>;
export type ClusterSynthesis = z.infer<typeof ClusterSynthesisSchema>;
