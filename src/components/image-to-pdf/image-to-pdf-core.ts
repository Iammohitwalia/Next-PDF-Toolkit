import { PDFDocument, PDFImage, PDFPage } from "pdf-lib";
import { ProcessedFile } from "../models/processed-file";

export async function convertImageToPdf(imageFile: ProcessedFile): Promise<string | null> {
  const finalPdfDoc: PDFDocument = await PDFDocument.create();
  const imageBuffer: ArrayBuffer = await imageFile.Content.arrayBuffer();
  const imageType: string = imageFile.Content.type;
  var embeddedImage: PDFImage | null = null;

  if (imageType.includes("png")) {
    embeddedImage = await finalPdfDoc.embedPng(imageBuffer);
  } else if (imageType.includes("jpg") || imageType.includes("jpeg")) {
    embeddedImage = await finalPdfDoc.embedJpg(imageBuffer);
  }

  if (embeddedImage !== null) {
    let page: PDFPage | null = null;

    // Width of an A4 Page in 72 DPI = 595 Pixels
    const refWidth: number = 595;
    // Width of an A4 Page in 96 DPI = 794 Pixels
    const refWidthAlt: number = 794;

    const imageRatio: number = embeddedImage.height / embeddedImage.width;
    // imageRatio > 1 => Portrait Image
    // imageRatio < 1 => Landscape Image

    if (imageRatio > 1) {
      if (embeddedImage.width > refWidth) {
        page = finalPdfDoc.addPage([refWidth, refWidth * imageRatio]);
        page.drawImage(embeddedImage, {
          width: refWidth,
          height: refWidth * imageRatio
        });
      } else {
        page = finalPdfDoc.addPage([embeddedImage.width, embeddedImage.height]);
        page.drawImage(embeddedImage);
      }
    } else {
      if (embeddedImage.width > refWidthAlt) {
        page = finalPdfDoc.addPage([refWidthAlt, refWidthAlt * imageRatio]);
        page.drawImage(embeddedImage, {
          width: refWidthAlt,
          height: refWidthAlt * imageRatio
        });
      } else {
        page = finalPdfDoc.addPage([embeddedImage.width, embeddedImage.height]);
        page.drawImage(embeddedImage);
      }
    }

    if (page !== null) {
      return await finalPdfDoc.saveAsBase64({ dataUri: true });
    } else {
      return null;
    }
  } else {
    return null;
  }
}
