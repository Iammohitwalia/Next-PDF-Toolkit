import { PDFDocument } from "pdf-lib-plus-encrypt";

export async function encryptPdf(pdf: ArrayBuffer, password: string): Promise<string> {
  const finalPdfDoc: PDFDocument = await PDFDocument.load(pdf);

  await finalPdfDoc.encrypt({
    userPassword: password,
    permissions: {
      modifying: true,
      printing: true,
      annotating: true,
      copying: true,
      fillingForms: true,
      contentAccessibility: true
    }
  });

  return await finalPdfDoc.saveAsBase64({ dataUri: true });
}
