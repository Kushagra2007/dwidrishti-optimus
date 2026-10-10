import { GoogleGenAI } from "@google/genai";
import { lintAIOutput } from "@/lib/linter";
import { getDb, schema } from "@/db";
import { eq } from "drizzle-orm";
import { generateContentWithFallback } from "@/lib/gemini";
import { getEnrichedNewsClusters } from "@/lib/context_harvester";

export const dynamic = "force-dynamic";

function parseJsonObject(text: string): Record<string, any> {
  const start = text.indexOf("{");
  if (start === -1) {
    throw new Error("Gemini returned no JSON object. Try the analysis again.");
  }

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let i = start; i < text.length; i += 1) {
    const char = text[i];

    if (inString) {
      if (escaped) escaped = false;
      else if (char === "\\") escaped = true;
      else if (char === '"') inString = false;
      continue;
    }

    if (char === '"') inString = true;
    else if (char === "{") depth += 1;
    else if (char === "}") {
      depth -= 1;
      if (depth === 0) {
        try {
          const parsed: unknown = JSON.parse(text.slice(start, i + 1));
          if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
            throw new Error("Expected a JSON object");
          }
          return parsed as Record<string, any>;
        } catch {
          throw new Error("Gemini returned malformed JSON. Try the analysis again.");
        }
      }
    }
  }

  throw new Error("Gemini returned incomplete JSON. Try the analysis again.");
}

const TEN_MAJOR_OUTLETS = [
  { name: "The Hindu", lang: "EN", lean: 42 },
  { name: "Indian Express", lang: "EN", lean: 48 },
  { name: "NDTV", lang: "EN", lean: 36 },
  { name: "Times of India", lang: "EN", lean: 58 },
  { name: "Hindustan Times", lang: "EN", lean: 54 },
  { name: "Dainik Jagran", lang: "HI", lean: 82 },
  { name: "Amar Ujala", lang: "HI", lean: 76 },
  { name: "The Wire", lang: "EN", lean: 18 },
  { name: "BBC Hindi", lang: "HI", lean: 32 },
  { name: "Scroll.in", lang: "EN", lean: 22 },
];

export async function POST(req: Request) {
  try {
    const { topic, language = "en" } = await req.json();

    if (!topic || typeof topic !== "string") {
      return Response.json({ error: "Topic is required" }, { status: 400 });
    }

    const normalizedTopic = topic.trim().toLowerCase();
    const isCjpTopic =
      normalizedTopic.includes("cjp") ||
      normalizedTopic.includes("cockroach") ||
      (normalizedTopic.includes("protest") && (normalizedTopic.includes("delhi") || normalizedTopic.includes("election") || normalizedTopic.includes("cec")));

    // 1. Fast Cache Check: Check Database for pre-computed analysis
    const db = getDb();
    if (db) {
      try {
        const cached = await db
          .select()
          .from(schema.topicAnalysesCache)
          .where(eq(schema.topicAnalysesCache.normalizedTopic, normalizedTopic))
          .limit(1);

        if (cached.length > 0 && cached[0].analysisData) {
          const analysisData = cached[0].analysisData as any;
          // Ensure at least 10 articles in cached data
          if (analysisData.outlets && analysisData.outlets.length >= 10) {
            return Response.json({
              success: true,
              cached: true,
              modelUsed: `${cached[0].modelUsed} (cached)`,
              fallbackOccurred: false,
              analysis: analysisData,
            });
          }
        }
      } catch (dbErr) {
        console.warn("[DB Cache Warning]:", dbErr);
      }
    }

    // 2. Prepare AI Request with Resilient Multi-Model Cascade
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return Response.json({ error: "Gemini API key is not configured" }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `You are the lead analytical engine of Dwi Drishti News (द्वि दृष्टि), an automated media perspective and framing analysis platform for India.
Analyze contemporary Indian media coverage regarding the topic: "${topic}".

STRICT NON-NEGOTIABLE RULES:
1. Never use pejorative labels like 'fake news', 'propaganda', 'godi media', 'corrupt', 'lapdog', or 'dalal'. All metrics must be neutral and data-driven.
2. In your analysis, systematically evaluate and return EXACTLY 10 distinct articles from 10 leading Indian media outlets:
   - The Hindu, Indian Express, NDTV, Times of India, Hindustan Times, Dainik Jagran, Amar Ujala, The Wire, BBC Hindi, Scroll.in.
   Each article must feature a realistic, representative headline and perspective from that outlet reflecting Indian journalistic styles.
3. Formulate realistic editorial perspectives differentiating three standard orientations across the 10 articles:
   - Left (Critical): Scrutiny of governance, opposition, civil society, labor/grassroots focus
   - Centre (Neutral): Factual, procedural, balanced overview
   - Right (Supportive): Official executive announcements, governance delivery, national growth focus
4. Calculate framing on the six India-specific axes (0 to 100):
   - Government Alignment (gov): 0 (opposition/critical) to 100 (ruling/supportive)
   - Cultural/Ideological Framing (cul): 0 (secular/pluralist) to 100 (traditionalist/majoritarian)
   - Federal Orientation (fed): 0 (state autonomy) to 100 (centralized)
   - Socio-Economic Gaze (eco): 0 (labor/agrarian welfare) to 100 (corporate/market-led)
   - Social Justice (cas): 0 (subaltern representation) to 100 (caste-blind/meritocratic)
   - Journalistic Tenor (ten): 0 (empirical/analytical) to 100 (sensational/outrage-driven)
5. Identify a key omission fact that one side foregrounds while the other omits.
6. SPECIAL RECENCY DIRECTIVE: If the query is or relates to "cjp protest", "cjp", or Election Commission protests, analyze the LATEST October 10, 2026 youth-led Cockroach Janta Party (CJP) New Delhi protest demanding CEC Gyanesh Kumar's resignation over the Special Intensive Revision (SIR) voter deletions, including the 23,000 CAPF deployment, 45 metro station closures, Section 144, and detention of Abhijeet Dipke and student volunteers.
7. Provide a 150-word balanced perspective summary and critical media literacy question exploring public framing.
8. Target language for output: ${language}.

Return exactly one JSON object with these fields:
- topic: string
- canonicalTitle: string
- consensusSummary: string (what happened)
- divergenceSummary: string (where the framing splits)
- omissionEvidence: string (what is missing)
- omittedOutlets: array of strings
- leftFraming: string (1 sentence summary of how critical outlets frame it)
- centreFraming: string (1 sentence summary of how neutral outlets frame it)
- rightFraming: string (1 sentence summary of how supportive outlets frame it)
- outlets: array of EXACTLY 10 objects (one for each of the 10 analysed articles) with:
    - name: string (e.g. "The Hindu", "Indian Express", "Dainik Jagran", "The Wire", "NDTV", "Times of India", "Hindustan Times", "Amar Ujala", "BBC Hindi", "Scroll.in")
    - language: string ("EN" or "HI")
    - headline: string
    - scoreGov: number (0 to 100, where <45 is Left/Critical, 45-65 is Centre/Neutral, >65 is Right/Supportive)
    - loadedPhrases: array of objects with { text: string, polarity: "favourable" | "critical" }
    - axes: object with gov, cul, fed, eco, cas, ten numeric scores from 0 to 100
- perspectiveDossier: object with:
    - keyQuestion: string
    - framework: array of strings
- examBrief: object with { question: string, framework: array of strings } (for backwards compatibility)

Use valid JSON syntax with double-quoted keys and string values. Do not add markdown, commentary, or extra text.`;

    let generatedText = "";
    let modelUsed = "";
    let fallbackOccurred = false;

    try {
      const result = await generateContentWithFallback(ai, prompt, {
        responseMimeType: "application/json",
        temperature: 0.1,
      });
      generatedText = result.text;
      modelUsed = result.modelUsed;
      fallbackOccurred = result.fallbackOccurred;
    } catch (apiErr: any) {
      console.warn("[All Gemini Live Models Busy]:", apiErr.message);

      // Emergency Knowledge-Base Fallback: check if we have a matched curated cluster
      const clusters = await getEnrichedNewsClusters();
      const matched = isCjpTopic
        ? clusters.find((c) => c.id === "clu-02" || c.canonicalTitle.toLowerCase().includes("cjp"))
        : clusters.find(
            (c) =>
              c.canonicalTitle.toLowerCase().includes(normalizedTopic) ||
              c.tag.toLowerCase().includes(normalizedTopic) ||
              normalizedTopic.split(" ").some((w) => w.length > 3 && c.canonicalTitle.toLowerCase().includes(w))
          );

      if (matched) {
        // Synthesize 10 comprehensive articles across major outlets
        const existingArticles = matched.articles || [];
        const synthesizedOutlets = TEN_MAJOR_OUTLETS.map((outletDef, idx) => {
          const found = existingArticles.find(
            (a) => a.outlet.toLowerCase() === outletDef.name.toLowerCase()
          );
          if (found) {
            return {
              name: found.outlet,
              language: found.language,
              headline: found.title,
              scoreGov: outletDef.lean,
              loadedPhrases: [],
              axes: {
                gov: outletDef.lean,
                cul: 50 + ((idx * 7) % 25) - 12,
                fed: 48 + ((idx * 11) % 20) - 10,
                eco: 50,
                cas: 50,
                ten: outletDef.lean < 30 || outletDef.lean > 70 ? 68 : 38,
              },
            };
          }

          // Generate realistic headline for the outlet
          let simulatedHeadline = "";
          if (isCjpTopic) {
            if (outletDef.lean > 65) {
              simulatedHeadline =
                outletDef.lang === "HI"
                  ? "नई दिल्ली में कानून-व्यवस्था सख्त: बिना इजाजत प्रदर्शन पर पुलिस का कड़ा पहरा"
                  : "Delhi Police foil unauthorized CJP rally at Janpath; 23,000 security forces deployed to maintain order";
            } else if (outletDef.lean < 45) {
              simulatedHeadline =
                outletDef.lang === "HI"
                  ? "वोटर लिस्ट में गड़बड़ियों के खिलाफ युवाओं का फूटा गुस्सा: धारा 144 और धरपकड़ पर उठे सवाल"
                  : "Throttling Peaceful Dissent: Why 23,000 CAPF and Metro Shutdowns Target CJP Electoral Roll Protest";
            } else {
              simulatedHeadline =
                outletDef.lang === "HI"
                  ? "चुनाव आयोग मुख्यालय के बाहर तनाव: सीजेपी कार्यकर्ताओं की हिरासत, सुरक्षा के कड़े इंतजाम"
                  : "CJP Protest Over SIR Electoral Rolls: Heavy Security Across Central Delhi as CEC Resignation Demanded";
            }
          } else {
            simulatedHeadline =
              outletDef.lang === "HI"
                ? `${matched.canonicalTitleHi || matched.canonicalTitle}: दृष्टिकोण एवं विश्लेषण`
                : `${outletDef.name} Report: ${matched.canonicalTitle}`;
          }

          return {
            name: outletDef.name,
            language: outletDef.lang,
            headline: simulatedHeadline,
            scoreGov: outletDef.lean,
            loadedPhrases: [],
            axes: {
              gov: outletDef.lean,
              cul: 50,
              fed: 50,
              eco: 50,
              cas: 50,
              ten: 45,
            },
          };
        });

        const fallbackAnalysis = {
          topic,
          canonicalTitle: matched.canonicalTitle,
          consensusSummary: matched.leadFact,
          divergenceSummary: matched.divergenceSummary,
          omissionEvidence: matched.omissionEvidence,
          omittedOutlets: matched.omittedOutlets,
          leftFraming: matched.br?.[0] || "Focuses on civil society questions, democratic dissent, and institutional accountability.",
          centreFraming: matched.br?.[1] || "Presents official proceedings, statutory timelines, and balanced stakeholder arguments.",
          rightFraming: matched.br?.[2] || "Foregrounds administrative compliance, public order, and governance stability.",
          outlets: synthesizedOutlets,
          perspectiveDossier: {
            keyQuestion: `Critically examine the contrasting media angles on "${matched.canonicalTitle}".`,
            framework: ["Press Council Guidelines", "Neutral Media Framework", "6-Axis Democratic Analysis"],
          },
        };

        return Response.json({
          success: true,
          cached: false,
          modelUsed: "offline-knowledge-base (emergency fallback)",
          fallbackOccurred: true,
          analysis: fallbackAnalysis,
        });
      }

      throw new Error(
        `Gemini models are under peak demand (${apiErr?.message || "High Demand"}). Please try again shortly.`
      );
    }

    const parsed = parseJsonObject(generatedText);

    // Ensure parsed has 10 outlets if Gemini returned fewer
    if (parsed.outlets && Array.isArray(parsed.outlets) && parsed.outlets.length < 10) {
      const existingNames = new Set(parsed.outlets.map((o: any) => o.name.toLowerCase()));
      TEN_MAJOR_OUTLETS.forEach((def) => {
        if (parsed.outlets.length < 10 && !existingNames.has(def.name.toLowerCase())) {
          parsed.outlets.push({
            name: def.name,
            language: def.lang,
            headline: `${def.name} Perspectives: ${parsed.canonicalTitle || topic}`,
            scoreGov: def.lean,
            loadedPhrases: [],
            axes: { gov: def.lean, cul: 50, fed: 50, eco: 50, cas: 50, ten: 45 },
          });
        }
      });
    }

    // Lint for banned pejorative labels
    const lintRes = lintAIOutput(parsed);
    if (!lintRes.isValid) {
      return Response.json(
        { error: `Output contained banned terms: ${lintRes.violations.join(", ")}` },
        { status: 422 }
      );
    }

    // 3. Save to DB Cache if Database is available
    if (db) {
      try {
        await db.insert(schema.topicAnalysesCache).values({
          id: `cache-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          topic,
          normalizedTopic,
          language,
          analysisData: parsed,
          modelUsed,
        });
      } catch (cacheErr) {
        console.warn("[DB Save Warning]:", cacheErr);
      }
    }

    return Response.json({
      success: true,
      cached: false,
      modelUsed,
      fallbackOccurred,
      analysis: parsed,
    });
  } catch (err: any) {
    console.error("[API Analyze Error]:", err);
    return Response.json({ error: err.message || "Failed to analyze topic" }, { status: 500 });
  }
}
