#!/usr/bin/env bun

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

console.log(`Publishing @k-dang/pdf-tools-tui v${VERSION}\n`);

console.log("Step 1: Building all platform binaries...");
await $`bun run scripts/build.ts`;

console.log("\nStep 2: Setting executable permissions for Unix binaries...");
const platforms = [
  "pdf-tools-tui-darwin-arm64",
  "pdf-tools-tui-darwin-x64",
  "pdf-tools-tui-linux-arm64",
  "pdf-tools-tui-linux-x64",
];

for (const platform of platforms) {
  const binPath = path.join(dir, "dist", platform);
  if (fs.existsSync(binPath)) {
    await $`chmod +x ${binPath}`;
  }
}

console.log("\nStep 3: Packaging...");
await $`bun pm pack`;

console.log("\nStep 4: Publishing to npm...");
await $`npm publish --access public`;

console.log(`\n✓ Successfully published @k-dang/pdf-tools-tui v${VERSION}`);
