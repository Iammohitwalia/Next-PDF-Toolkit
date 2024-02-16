import { configureStore } from "@reduxjs/toolkit";
import pdfCoreReducer from "@/lib/redux-features/pdf-core/pdf-core-slice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      pdfCore: pdfCoreReducer
    }
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
