import { PDFDocument, PDFPage } from "pdf-lib";
import { ProcessedFile } from "../models/processed-file";

export async function mergePdfs(pdfs: ProcessedFile[]): Promise<string> {
  const finalPdfDoc: PDFDocument = await PDFDocument.create();

  for (let pdf of pdfs) {
    const pdfDoc: PDFDocument = await PDFDocument.load(await pdf.Content.arrayBuffer());
    const copiedPages: PDFPage[] = await finalPdfDoc.copyPages(pdfDoc, pdfDoc.getPageIndices());
    copiedPages.forEach((page) => finalPdfDoc.addPage(page));
  }

  return await finalPdfDoc.saveAsBase64({ dataUri: true });
}
