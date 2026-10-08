import { getGenAIClient, REASONING_MODEL, FAST_MODEL } from "./gemini";
import { ClusterSynthesisSchema, ClusterSynthesis } from "./analysis_schemas";
import { lintAIOutput } from "./linter";

export interface ArticleInputPayload {
  outletName: string;
  headline: string;
  text: string;
  language: string;
}

export class MultiAgentAnalysisEngine {
  /**
   * Programmatic quotation verification:
   * Confirms that each quoted claim or loaded term actually exists in the source text.
   */
  static verifyQuote(quote: string, sourceText: string): boolean {
    if (!quote || !sourceText) return false;
    const normalize = (s: string) =>
      s
        .toLowerCase()
        .replace(/['"“”‘’]/g, "")
        .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "")
        .replace(/\s+/g, " ")
        .trim();

    return normalize(sourceText).includes(normalize(quote));
  }

  /**
   * Calculates the Entity Omission Index:
   * O_i = 1 - |E_i ∩ E_core| / |E_core|
   */
  static calculateOmissionIndex(
    articleEntities: string[],
    consensusEntities: string[]
  ): { omissionIndex: number; missingEntities: string[] } {
    if (consensusEntities.length === 0) {
      return { omissionIndex: 0, missingEntities: [] };
    }

    const normArticleEntities = new Set(articleEntities.map((e) => e.toLowerCase().trim()));
    const missing: string[] = [];
    let presentCount = 0;

    for (const core of consensusEntities) {
      if (normArticleEntities.has(core.toLowerCase().trim())) {
        presentCount++;
      } else {
        missing.push(core);
      }
    }

    const omissionIndex = 1 - presentCount / consensusEntities.length;
    return {
      omissionIndex: Math.max(0, Math.min(1, Number(omissionIndex.toFixed(3)))),
      missingEntities: missing,
    };
  }

  /**
   * Three-Agent Pipeline Execution:
   * Agent A (Constitutional), Agent B (Socio-Economic), Agent C (Synthesis with gemini-2.5-pro)
   */
  async analyzeCluster(articles: ArticleInputPayload[], targetLanguage: string = "en"): Promise<ClusterSynthesis> {
    const client = getGenAIClient();

    const articlesPrompt = articles
      .map(
        (a, i) => `=== ARTICLE ${i + 1}: ${a.outletName} [${a.language}] ===
Headline: ${a.headline}
Content: ${a.text}
`
      )
      .join("\n\n");

    const systemPrompt = `You are the lead analytical engine of Dwi Drishti News (द्वि दृष्टि), an automated media perspective engine for India.
You reconcile two analytical frameworks:
- Agent A (Statutory and Constitutional Analyst): Evaluates articles against legal, procedural, and constitutional content (Articles 14, 19, 21, federal statutes).
- Agent B (Socio-Economic and Subaltern Analyst): Evaluates articles for reporting on labor, agrarian welfare, caste equity, and grassroots community impacts.

STRICT NON-NEGOTIABLE RULES:
1. Never use pejorative labels like 'fake news', 'propaganda', 'godi media', 'corrupt', 'lapdog', or 'dalal'. All metrics must be neutral and data-driven.
2. Every loaded term, omission, or framing tag MUST include an exact verbatim quote from the input article text.
3. Absence is not guilt: describe omissions as neutral differences across reporting.
4. Score all 6 axes strictly within [-1.0, 1.0]:
   - scoreGovernment: -1.0 (Opposition/Hyper-critical) to +1.0 (Ruling party/Establishment alignment)
   - scoreCulture: -1.0 (Constitutional secularism) to +1.0 (Majoritarian nationalism)
   - scoreFederal: -1.0 (State autonomy-first) to +1.0 (New Delhi centralism)
   - scoreEconomic: -1.0 (Labor/agrarian welfare) to +1.0 (Corporate/market-led alignment)
   - scoreCaste: -1.0 (Subaltern representation) to +1.0 (Caste-blind hegemony)
   - scoreTenor: -1.0 (Empirical rigor) to +1.0 (Sensationalist outrage)
5. Output valid JSON in target language: ${targetLanguage}.`;

    const response = await client.models.generateContent({
      model: REASONING_MODEL,
      contents: `Synthesize and evaluate the framing across this news cluster:\n\n${articlesPrompt}`,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        temperature: 0.0,
      },
    });

    const parsedJson = JSON.parse(response.text || "{}");

    // 1. Lint for banned defamatory labels
    const lintRes = lintAIOutput(parsedJson);
    if (!lintRes.isValid) {
      throw new Error(`AI analysis contained banned pejorative labels: ${lintRes.violations.join(", ")}`);
    }

    // 2. Validate against strict Zod schema
    const validated = ClusterSynthesisSchema.parse(parsedJson);

    // 3. Programmatic Verbatim Quote Verification
    for (const evalItem of validated.articleEvaluations) {
      const sourceArticle = articles.find((a) => a.outletName.toLowerCase() === evalItem.outletName.toLowerCase());
      if (sourceArticle) {
        // Filter out quotes that fail verbatim substring verification
        evalItem.quotes = evalItem.quotes.filter((q) => {
          const verified = MultiAgentAnalysisEngine.verifyQuote(q.quote, sourceArticle.text);
          if (!verified) {
            console.warn(`[MultiAgentAnalysis] Dropped unverified quote: "${q.quote}" for ${q.outlet}`);
          }
          return verified;
        });
      }
    }

    return validated;
  }
}
