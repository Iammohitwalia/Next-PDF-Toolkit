import { ProcessedFile } from "../models/processed-file";

interface PdfPageDelState {
  UploadedFile: ProcessedFile | null;
  TotalPages: number;
  PageNo: string;
  TotalPagesToDelete: number;
  IsDeletionComplete: boolean;
  IsDeletionInitiated: boolean;
  MaxSizeAllowed: number;
  FileTypeAllowed: string;
}

const initialPdfPageDelState: PdfPageDelState = {
  UploadedFile: null,
  TotalPages: 0,
  PageNo: "",
  TotalPagesToDelete: 0,
  IsDeletionComplete: false,
  IsDeletionInitiated: false,
  MaxSizeAllowed: 20971520,
  FileTypeAllowed: "application/pdf"
};

export type { PdfPageDelState };
export { initialPdfPageDelState };
