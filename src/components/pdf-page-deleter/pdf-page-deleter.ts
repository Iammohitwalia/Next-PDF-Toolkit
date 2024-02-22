import { ProcessedFile } from "../models/processed-file";

interface PdfPageDelState {
  UploadedFile: ProcessedFile | null;
  TotalPages: number;
  PagesToDelete: string;
  PagesToDeleteInfo: string;
  PagesToDeleteValidator: "valid" | "invalid" | "checking" | "empty";
  TotalPagesToDelete: number;
  IsDeletionComplete: boolean;
  IsDeletionInitiated: boolean;
  MaxSizeAllowed: number;
  FileTypeAllowed: string;
}

const initialPdfPageDelState: PdfPageDelState = {
  UploadedFile: null,
  TotalPages: 0,
  PagesToDelete: "",
  PagesToDeleteInfo: "Enter the page no. (e.g. 4) or the range of page nos. (e.g. 4-7):",
  PagesToDeleteValidator: "empty",
  TotalPagesToDelete: 0,
  IsDeletionComplete: false,
  IsDeletionInitiated: false,
  MaxSizeAllowed: 20971520,
  FileTypeAllowed: "application/pdf"
};

export type { PdfPageDelState };
export { initialPdfPageDelState };
