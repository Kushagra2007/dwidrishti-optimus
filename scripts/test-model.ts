import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey });

async function check() {
  const models = [
    "gemini-3.1-pro-preview",
    "gemini-3.5-pro",
  ];

  for (const m of models) {
    try {
      const res = await ai.models.generateContent({
        model: m,
        contents: "Say hello in one word",
      });
      console.log(`Model [${m}]: SUCCESS ->`, res.text?.trim());
    } catch (err: any) {
      console.log(`Model [${m}]: ERROR ->`, err.message?.slice(0, 80));
    }
  }
}

check();
