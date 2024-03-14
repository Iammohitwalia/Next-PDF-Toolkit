import { ImageOrientations } from "./image-to-pdf";

export async function getImageOrientation(imageFile: File): Promise<ImageOrientations> {
  const bmpImage: ImageBitmap = await createImageBitmap(imageFile);
  const width: number = bmpImage.width;
  const height: number = bmpImage.height;
  bmpImage.close();

  if (width > height) {
    return "Landscape";
  } else {
    return "Portrait";
  }
}
