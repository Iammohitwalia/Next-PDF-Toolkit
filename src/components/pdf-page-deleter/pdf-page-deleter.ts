import { ProcessedFile } from "../models/processed-file";

export type PageDeleterValidatorState = "VALID" | "INVALID" | "CHECKING" | "EMPTY";

export interface PdfPageDeleterState {
  UploadedFile: ProcessedFile | null;
  TotalPages: number;
  PagesToDelete: string;
  PagesToDeleteInfo: string;
  PagesToDeleteValidator: PageDeleterValidatorState;
  TotalPagesToDelete: number;
  IsDeletionComplete: boolean;
  IsDeletionInitiated: boolean;
  MaxSizeAllowed: number;
  FileTypeAllowed: string;
}

export const initialPdfPageDeleterState: PdfPageDeleterState = {
  UploadedFile: null,
  TotalPages: 0,
  PagesToDelete: "",
  PagesToDeleteInfo: "(Examples: 2, 1-2, 5-9, etc.)",
  PagesToDeleteValidator: "EMPTY",
  TotalPagesToDelete: 0,
  IsDeletionComplete: false,
  IsDeletionInitiated: false,
  MaxSizeAllowed: 20971520,
  FileTypeAllowed: "application/pdf"
};
