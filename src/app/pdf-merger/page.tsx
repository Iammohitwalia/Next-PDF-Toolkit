"use client";

import FilePicker from "@/components/shared/file-picker";
import { CircularSpinner, CircularSpinnerLarge } from "@/components/shared/spinners";
import { delay } from "@/components/utils/utils";
import { ReactElement, useCallback, useEffect, useState } from "react";
import { ProcessedFile } from "@/components/models/processed-file";
import { useAppDispatch, useAppSelector, useAppStore } from "@/lib/redux-hooks";
import {
  refreshCoreState,
  setIsUploadComplete,
  setIsUploadInitiated,
  setSubmitMessage,
  setUploadErrorMessage,
  setUploadMessage
} from "@/lib/redux-features/pdf-core/pdf-core-slice";
import { PdfMergerState, initialPdfMergerState } from "@/components/pdf-merger/pdf-merger";

export default function PDFMerger(): ReactElement {
  const store = useAppStore();
  const dispatch = useAppDispatch();
  const pdfCoreState = useAppSelector((state) => state.pdfCore);

  const [loading, setLoading] = useState<boolean>(true);
  const [pdfMergerState, setPdfMergerState] = useState<PdfMergerState>(initialPdfMergerState);

  function refreshApp(): void {
    dispatch(refreshCoreState());
    setPdfMergerState(initialPdfMergerState);
  }
  /* 
    refreshAppCached() is a useCallback() or Cached version of refreshApp() 
    specifically made to be used within the useEffect() hook.
   */
  const refreshAppCached = useCallback(refreshApp, [dispatch]);

  useEffect(() => {
    refreshAppCached();
    setLoading(false);
  }, [refreshAppCached]);

  async function uploadFilesInitializer(files: FileList | null): Promise<void> {
    refreshApp();
    dispatch(setIsUploadInitiated(true));

    let processedFiles: ProcessedFile[] = [];
    if (files !== null) {
      for (let i: number = 0; i < files.length; i++) {
        if (files.item(i) !== null) {
          let newFile: File = files.item(i) as File;
          processedFiles = processedFiles.concat({ Id: i + 1, Content: newFile });
        }
      }
    }
    await delay(1500);

    setPdfMergerState((prev) => ({ ...prev, UploadedFiles: processedFiles }));
    if (processedFiles.length > 1) {
      dispatch(setUploadMessage(`${processedFiles.length} PDF files uploaded. ✅`));
    } else {
      dispatch(setUploadErrorMessage("Just 1 PDF file uploaded, which is not enough! You have to upload at least 2 files."));
    }
    dispatch(setIsUploadComplete(true));
  }

  function moveFileUp(file: ProcessedFile): void {
    const index: number = pdfMergerState.UploadedFiles.indexOf(file);
    let newFiles: ProcessedFile[] = [...pdfMergerState.UploadedFiles];
    newFiles.splice(index, 1);
    newFiles.splice(index - 1, 0, file);
    setPdfMergerState((prev) => ({ ...prev, UploadedFiles: newFiles }));
  }

  function moveFileDown(file: ProcessedFile): void {
    const index: number = pdfMergerState.UploadedFiles.indexOf(file);
    let newFiles: ProcessedFile[] = [...pdfMergerState.UploadedFiles];
    newFiles.splice(index, 1);
    newFiles.splice(index + 1, 0, file);
    setPdfMergerState((prev) => ({ ...prev, UploadedFiles: newFiles }));
  }

  function removeFile(file: ProcessedFile): void {
    const index: number = pdfMergerState.UploadedFiles.indexOf(file);
    let newFiles: ProcessedFile[] = [...pdfMergerState.UploadedFiles];
    newFiles.splice(index, 1);
    setPdfMergerState((prev) => ({ ...prev, UploadedFiles: newFiles }));

    if (newFiles.length > 1) {
      dispatch(setUploadMessage(`${newFiles.length} PDF files are left. ✅`));
    } else {
      dispatch(setUploadErrorMessage("Not enough PDF files left! At least 2 files are needed."));
    }
  }

  async function submitFiles(): Promise<void> {
    let submitMessage: string = `Merging ${pdfMergerState.UploadedFiles.length} PDF files... ⏳`;
    dispatch(setSubmitMessage(submitMessage));
    setPdfMergerState((prev) => ({ ...prev, IsMergeInitiated: true }));
    await delay(1500);
    setPdfMergerState((prev) => ({ ...prev, IsMergeComplete: true }));
  }

  async function downloadFile(): Promise<void> {}

  if (!loading && !pdfMergerState.IsMergeInitiated && !pdfMergerState.IsMergeComplete) {
    return (
      <>
        <main className="h-full flex flex-col justify-center items-center">
          <div className="h-[8rem] flex flex-col justify-center items-center text-center mt-14 max-sm:mt-5 mx-12 text-6xl max-sm:text-[2.5rem] font-sans">
            PDF Merger
          </div>
          <div className="h-[6rem] flex flex-col justify-center items-center mt-14 max-sm:-mt-6 text-[1.7rem] max-sm:text-[1.55rem] font-sans">
            <div>Upload your PDF files</div>
            <div className="mt-4 max-sm:mt-3 text-xl max-sm:text-[1.2rem]">Limit - 20 Files / 20 MB Each</div>
          </div>
          <FilePicker IsMultiple={true} FileType="application/pdf" UploadFiles={uploadFilesInitializer} />
          {pdfCoreState.IsUploadInitiated && !pdfCoreState.IsUploadComplete && (
            <div>
              <div className="flex justify-center items-center text-center mt-11 mb-8 max-sm:mt-9 max-sm:mb-7 text-[1.7rem] max-sm:text-[1.55rem] font-sans">
                Uploading your file(s)... ⏳
              </div>
              <CircularSpinner />
            </div>
          )}
          {pdfCoreState.IsUploadComplete && (
            <div>
              <div className="flex justify-center items-center text-center mt-11 mb-8 max-sm:mt-9 max-sm:mb-7 text-[1.7rem] max-sm:text-[1.55rem] font-sans">
                {pdfMergerState.UploadedFiles.length <= 1 ? (
                  <div>
                    <p className="px-10">{pdfCoreState.UploadErrorMessage}</p>
                    {pdfCoreState.UploadErrorMessage.length > 0 && <p className="mt-3 text-5xl max-sm:text-[2.2rem]">😕</p>}
                  </div>
                ) : (
                  <div>
                    <div className="mb-8 max-sm:mb-7">
                      <p className="px-10">{pdfCoreState.UploadMessage}</p>
                    </div>
                    <table className="flex justify-center items-center text-left table-fixed border-collapse mx-14 mb-8 max-sm:mb-7 text-[1.1rem]">
                      <tbody>
                        {pdfMergerState.UploadedFiles.map((file: ProcessedFile) => (
                          <tr key={file.Id}>
                            <td className="pb-[0.8rem] max-sm:pb-[0.65rem] text-center pr-1">{"●"}</td>
                            <td className="pb-[0.8rem] max-sm:pb-[0.65rem] pr-3 max-sm:pr-2">{file.Content!.name}</td>
                            <td className="max-sm:w-1/4 pb-[0.8rem] max-sm:pb-[0.65rem] text-center">
                              {pdfMergerState.UploadedFiles.indexOf(file) > 0 && (
                                <span
                                  className="px-2 hover:text-white cursor-pointer fa-solid fa-arrow-up"
                                  title="Move File Up"
                                  onClick={() => moveFileUp(file)}
                                ></span>
                              )}
                              {pdfMergerState.UploadedFiles.indexOf(file) < pdfMergerState.UploadedFiles.length - 1 && (
                                <span
                                  className="px-2 hover:text-white cursor-pointer fa-solid fa-arrow-down"
                                  title="Move File Down"
                                  onClick={() => moveFileDown(file)}
                                ></span>
                              )}
                              <span
                                className="px-2 hover:text-white cursor-pointer fa-solid fa-xmark"
                                title="Remove File"
                                onClick={() => removeFile(file)}
                              ></span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <button
                      className="text-3xl max-sm:text-2xl rounded-lg bg-[#05336E] hover:bg-[#04234D] hover:ring hover:ring-[#074DA6] text-gray-200 p-2 h-[4.5rem] w-52 max-sm:h-16 max-sm:w-40"
                      onClick={submitFiles}
                    >
                      <i className="fa-solid fa-circle-check mr-3"></i>Submit
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </>
    );
  }

  if (!loading && pdfMergerState.IsMergeInitiated && !pdfMergerState.IsMergeComplete) {
    return (
      <>
        <main className="h-screen flex flex-col justify-center items-center text-center">
          <div className="mb-8 max-sm:mb-5 mx-12 text-4xl max-sm:text-[1.8rem] font-sans leading-[3.5rem]">
            {pdfCoreState.SubmitMessage}
          </div>
          {pdfCoreState.SubmitMessage.length > 0 && <CircularSpinnerLarge />}
        </main>
      </>
    );
  }

  if (!loading && pdfMergerState.IsMergeComplete) {
    return (
      <>
        <main className="h-full flex flex-col justify-center items-center">
          <div className="h-[8rem] flex flex-col justify-center items-center text-center mt-14 max-sm:mt-5 mx-12 text-6xl max-sm:text-[2.5rem] font-sans">
            PDF Merger
          </div>
          <div className="h-[12rem] px-10 flex flex-col justify-center items-center text-center mb-8 mt-5 max-sm:-mt-11 text-[1.7rem] max-sm:text-[1.55rem] font-sans">
            <div className="mb-5 max-sm:mb-4">Successfully Merged {pdfMergerState.UploadedFiles.length} PDF files. ✅</div>
            <div className="text-5xl max-sm:text-[2.2rem]">🎉 🎊</div>
          </div>
          <div className="h-[6rem] max-sm:h-[5rem]">
            <button
              className="text-3xl max-sm:text-2xl rounded-lg bg-green-900 hover:bg-green-950 hover:ring hover:ring-green-700 text-gray-200 p-2 h-[4.5rem] w-56 max-sm:h-16 max-sm:w-44"
              onClick={downloadFile}
            >
              <i className="fa-solid fa-download mr-3"></i>Download
            </button>
          </div>
          <div className="h-[6rem]">
            <button
              className="text-3xl max-sm:text-2xl rounded-lg bg-[#05336E] hover:bg-[#04234D] hover:ring hover:ring-[#074DA6] text-gray-200 p-2 h-[4.5rem] w-56 max-sm:h-16 max-sm:w-44"
              onClick={refreshApp}
            >
              <i className="fa-solid fa-arrow-rotate-right mr-3"></i>Re-Do
            </button>
          </div>
        </main>
      </>
    );
  }

  return <></>;
}
