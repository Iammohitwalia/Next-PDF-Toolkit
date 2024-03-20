"use client";

import { delay } from "@/components/utils/utils";
import { ReactElement, useCallback, useEffect, useState } from "react";
import { ProcessedFile } from "@/components/models/processed-file";
import { useAppDispatch, useAppSelector } from "@/lib/redux-hooks";
import {
  refreshCoreState,
  setFinalPdfUrl,
  setIsUploadComplete,
  setIsUploadFailed,
  setIsUploadInitiated,
  setSubmitMessage,
  setUploadErrorMessage,
  setUploadMessage
} from "@/lib/redux-features/pdf-core/pdf-core-slice";
import { PdfMergerState, initialPdfMergerState } from "@/components/pdf-merger/pdf-merger";
import UploadContainer from "@/components/shared/upload-container";
import UploadFailedContainer from "@/components/shared/upload-failed-container";
import UploadStateContainer from "@/components/shared/upload-state-container";
import ActionStateContainer from "@/components/shared/action-state-container";
import DownloadContainer from "@/components/shared/download-container";
import { mergePdfs } from "@/components/pdf-merger/pdf-merger-core";

export default function PdfMerger(): ReactElement {
  const dispatch = useAppDispatch();
  const pdfCoreState = useAppSelector((state) => state.pdfCore);

  const [pdfMergerState, setPdfMergerState] = useState<PdfMergerState>(initialPdfMergerState);
  const [loading, setLoading] = useState<boolean>(true);

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
    if (files !== null) {
      if (files.length === 0) {
        return;
      }

      refreshApp();
      dispatch(setUploadMessage("Uploading your PDF file(s)... ⏳"));
      dispatch(setIsUploadInitiated(true));

      await delay(1000);

      let processedFiles: ProcessedFile[] = [];

      if (files.length > pdfMergerState.MaxFilesAllowed) {
        handleFailedUpload(`Max ${pdfMergerState.MaxFilesAllowed} PDF files allowed!`);
        return;
      }

      for (let i: number = 0; i < files.length; i++) {
        if (files.item(i) !== null) {
          let newFile: File = files.item(i)!;

          if (newFile.size > pdfMergerState.MaxSizeAllowed) {
            handleFailedUpload("Max 20 MB size allowed for each file!");
            return;
          }
          if (newFile.type !== pdfMergerState.FileTypeAllowed) {
            handleFailedUpload("You can only upload PDF files!");
            return;
          }
          processedFiles = processedFiles.concat({ Id: i + 1, Content: newFile });
        }
      }

      if (processedFiles.length > 1) {
        setPdfMergerState((prev) => ({ ...prev, UploadedFiles: processedFiles }));
        dispatch(setUploadMessage(`${processedFiles.length} PDF files uploaded. ✅`));
      } else {
        dispatch(
          setUploadErrorMessage("Just 1 PDF file uploaded, which is not enough! You have to upload at least 2 files.")
        );
      }
      dispatch(setIsUploadInitiated(false));
      dispatch(setIsUploadComplete(true));
    }
  }

  function handleFailedUpload(uploadErrorMessage: string): void {
    dispatch(setUploadMessage("Upload failed! ❌"));
    dispatch(setUploadErrorMessage(uploadErrorMessage));
    dispatch(setIsUploadInitiated(false));
    dispatch(setIsUploadFailed(true));
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

    const mergedPdfUrl: string = await mergePdfs(pdfMergerState.UploadedFiles);
    const finalPdfFileName: string = "Merged PDF";
    await delay(1000);

    dispatch(setFinalPdfUrl({ PdfFilename: finalPdfFileName, PdfUrl: mergedPdfUrl }));
    setPdfMergerState((prev) => ({ ...prev, IsMergeComplete: true }));
  }

  if (!loading && !pdfCoreState.IsUploadInitiated && !pdfMergerState.IsMergeInitiated && !pdfMergerState.IsMergeComplete) {
    return (
      <>
        <main className="h-full flex flex-col justify-center items-center">
          <div className="font-bold tracking-wide h-[8rem] flex flex-col justify-center items-center text-center mt-14 max-sm:mt-5 px-10 text-6xl max-sm:text-[2.5rem] font-sans">
            PDF Merger
          </div>
          {!pdfCoreState.IsUploadInitiated && !pdfCoreState.IsUploadComplete && !pdfCoreState.IsUploadFailed && (
            <UploadContainer UploadType="PDF" IsMultipleUpload={true} UploadFiles={uploadFilesInitializer} />
          )}
          {pdfCoreState.IsUploadFailed && (
            <UploadFailedContainer
              UploadMessage={pdfCoreState.UploadMessage}
              UploadErrorMessage={pdfCoreState.UploadErrorMessage}
              RefreshApp={refreshApp}
            />
          )}
          {pdfCoreState.IsUploadComplete && (
            <div className="flex flex-col justify-center items-center text-center mt-16 mb-8 max-sm:-mt-4 max-sm:mb-7 text-[1.7rem] max-sm:text-[1.55rem] font-sans">
              <div>
                {pdfMergerState.UploadedFiles.length <= 1 ? (
                  <div className="mb-14 max-sm:mb-11">
                    <p className="font-semibold px-6">{pdfCoreState.UploadErrorMessage}</p>
                    {pdfCoreState.UploadErrorMessage.length > 0 && <p className="mt-3 text-5xl max-sm:text-[2.2rem]">😕</p>}
                  </div>
                ) : (
                  <div>
                    <div className="mb-8 max-sm:mb-7">
                      <p className="font-semibold px-6">{pdfCoreState.UploadMessage}</p>
                    </div>
                    <table className="table-fixed border-collapse mx-auto mb-8 max-sm:mb-7 text-[1.2rem] max-sm:text-[1.1rem]">
                      <tbody>
                        {pdfMergerState.UploadedFiles.map((file: ProcessedFile) => (
                          <tr key={file.Id}>
                            <td className="pb-[0.8rem] max-sm:pb-[0.65rem] text-center pl-4 pr-2">
                              <i className="fa-solid fa-file-pdf"></i>
                            </td>
                            <td className="pb-[0.8rem] max-sm:pb-[0.65rem] pr-4 max-sm:pr-3 text-left">
                              {file.Content.name}
                            </td>
                            <td className="pb-[0.8rem] max-sm:pb-[0.65rem] text-center pr-4">
                              {pdfMergerState.UploadedFiles.indexOf(file) > 0 && (
                                <span
                                  className="px-2 hover:bg-white dark:hover:bg-black hover:text-black dark:hover:text-white rounded-md hover:shadow hover:shadow-[#404756] dark:hover:shadow-[#ffffffa6] p-1 cursor-pointer fa-solid fa-arrow-up"
                                  title="Move File Up"
                                  onClick={() => moveFileUp(file)}
                                ></span>
                              )}
                              {pdfMergerState.UploadedFiles.indexOf(file) < pdfMergerState.UploadedFiles.length - 1 && (
                                <span
                                  className="px-2 hover:bg-white dark:hover:bg-black hover:text-black dark:hover:text-white rounded-md hover:shadow hover:shadow-[#404756] dark:hover:shadow-[#ffffffa6] p-1 cursor-pointer fa-solid fa-arrow-down"
                                  title="Move File Down"
                                  onClick={() => moveFileDown(file)}
                                ></span>
                              )}
                              <span
                                className="px-2 hover:bg-white dark:hover:bg-black hover:text-black dark:hover:text-white rounded-md hover:shadow hover:shadow-[#404756] dark:hover:shadow-[#ffffffa6] p-1 cursor-pointer fa-solid fa-xmark"
                                title="Remove File"
                                onClick={() => removeFile(file)}
                              ></span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="h-[6rem] max-sm:h-[5rem]">
                      <button
                        className="text-3xl max-sm:text-2xl rounded-xl bg-green-700 dark:bg-green-900 hover:bg-green-900 dark:hover:bg-green-950 disabled:bg-zinc-400 dark:disabled:bg-zinc-800 hover:ring hover:ring-green-500 dark:hover:ring-green-700 disabled:ring-transparent text-gray-200 disabled:text-zinc-300 dark:disabled:text-zinc-600 p-2 h-[4.5rem] w-52 max-sm:h-16 max-sm:w-40"
                        onClick={submitFiles}
                      >
                        <i className="fa-solid fa-circle-check mr-3"></i>Merge
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div className="h-[6rem]">
                <button
                  className="text-3xl max-sm:text-2xl rounded-xl bg-[#074DA6] dark:bg-[#05336E] hover:bg-[#05346e] dark:hover:bg-[#04234D] hover:ring hover:ring-[#0091ff] dark:hover:ring-[#074DA6] text-gray-200 p-2 h-[4.5rem] w-52 max-sm:h-16 max-sm:w-40"
                  onClick={refreshApp}
                >
                  <i className="fa-solid fa-arrow-rotate-right mr-3"></i>Re-Do
                </button>
              </div>
            </div>
          )}
        </main>
      </>
    );
  }

  if (!loading && pdfCoreState.IsUploadInitiated && !pdfCoreState.IsUploadComplete) {
    return (
      <>
        <UploadStateContainer UploadMessage={pdfCoreState.UploadMessage} />
      </>
    );
  }

  if (!loading && pdfMergerState.IsMergeInitiated && !pdfMergerState.IsMergeComplete) {
    return (
      <>
        <ActionStateContainer SubmitMessage={pdfCoreState.SubmitMessage} />
      </>
    );
  }

  if (!loading && pdfMergerState.IsMergeComplete) {
    return (
      <>
        <DownloadContainer
          ToolName="PDF Merger"
          DownloadMessage={`Successfully Merged ${pdfMergerState.UploadedFiles.length} PDF files. ✅`}
          RefreshApp={refreshApp}
        />
      </>
    );
  }

  return <></>;
}
