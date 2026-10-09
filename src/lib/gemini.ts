import { GoogleGenAI } from "@google/genai";

let genaiClient: GoogleGenAI | null = null;

export function getGenAIClient(): GoogleGenAI {
  if (!genaiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured in environment variables.");
    }
    genaiClient = new GoogleGenAI({ apiKey });
  }
  return genaiClient;
}

export const FAST_MODEL = process.env.GEMINI_MODEL_FAST || "gemini-3.5-flash";
export const REASONING_MODEL = process.env.GEMINI_MODEL_REASONING || "gemini-3.5-flash";
export const EMBEDDING_MODEL = process.env.GEMINI_EMBEDDING_MODEL || "gemini-embedding-001";

// Resilient model cascade for peak-demand and 503/429 failover
export const MODEL_CASCADE = [
  FAST_MODEL,
  "gemini-3.8-flash",
  "gemini-3-flash-preview",
];

export async function generateContentWithFallback(
  ai: GoogleGenAI,
  contents: string,
  config?: any
): Promise<{ text: string; modelUsed: string; fallbackOccurred: boolean }> {
  let lastError: any = null;

  for (let i = 0; i < MODEL_CASCADE.length; i++) {
    const model = MODEL_CASCADE[i];
    try {
      if (i > 0) {
        console.warn(`[Gemini Resilience] Trying fallback candidate model: ${model}`);
        await new Promise((r) => setTimeout(r, 600));
      }

      const response = await ai.models.generateContent({
        model,
        contents,
        config,
      });

      return {
        text: response.text || "",
        modelUsed: model,
        fallbackOccurred: i > 0,
      };
    } catch (err: any) {
      lastError = err;
      console.warn(
        `[Gemini Resilience] Model [${model}] failed (${err?.status || err?.message?.slice(0, 80)}). Moving to next candidate.`
      );
    }
  }

  throw lastError || new Error("All candidate Gemini models are currently busy.");
}
