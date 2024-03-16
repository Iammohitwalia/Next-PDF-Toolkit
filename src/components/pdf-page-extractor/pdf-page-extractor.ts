import { ProcessedFile } from "../models/processed-file";

export type PageExtractorValidatorState = "VALID" | "INVALID" | "CHECKING" | "EMPTY";

export interface PdfPageExtractorState {
  UploadedFile: ProcessedFile | null;
  TotalPages: number;
  PagesToExtract: string;
  PagesToExtractInfo: string;
  PagesToExtractValidator: PageExtractorValidatorState;
  TotalPagesToExtract: number;
  IsExtractionComplete: boolean;
  IsExtractionInitiated: boolean;
  MaxSizeAllowed: number;
  FileTypeAllowed: string;
}

export const initialPdfPageExtractorState: PdfPageExtractorState = {
  UploadedFile: null,
  TotalPages: 0,
  PagesToExtract: "",
  PagesToExtractInfo: "(Format/Examples: 2 or 3,7 or 15-30)",
  PagesToExtractValidator: "EMPTY",
  TotalPagesToExtract: 0,
  IsExtractionComplete: false,
  IsExtractionInitiated: false,
  MaxSizeAllowed: 20971520,
  FileTypeAllowed: "application/pdf"
};
