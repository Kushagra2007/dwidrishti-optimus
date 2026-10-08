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

export const FAST_MODEL = process.env.GEMINI_MODEL_FAST || "gemini-2.5-flash";
export const REASONING_MODEL = process.env.GEMINI_MODEL_REASONING || "gemini-2.5-pro";
export const EMBEDDING_MODEL = process.env.GEMINI_EMBEDDING_MODEL || "text-embedding-004";
