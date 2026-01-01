import meow from "meow";
import { basename, extname, join, dirname } from "path";
import { parsePageRange } from "../lib/parser.js";
import { splitPDF } from "../lib/pdf.js";

export const splitCommand = {
  run: async (args: string[]) => {
    const cli = meow(
      `
    Usage
      $ pdf-tools split <input-file> --pages <pages>

    Options
      --pages, -p    Page numbers or ranges (e.g., "6-8" or "1,3,5-8")
      --output, -o   Output filename (defaults to <input>_split.pdf)

    Examples
      $ pdf-tools split document.pdf --pages 6-8
      $ pdf-tools split document.pdf --pages "1,3,5-8" --output extracted.pdf
    `,
      {
        importMeta: import.meta,
        argv: args,
        flags: {
          pages: {
            type: "string",
            shortFlag: "p",
          },
          output: {
            type: "string",
            shortFlag: "o",
          },
        },
      }
    );

    const inputFile = cli.input[0];

    if (!inputFile) {
      cli.showHelp();
      process.exit(1);
    }

    if (!cli.flags.pages) {
      console.error("Error: --pages flag is required");
      cli.showHelp();
      process.exit(1);
    }

    try {
      const pages = parsePageRange(cli.flags.pages);

      let outputPath = cli.flags.output;
      if (!outputPath) {
        const inputDir = dirname(inputFile);
        const inputBase = basename(inputFile, extname(inputFile));
        outputPath = join(inputDir, `${inputBase}_split.pdf`);
      }

      await splitPDF(inputFile, outputPath, pages);
    } catch (error) {
      console.error(
        "Error:",
        error instanceof Error ? error.message : String(error)
      );
      process.exit(1);
    }
  },
};
