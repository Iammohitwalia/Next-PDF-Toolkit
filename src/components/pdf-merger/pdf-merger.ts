import { ProcessedFile } from "../models/processed-file";

interface PdfMergerState {
  UploadedFiles: ProcessedFile[];
  IsMergeComplete: boolean;
  MaxFilesAllowed: number;
  MaxSizeAllowed: number;
  FileTypeAllowed: string;
}

const initialPdfMergerState: PdfMergerState = {
  UploadedFiles: [],
  IsMergeComplete: false,
  MaxFilesAllowed: 20,
  MaxSizeAllowed: 20971520,
  FileTypeAllowed: "application/pdf"
};

export type { PdfMergerState };
export { initialPdfMergerState };
