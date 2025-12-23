import { PDFDocument } from "pdf-lib";
import meow from "meow";

/**
 * Merges multiple PDF files into a single PDF document.
 */
async function mergePDFs(inputPaths: string[], outputPath: string): Promise<void> {
  const mergedPdfDoc = await PDFDocument.create();
  let totalPages = 0;

  for (const inputPath of inputPaths) {
    const file = Bun.file(inputPath);
    const existingPdfBytes = await file.arrayBuffer();

    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const copiedPages = await mergedPdfDoc.copyPages(pdfDoc, pdfDoc.getPageIndices());

    for (const page of copiedPages) {
      mergedPdfDoc.addPage(page);
    }

    totalPages += pdfDoc.getPageCount();
  }

  const pdfBytes = await mergedPdfDoc.save();
  await Bun.write(outputPath, pdfBytes);
  console.log(`✓ Successfully merged ${totalPages} page(s) from ${inputPaths.length} file(s) to ${outputPath}`);
}

const cli = meow(
  `
  Usage
    $ bun run merge.ts <file1.pdf> <file2.pdf> [file3.pdf ...]

  Options
    --output, -o   Output filename (defaults to merged.pdf)

  Examples
    $ bun run merge.ts document1.pdf document2.pdf
    $ bun run merge.pdf file1.pdf file2.pdf file3.pdf --output combined.pdf
  `,
  {
    importMeta: import.meta,
    flags: {
      output: {
        type: "string",
        shortFlag: "o",
      },
    },
  }
);

const inputFiles = cli.input;

if (inputFiles.length < 2) {
  console.error("Error: At least 2 PDF files are required to merge");
  cli.showHelp();
  process.exit(1);
}

try {
  const outputPath = cli.flags.output || "merged.pdf";
  await mergePDFs(inputFiles, outputPath);
} catch (error) {
  console.error(
    "Error:",
    error instanceof Error ? error.message : String(error)
  );
  process.exit(1);
}
