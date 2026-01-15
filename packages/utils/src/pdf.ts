import { PDFDocument } from "pdf-lib";

/**
 * Get the number of pages in a PDF file
 */
export async function getPageCount(filePath: string): Promise<number> {
  const bytes = await Bun.file(filePath).arrayBuffer();
  const pdf = await PDFDocument.load(bytes);
  return pdf.getPageCount();
}

export async function splitPDF(
  inputPath: string,
  outputPath: string,
  pages: number[],
): Promise<void> {
  const file = Bun.file(inputPath);
  const existingPdfBytes = await file.arrayBuffer();

  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const totalPages = pdfDoc.getPageCount();

  for (const pageNum of pages) {
    if (pageNum < 1 || pageNum > totalPages) {
      throw new Error(
        `Page ${pageNum} is out of range. PDF has ${totalPages} pages.`,
      );
    }
  }

  const newPdfDoc = await PDFDocument.create();

  const pageIndices = pages.map((p) => p - 1);
  const copiedPages = await newPdfDoc.copyPages(pdfDoc, pageIndices);

  for (const page of copiedPages) {
    newPdfDoc.addPage(page);
  }

  const pdfBytes = await newPdfDoc.save();

  await Bun.write(outputPath, pdfBytes);
  console.log(
    `✓ Successfully extracted ${pages.length} page(s) to ${outputPath}`,
  );
}

export async function mergePDFs(
  inputPaths: string[],
  outputPath: string,
): Promise<void> {
  const mergedPdfDoc = await PDFDocument.create();
  let totalPages = 0;

  for (const inputPath of inputPaths) {
    const file = Bun.file(inputPath);
    const existingPdfBytes = await file.arrayBuffer();

    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const copiedPages = await mergedPdfDoc.copyPages(
      pdfDoc,
      pdfDoc.getPageIndices(),
    );

    for (const page of copiedPages) {
      mergedPdfDoc.addPage(page);
    }

    totalPages += pdfDoc.getPageCount();
  }

  const pdfBytes = await mergedPdfDoc.save();
  await Bun.write(outputPath, pdfBytes);
  console.log(
    `✓ Successfully merged ${totalPages} page(s) from ${inputPaths.length} file(s) to ${outputPath}`,
  );
}
