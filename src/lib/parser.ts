/**
 * Parses a page range string into an array of page numbers (1-based).
 * Supports formats like:
 * - "6-8" -> [6, 7, 8]
 * - "1,3,5-8" -> [1, 3, 5, 6, 7, 8]
 * - "6" -> [6]
 */
export function parsePageRange(pageRange: string): number[] {
  const pages: number[] = [];
  const parts = pageRange.split(",").map((p) => p.trim());

  for (const part of parts) {
    if (part.includes("-")) {
      const rangeParts = part.split("-");
      if (rangeParts.length !== 2 || !rangeParts[0] || !rangeParts[1]) {
        throw new Error(`Invalid page range: ${part}`);
      }
      const start = parseInt(rangeParts[0].trim(), 10);
      const end = parseInt(rangeParts[1].trim(), 10);
      if (isNaN(start) || isNaN(end) || start > end) {
        throw new Error(`Invalid page range: ${part}`);
      }
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    } else {
      const page = parseInt(part, 10);
      if (isNaN(page)) {
        throw new Error(`Invalid page number: ${part}`);
      }
      pages.push(page);
    }
  }

  return [...new Set(pages)].sort((a, b) => a - b);
}
