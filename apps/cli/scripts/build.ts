const result = await Bun.build({
  entrypoints: ["./cli.ts"],
  outdir: "./dist",
  target: "bun",
  minify: true,
});

if (!result.success) {
  console.error("Build failed");
  for (const message of result.logs) {
    console.error(message);
  }
  process.exit(1);
}

const indexPath = "./dist/cli.js";
const content = await Bun.file(indexPath).text();
const shebang = "#!/usr/bin/env bun\n";
await Bun.write(indexPath, shebang + content);

console.log("Build successful");

for (const output of result.outputs) {
  console.log(`  - ${output.path} (${(output.size / 1024).toFixed(2)} KB)`);
}
