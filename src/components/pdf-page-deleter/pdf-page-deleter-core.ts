import { PDFDocument } from "pdf-lib";

export function getPageNumbersToDelete(pagesToDelete: string): number[] {
  if (pagesToDelete.includes(",")) {
    const pageNumbersToDelete: number[] = [];
    for (let pageNumber of pagesToDelete.split(",")) {
      pageNumbersToDelete.push(parseInt(pageNumber) - 1);
    }
    return pageNumbersToDelete.sort();
  }

  if (pagesToDelete.includes("-")) {
    const pageNumbersToDelete: number[] = [];
    let firstPageNum: number = parseInt(pagesToDelete.split("-")[0]);
    let lastPageNum: number = parseInt(pagesToDelete.split("-")[1]);
    if (firstPageNum > lastPageNum) {
      [firstPageNum, lastPageNum] = [lastPageNum, firstPageNum];
    }
    for (let pageNumber: number = firstPageNum; pageNumber <= lastPageNum; pageNumber++) {
      pageNumbersToDelete.push(pageNumber - 1);
    }
    return pageNumbersToDelete;
  }

  return [parseInt(pagesToDelete) - 1];
}

export async function deletePagesFromPdf(pdf: ArrayBuffer, pageNumbersToDelete: number[]): Promise<string> {
  const finalPdfDoc: PDFDocument = await PDFDocument.load(pdf);

  let totalPagesDeleted: number = 0;
  for (let pageNumber of pageNumbersToDelete) {
    finalPdfDoc.removePage(pageNumber - totalPagesDeleted);
    totalPagesDeleted++;
  }

  return await finalPdfDoc.saveAsBase64({ dataUri: true });
}
