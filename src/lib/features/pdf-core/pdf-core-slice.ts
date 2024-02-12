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

    setUploadMessage: (state, action: PayloadAction<string>) => {
      state.UploadMessage = action.payload;
    },

    setUploadErrorMessage: (state, action: PayloadAction<string>) => {
      state.UploadErrorMessage = action.payload;
    },

    refreshCoreState: (state) => {
      state.IsUploadComplete = false;
      state.IsUploadInitiated = true;
      state.UploadMessage = "";
      state.UploadErrorMessage = "";
      state.SubmitMessage = "";
      state.DownloadMessage = "";
      state.FinalPdfUrl = "";
    }
  }
});

export const { setIsUploadComplete, setIsUploadInitiated, setUploadMessage, setUploadErrorMessage, refreshCoreState } =
  pdfCoreSlice.actions;

export default pdfCoreSlice.reducer;
