import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initialPdfCoreState } from "@/components/pdf-core/pdf-core";

export const pdfCoreSlice = createSlice({
  name: "pdfCore",
  initialState: initialPdfCoreState,
  reducers: {
    setIsUploadComplete: (state, action: PayloadAction<boolean>) => {
      state.IsUploadComplete = action.payload;
    },

    setIsUploadInitiated: (state, action: PayloadAction<boolean>) => {
      state.IsUploadInitiated = action.payload;
    },

    setIsUploadFailed: (state, action: PayloadAction<boolean>) => {
      state.IsUploadFailed = action.payload;
    },

    setUploadMessage: (state, action: PayloadAction<string>) => {
      state.UploadMessage = action.payload;
    },

    setUploadErrorMessage: (state, action: PayloadAction<string>) => {
      state.UploadErrorMessage = action.payload;
    },

    setSubmitMessage: (state, action: PayloadAction<string>) => {
      state.SubmitMessage = action.payload;
    },

    setDownloadMessage: (state, action: PayloadAction<string>) => {
      state.DownloadMessage = action.payload;
    },

    setFinalPdfUrl: (state, action: PayloadAction<{ PdfFilename: string; PdfUrl: string }>) => {
      state.FinalPdfFilename = action.payload.PdfFilename;
      state.FinalPdfUrl = action.payload.PdfUrl;
    },

    refreshCoreState: (state) => {
      state.IsUploadComplete = false;
      state.IsUploadInitiated = false;
      state.IsUploadFailed = false;
      state.UploadMessage = "";
      state.UploadErrorMessage = "";
      state.SubmitMessage = "";
      state.DownloadMessage = "";
      state.FinalPdfUrl = "";
    }
  }
});

export const {
  setIsUploadComplete,
  setIsUploadInitiated,
  setIsUploadFailed,
  setUploadMessage,
  setUploadErrorMessage,
  setSubmitMessage,
  setDownloadMessage,
  setFinalPdfUrl,
  refreshCoreState
} = pdfCoreSlice.actions;

export default pdfCoreSlice.reducer;
