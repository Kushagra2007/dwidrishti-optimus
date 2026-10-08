/**
 * Hard cap of 50 words for stored and displayed article excerpts
 * Enforcing fair dealing under Section 52(1)(a) of Indian Copyright Act 1957.
 */
export function truncateTo50Words(text: string): string {
  if (!text) return "";
  const cleaned = text.replace(/\s+/g, " ").trim();
  const words = cleaned.split(" ");
  if (words.length <= 50) {
    return cleaned;
  }
  return words.slice(0, 50).join(" ") + "…";
}

/**
 * Checks word count
 */
export function countWords(text: string): number {
  if (!text) return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
}
