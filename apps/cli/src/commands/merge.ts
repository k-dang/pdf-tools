import { mergePDFs } from "@k-dang/utils";
import meow from "meow";
import { dirname, isAbsolute, join } from "path";

export const mergeCommand = {
  run: async (args: string[]) => {
    const cli = meow(
      `
    Usage
      $ pdf-tools merge <file1.pdf> <file2.pdf> [file3.pdf ...]

    Options
      --output, -o   Output filename (defaults to merged.pdf)

    Examples
      $ pdf-tools merge document1.pdf document2.pdf
      $ pdf-tools merge file1.pdf file2.pdf file3.pdf --output combined.pdf
    `,
      {
        importMeta: import.meta,
        argv: args,
        flags: {
          output: {
            type: "string",
            shortFlag: "o",
            default: "merged.pdf",
          },
        },
      },
    );

    const inputFiles = cli.input;

    if (inputFiles.length < 2) {
      console.error("Error: At least 2 PDF files are required to merge");
      cli.showHelp();
      process.exit(1);
    }

    try {
      let outputPath = (cli.flags.output as string) || "merged.pdf";

      const firstInputDir = dirname(inputFiles[0]!);
      if (!isAbsolute(outputPath)) {
        outputPath = join(firstInputDir, outputPath);
      }

      await mergePDFs(inputFiles, outputPath);
    } catch (error) {
      console.error(
        "Error:",
        error instanceof Error ? error.message : String(error),
      );
      process.exit(1);
    }
  },
};
