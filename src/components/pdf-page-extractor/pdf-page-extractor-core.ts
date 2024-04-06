import { PDFDocument, PDFPage } from "pdf-lib";

function getPageNumbersToExtract(pagesToExtract: string): number[] {
  if (pagesToExtract.includes(",")) {
    const pageNumbersToExtract: number[] = [];
    for (let pageNumber of pagesToExtract.split(",")) {
      pageNumbersToExtract.push(parseInt(pageNumber) - 1);
    }
    return pageNumbersToExtract.sort();
  }

  if (pagesToExtract.includes("-")) {
    const pageNumbersToExtract: number[] = [];
    let firstPageNum: number = parseInt(pagesToExtract.split("-")[0]);
    let lastPageNum: number = parseInt(pagesToExtract.split("-")[1]);
    if (firstPageNum > lastPageNum) {
      [firstPageNum, lastPageNum] = [lastPageNum, firstPageNum];
    }
    for (let pageNumber: number = firstPageNum; pageNumber <= lastPageNum; pageNumber++) {
      pageNumbersToExtract.push(pageNumber - 1);
    }
    return pageNumbersToExtract;
  }

  return [parseInt(pagesToExtract) - 1];
}

export async function extractPagesFromPdf(pdf: ArrayBuffer, pagesToExtract: string): Promise<string> {
  const finalPdfDoc: PDFDocument = await PDFDocument.create();
  const sourcePdfDoc: PDFDocument = await PDFDocument.load(pdf);

  const pageNumbersToExtract: number[] = getPageNumbersToExtract(pagesToExtract);
  const copiedPages: PDFPage[] = await finalPdfDoc.copyPages(sourcePdfDoc, pageNumbersToExtract);
  copiedPages.forEach((page) => finalPdfDoc.addPage(page));

  return await finalPdfDoc.saveAsBase64({ dataUri: true });
}
