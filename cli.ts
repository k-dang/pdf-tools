import meow from "meow";
import { commands } from "./src/commands/index.js";

const cli = meow({
  description: "A CLI tool for splitting and merging PDFs",
  help: `
Usage
  $ pdf-tools <command> [options]

Commands
  split    Extract pages from a PDF
  merge    Merge multiple PDFs

Examples
  $ pdf-tools split document.pdf --pages 6-8
  $ pdf-tools merge file1.pdf file2.pdf --output combined.pdf
`,
  importMeta: import.meta,
});

const [command, ...subArgs] = cli.input;
const handler = commands[command as keyof typeof commands];

if (!handler) {
  cli.showHelp();
  process.exit(1);
}

const subCommandArgs = [...subArgs];
for (const [key, value] of Object.entries(cli.flags)) {
  if (value !== false && value !== undefined) {
    const flagName = key.length === 1 ? `-${key}` : `--${key}`;
    if (typeof value === "boolean") {
      subCommandArgs.push(flagName);
    } else {
      subCommandArgs.push(flagName, String(value));
    }
  }
}

handler.run(subCommandArgs);
