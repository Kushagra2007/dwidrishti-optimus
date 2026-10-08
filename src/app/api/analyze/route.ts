import { GoogleGenAI } from "@google/genai";
import { lintAIOutput } from "@/lib/linter";

export const dynamic = "force-dynamic";

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

Respond strictly with valid JSON conforming to this schema:
{
  "topic": "${topic}",
  "canonicalTitle": string,
  "consensusSummary": string,
  "divergenceSummary": string,
  "omissionEvidence": string,
  "omittedOutlets": string[],
  "outlets": [
    {
      "name": string,
      "language": string,
      "headline": string,
      "scoreGov": number (0 to 100),
      "loadedPhrases": [{ "text": string, "polarity": "favourable" | "critical" }],
      "axes": {
        "gov": number (0 to 100),
        "cul": number (0 to 100),
        "fed": number (0 to 100),
        "eco": number (0 to 100),
        "cas": number (0 to 100),
        "ten": number (0 to 100)
      }
    }
  ],
  "examBrief": {
    "question": string,
    "framework": string[]
  }
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.1,
      },
    });

    const parsed = JSON.parse(response.text || "{}");

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
