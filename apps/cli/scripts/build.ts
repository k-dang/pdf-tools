const shebang = "#!/usr/bin/env bun\n";

/** Packages to keep as external runtime deps for the TUI. */
const tuiExternals = ["@opentui/core", "@opentui/react", "react"];

/**
 * Build a single entrypoint to dist.
 */
const buildEntrypoint = async (
  entrypoint: string,
  label: string,
  external?: string[],
) => {
  const result = await Bun.build({
    entrypoints: [entrypoint],
    outdir: "./dist",
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

const cliResult = await buildEntrypoint("./cli.ts", "CLI");
const tuiResult = await buildEntrypoint("../tui/tui.tsx", "TUI", tuiExternals);

await addShebang("./dist/cli.js");
await addShebang("./dist/tui.js");

console.log("Build successful");

for (const output of [...cliResult.outputs, ...tuiResult.outputs]) {
  console.log(`  - ${output.path} (${(output.size / 1024).toFixed(2)} KB)`);
}
