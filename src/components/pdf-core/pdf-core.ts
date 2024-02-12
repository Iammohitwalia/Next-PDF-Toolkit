interface PdfCoreState {
  IsUploadComplete: boolean;
  IsUploadInitiated: boolean;
  UploadMessage: string;
  UploadErrorMessage: string;
  SubmitMessage: string;
  DownloadMessage: string;
  OutputFormat: string;
  FinalPdfUrl: string;
}

const initialPdfCoreState: PdfCoreState = {
  IsUploadComplete: false,
  IsUploadInitiated: false,
  UploadMessage: "",
  UploadErrorMessage: "",
  SubmitMessage: "",
  DownloadMessage: "",
  OutputFormat: "data:application/pdf;base64,",
  FinalPdfUrl: ""
};

export type { PdfCoreState };
export { initialPdfCoreState };
