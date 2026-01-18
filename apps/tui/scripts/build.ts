#!/usr/bin/env bun
import { $ } from "bun";
import { chmodSync, mkdirSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dir = join(__dirname, "..");

process.chdir(dir);

const distDir = join(process.cwd(), "dist");
const distPath = join(distDir, "tui.js");

console.log("📦 Building TUI package...");
rmSync(distDir, { recursive: true, force: true });
mkdirSync(distDir, { recursive: true });

await $`bun build tui.tsx --outdir dist --target bun --format esm --sourcemap --minify --external @opentui/core --external @opentui/react --external react`;

const content = await Bun.file(distPath).text();
const shebang = "#!/usr/bin/env bun\n";
const withShebang = content.startsWith(shebang) ? content : `${shebang}${content}`;
await Bun.write(distPath, withShebang);

try {
  chmodSync(distPath, 0o755);
} catch {
  // Ignore on Windows.
}

console.log("✓ Build complete: dist/tui.js");
