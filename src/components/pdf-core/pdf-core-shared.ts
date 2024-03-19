import { PDFDocument } from "pdf-lib";

export async function getTotalPagesFromPdf(pdf: ArrayBuffer): Promise<number> {
  const pdfDoc: PDFDocument = await PDFDocument.load(pdf);
  const totalPages: number = pdfDoc.getPageCount();
  await pdfDoc.flush();
  return totalPages;
}
