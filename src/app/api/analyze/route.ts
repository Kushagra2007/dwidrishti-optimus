import { GoogleGenAI } from "@google/genai";
import { lintAIOutput } from "@/lib/linter";

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

export async function POST(req: Request) {
  try {
    const { topic, language = "en" } = await req.json();

    if (!topic || typeof topic !== "string") {
      return Response.json({ error: "Topic is required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return Response.json({ error: "Gemini API key is not configured" }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `You are the lead analytical engine of Dwi Drishti News (द्वि दृष्टि), an automated media perspective and framing analysis platform for India.
Analyze the contemporary Indian media coverage regarding the topic: "${topic}".

STRICT NON-NEGOTIABLE RULES:
1. Never use pejorative labels like 'fake news', 'propaganda', 'godi media', 'corrupt', 'lapdog', or 'dalal'. All metrics must be neutral and data-driven.
2. Formulate realistic editorial perspectives from two divergent sides:
   - Perspective A: Establishment / Governance / Executive administrative focus
   - Perspective B: Critical Scrutiny / Opposition / Grassroots civil society focus
3. Calculate framing on the six India-specific axes:
   - Government Alignment [-1.0 (Critical) to +1.0 (Supportive)]
   - Cultural/Ideological Framing [-1.0 (Secular/Plural) to +1.0 (Majoritarian)]
   - Federal Orientation [-1.0 (State Autonomy) to +1.0 (Centralized)]
   - Socio-Economic Gaze [-1.0 (Labor/Agrarian) to +1.0 (Corporate/Market)]
   - Social Justice [-1.0 (Subaltern) to +1.0 (Caste-blind)]
   - Journalistic Tenor [-1.0 (Empirical) to +1.0 (Sensational)]
4. Identify a key omission fact that one side foregrounds while the other omits.
5. Provide a 150-word balanced Perspective Prep practice question for civil service aspirants.
6. Target language for output: ${language}.

Return exactly one JSON object with these fields: topic, canonicalTitle, consensusSummary,
divergenceSummary, omissionEvidence (strings), omittedOutlets (array of strings), outlets
(array of objects with name, language, headline, scoreGov from 0 to 100, loadedPhrases as
objects with text and polarity [favourable or critical], and axes with gov, cul, fed, eco, cas,
and ten numeric scores from 0 to 100), and examBrief (object with question as a string and
framework as an array of strings). Use valid JSON syntax with double-quoted keys and string
values. Do not add markdown, commentary, or a second JSON object after the result.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.1,
      },
    });

    const parsed = parseJsonObject(response.text || "");

    // Lint for banned pejorative labels
    const lintRes = lintAIOutput(parsed);
    if (!lintRes.isValid) {
      return Response.json(
        { error: `Output contained banned terms: ${lintRes.violations.join(", ")}` },
        { status: 422 }
      );
    }

    return Response.json({
      success: true,
      modelUsed: "gemini-3.5-flash",
      analysis: parsed,
    });
  } catch (err: any) {
    console.error("[API Analyze Error]:", err);
    return Response.json({ error: err.message || "Failed to analyze topic" }, { status: 500 });
  }
}
