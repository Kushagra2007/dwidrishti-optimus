import { getGenAIClient, EMBEDDING_MODEL } from "./gemini";

export async function generateEmbedding(text: string): Promise<number[]> {
  const client = getGenAIClient();
  const response = await client.models.embedContent({
    model: EMBEDDING_MODEL,
    contents: text,
  });

  const values = (response as any).embedding?.values || response.embeddings?.[0]?.values;
  if (!values) {
    throw new Error("Failed to generate embedding vector from Gemini API.");
  }

  return values;
}

export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) {
    throw new Error("Vector dimensions mismatch for cosine similarity.");
  }
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}
