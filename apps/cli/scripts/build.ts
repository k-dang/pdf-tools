import { rename } from "node:fs/promises";
import { basename, join } from "node:path";

const shebang = "#!/usr/bin/env bun\n";

/** Packages to keep as external runtime deps for the TUI. */
const tuiExternals = ["@opentui/core", "@opentui/react", "react"];

/**
 * Build a single entrypoint to dist.
 */
const buildEntrypoint = async (
  entrypoint: string,
  label: string,
  outdir: string,
  external?: string[],
) => {
  const result = await Bun.build({
    entrypoints: [entrypoint],
    outdir,
    target: "bun",
    format: "esm",
    minify: true,
    external,
  });

  if (!result.success) {
    console.error(`${label} build failed`);
    for (const message of result.logs) {
      console.error(message);
    }
    process.exit(1);
  }

  return result;
};

/**
 * Ensure bun shebang for executable entrypoints.
 */
const addShebang = async (path: string) => {
  const content = await Bun.file(path).text();
  if (!content.startsWith(shebang)) {
    await Bun.write(path, shebang + content);
  }
};

const distDir = join(import.meta.dir, "..", "dist");
const cliEntrypoint = join(import.meta.dir, "..", "cli.ts");
const tuiEntrypoint = join(import.meta.dir, "..", "src", "tui", "index.tsx");
const cliOutput = join(distDir, "cli.js");
const tuiOutput = join(distDir, "tui.js");

const cliResult = await buildEntrypoint(cliEntrypoint, "CLI", distDir);
const tuiResult = await buildEntrypoint(
  tuiEntrypoint,
  "TUI",
  distDir,
  tuiExternals,
);

const tuiBuiltOutput = tuiResult.outputs.find((output) =>
  output.path.endsWith(".js"),
);
if (!tuiBuiltOutput) {
  console.error("TUI build produced no JS output");
  process.exit(1);
}

const originalTuiPath = tuiBuiltOutput.path;

if (basename(tuiBuiltOutput.path) !== "tui.js") {
  await rename(tuiBuiltOutput.path, tuiOutput);
}

await addShebang(cliOutput);
await addShebang(tuiOutput);

console.log("Build successful");

for (const output of [...cliResult.outputs, ...tuiResult.outputs]) {
  const outputPath = output.path === originalTuiPath ? tuiOutput : output.path;
  const outputSize =
    output.path === originalTuiPath ? Bun.file(tuiOutput).size : output.size;
  console.log(`  - ${outputPath} (${(outputSize / 1024).toFixed(2)} KB)`);
}
