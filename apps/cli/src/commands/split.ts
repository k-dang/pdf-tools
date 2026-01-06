import { parsePageRange, splitPDF } from "@pdf-tools/utils";
import meow from "meow";
import { basename, dirname, extname, isAbsolute, join } from "path";

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
      },
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

      const inputDir = dirname(inputFile);
      const inputBase = basename(inputFile, extname(inputFile));

      let outputPath = cli.flags.output || `${inputBase}_split.pdf`;
      if (!isAbsolute(outputPath)) {
        outputPath = join(inputDir, outputPath);
      }

      await splitPDF(inputFile, outputPath, pages);
    } catch (error) {
      console.error(
        "Error:",
        error instanceof Error ? error.message : String(error),
      );
      process.exit(1);
    }
  },
};
