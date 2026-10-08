import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey });

async function check() {
  const models = [
    "gemini-3.8-flash",
    "gemini-3.5-flash",
    "gemini-3.1-pro-preview",
    "gemini-2.0-flash",
  ];

  for (const m of models) {
    try {
      const res = await ai.models.generateContent({
        model: m,
        contents: "Say hello in one word",
      });
      console.log(`Model [${m}]: SUCCESS ->`, res.text?.trim());
    } catch (err: any) {
      console.log(`Model [${m}]: ERROR ->`, err.message);
    }
  }
}

check();
