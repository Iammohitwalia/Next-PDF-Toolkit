import { ProcessedFile } from "../models/processed-file";

interface PdfMergerState {
  UploadedFiles: ProcessedFile[];
  IsMergeComplete: boolean;
  IsMergeInitiated: boolean;
  MaxFilesAllowed: number;
  MaxSizeAllowed: number;
  FileTypeAllowed: string;
}

const initialPdfMergerState: PdfMergerState = {
  UploadedFiles: [],
  IsMergeComplete: false,
  IsMergeInitiated: false,
  MaxFilesAllowed: 20,
  MaxSizeAllowed: 20971520,
  FileTypeAllowed: "application/pdf"
};

export type { PdfMergerState };
export { initialPdfMergerState };
