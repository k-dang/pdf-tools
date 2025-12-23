import { PDFDocument } from "pdf-lib";
import meow from "meow";
import { basename, extname, join, dirname } from "path";

/**
 * Parses a page range string into an array of page numbers (1-based).
 * Supports formats like:
 * - "6-8" -> [6, 7, 8]
 * - "1,3,5-8" -> [1, 3, 5, 6, 7, 8]
 * - "6" -> [6]
 */
function parsePageRange(pageRange: string): number[] {
  const pages: number[] = [];
  const parts = pageRange.split(",").map((p) => p.trim());

  for (const part of parts) {
    if (part.includes("-")) {
      const rangeParts = part.split("-");
      if (rangeParts.length !== 2 || !rangeParts[0] || !rangeParts[1]) {
        throw new Error(`Invalid page range: ${part}`);
      }
      const start = parseInt(rangeParts[0].trim(), 10);
      const end = parseInt(rangeParts[1].trim(), 10);
      if (isNaN(start) || isNaN(end) || start > end) {
        throw new Error(`Invalid page range: ${part}`);
      }
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    } else {
      const page = parseInt(part, 10);
      if (isNaN(page)) {
        throw new Error(`Invalid page number: ${part}`);
      }
      pages.push(page);
    }
  }

  // Remove duplicates and sort
  return [...new Set(pages)].sort((a, b) => a - b);
}

/**
 * Splits a PDF file by extracting specified pages into a new PDF.
 */
async function splitPDF(
  inputPath: string,
  outputPath: string,
  pages: number[]
): Promise<void> {
  const file = Bun.file(inputPath);
  const existingPdfBytes = await file.arrayBuffer();

  // Load the PDF document
  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const totalPages = pdfDoc.getPageCount();

  // Validate page numbers
  for (const pageNum of pages) {
    if (pageNum < 1 || pageNum > totalPages) {
      throw new Error(
        `Page ${pageNum} is out of range. PDF has ${totalPages} pages.`
      );
    }
  }

  // Create a new PDF document
  const newPdfDoc = await PDFDocument.create();

  // Copy the specified pages from the original document to the new document
  // pdf-lib uses 0-based indexing, so subtract 1 from page numbers
  const pageIndices = pages.map((p) => p - 1);
  const copiedPages = await newPdfDoc.copyPages(pdfDoc, pageIndices);

  for (const page of copiedPages) {
    newPdfDoc.addPage(page);
  }

  // Serialize the new PDF document to bytes
  const pdfBytes = await newPdfDoc.save();

  await Bun.write(outputPath, pdfBytes);
  console.log(
    `✓ Successfully extracted ${pages.length} page(s) to ${outputPath}`
  );
}

const cli = meow(
  `
  Usage
    $ bun run index.ts <input-file> --pages <pages>

  Options
    --pages, -p    Page numbers or ranges (e.g., "6-8" or "1,3,5-8")
    --output, -o   Output filename (defaults to <input>_split.pdf)

  Examples
    $ bun run index.ts document.pdf --pages 6-8
    $ bun run index.ts document.pdf --pages "1,3,5-8" --output extracted.pdf
  `,
  {
    importMeta: import.meta,
    flags: {
      pages: {
        type: "string",
        shortFlag: "p",
        isRequired: true,
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
  // Parse page range
  const pages = parsePageRange(cli.flags.pages);

  // Determine output path
  let outputPath = cli.flags.output;
  if (!outputPath) {
    const inputDir = dirname(inputFile);
    const inputBase = basename(inputFile, extname(inputFile));
    outputPath = join(inputDir, `${inputBase}_split.pdf`);
  }

  // Split the PDF
  await splitPDF(inputFile, outputPath, pages);
} catch (error) {
  console.error(
    "Error:",
    error instanceof Error ? error.message : String(error)
  );
  process.exit(1);
}
