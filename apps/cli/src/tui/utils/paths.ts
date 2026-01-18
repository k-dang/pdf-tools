import { basename, extname, join } from "path";

/**
 * Generate output path for split PDF (e.g., "document_split.pdf")
 */
export function getSplitOutputPath(
  inputPath: string,
  outputDir: string = process.cwd()
): string {
  const base = basename(inputPath, extname(inputPath));
  return join(outputDir, `${base}_split.pdf`);
}

/**
 * Generate output path for merged PDF
 */
export function getMergeOutputPath(outputDir: string = process.cwd()): string {
  return join(outputDir, "merged.pdf");
}
