import { $ } from "bun";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dir = path.resolve(__dirname, "..");

process.chdir(dir);

import pkg from "../package.json";

const VERSION = pkg.version;

const targets = [
  "bun-darwin-arm64",
  "bun-darwin-x64",
  "bun-linux-x64",
  "bun-linux-arm64",
  "bun-windows-x64",
] as const;

const outputNames: Record<(typeof targets)[number], string> = {
  "bun-darwin-arm64": "pdf-tools-tui-darwin-arm64",
  "bun-darwin-x64": "pdf-tools-tui-darwin-x64",
  "bun-linux-x64": "pdf-tools-tui-linux-x64",
  "bun-linux-arm64": "pdf-tools-tui-linux-arm64",
  "bun-windows-x64": "pdf-tools-tui-windows-x64.exe",
};

console.log("Installing opentui for all platforms...");
const opentuiCoreVersion = pkg.dependencies["@opentui/core"];
const opentuiReactVersion = pkg.dependencies["@opentui/react"];

await $`bun install --os="*" --cpu="*" @opentui/core@${opentuiCoreVersion}`;
await $`bun install --os="*" --cpu="*" @opentui/react@${opentuiReactVersion}`;
console.log("Done installing opentui for all platforms");

await $`rm -rf dist`;
await $`mkdir -p dist`;

for (const target of targets) {
  const outfile = `dist/${outputNames[target]}`;
  console.log(`Building ${target} -> ${outfile} (v${VERSION})`);

  const result = await Bun.build({
    entrypoints: ["./tui.tsx"],
    target: "bun",
    define: {
      __VERSION__: JSON.stringify(VERSION),
    },
    compile: {
      target,
      outfile,
    },
  });

  if (!result.success) {
    console.error(`Build failed for ${target}:`, result.logs);
    process.exit(1);
  }

  console.log(`  ✓ Built ${outfile}`);
}

console.log("\nDone building all targets");
