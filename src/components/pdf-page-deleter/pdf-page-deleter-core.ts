import { PDFDocument } from "pdf-lib";

export async function getTotalPagesFromPdf(pdf: ArrayBuffer): Promise<number> {
  const pdfDoc: PDFDocument = await PDFDocument.load(pdf);
  return pdfDoc.getPageCount();
}

export function getPageNumbersToDelete(pagesToDelete: string): number[] {
  if (pagesToDelete.includes(",")) {
    const pageNumbersToDelete: number[] = [];
    for (let pageNumber of pagesToDelete.split(",")) {
      pageNumbersToDelete.push(parseInt(pageNumber));
    }
    return pageNumbersToDelete.sort();
  }

  if (pagesToDelete.includes("-")) {
    const pageNumbersToDelete: number[] = [];
    const pageNumbers: string[] = pagesToDelete.split("-");
    for (let pageNumber: number = parseInt(pageNumbers[0]); pageNumber <= parseInt(pageNumbers[1]); pageNumber++) {
      pageNumbersToDelete.push(pageNumber);
    }
    return pageNumbersToDelete.sort();
  }

  return [parseInt(pagesToDelete)];
}

export async function deletePagesFromPdf(pdf: ArrayBuffer, pageNumbersToDelete: number[]): Promise<string> {
  const finalPdfDoc: PDFDocument = await PDFDocument.load(pdf);

  let totalPagesDeleted: number = 0;
  for (let pageNumber of pageNumbersToDelete) {
    finalPdfDoc.removePage(pageNumber - 1 - totalPagesDeleted);
    totalPagesDeleted++;
  }

  return await finalPdfDoc.saveAsBase64({ dataUri: true });
}
