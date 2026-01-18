import { readdirSync, statSync } from "fs";
import { join, dirname, parse } from "path";

/**
 * List all PDF files in the specified directory
 */
export function listPdfFiles(directory: string = process.cwd()): string[] {
  try {
    const files = readdirSync(directory);
    return files
      .filter((f) => f.toLowerCase().endsWith(".pdf"))
      .sort();
  } catch {
    return [];
  }
}

/**
 * List all subdirectories in the specified directory
 */
export function listDirectories(directory: string = process.cwd()): string[] {
  try {
    const entries = readdirSync(directory);
    return entries
      .filter((entry) => {
        try {
          const fullPath = join(directory, entry);
          return statSync(fullPath).isDirectory();
        } catch {
          return false;
        }
      })
      .sort();
  } catch {
    return [];
  }
}

/**
 * Get the parent directory path
 */
export function getParentDirectory(directory: string): string {
  return dirname(directory);
}

/**
 * Check if we're at the filesystem root
 */
export function isAtRoot(directory: string): boolean {
  const parsed = parse(directory);
  return parsed.dir === "" || directory === parsed.root;
}
