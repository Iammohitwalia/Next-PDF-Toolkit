import { ProcessedFile } from "../models/processed-file";

export interface ImageToPdfState {
  UploadedFile: ProcessedFile | null;
  IsConversionComplete: boolean;
  IsConversionInitiated: boolean;
  MaxSizeAllowed: number;
  FileTypesAllowed: string[];
}

export const initialImageToPdfState: ImageToPdfState = {
  UploadedFile: null,
  IsConversionComplete: false,
  IsConversionInitiated: false,
  MaxSizeAllowed: 20971520,
  FileTypesAllowed: ["image/png", "image/jpg", "image/jpeg", "image/svg+xml"]
};
