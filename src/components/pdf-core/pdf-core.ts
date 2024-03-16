export interface PdfCoreState {
  IsUploadComplete: boolean;
  IsUploadInitiated: boolean;
  IsUploadFailed: boolean;
  UploadMessage: string;
  UploadErrorMessage: string;
  SubmitMessage: string;
  DownloadMessage: string;
  FinalPdfFilename: string;
  FinalPdfUrl: string;
}

export const initialPdfCoreState: PdfCoreState = {
  IsUploadComplete: false,
  IsUploadInitiated: false,
  IsUploadFailed: false,
  UploadMessage: "",
  UploadErrorMessage: "",
  SubmitMessage: "",
  DownloadMessage: "",
  FinalPdfFilename: "",
  FinalPdfUrl: ""
};
