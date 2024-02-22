"use client";

import FilePicker from "@/components/shared/file-picker";
import { CircularSpinnerLarge, CircularSpinnerSmall } from "@/components/shared/spinners";
import { delay } from "@/components/utils/utils";
import { ReactElement, useCallback, useEffect, useState } from "react";
import { ProcessedFile } from "@/components/models/processed-file";
import { useAppDispatch, useAppSelector } from "@/lib/redux-hooks";
import {
  refreshCoreState,
  setIsUploadComplete,
  setIsUploadFailed,
  setIsUploadInitiated,
  setSubmitMessage,
  setUploadErrorMessage,
  setUploadMessage
} from "@/lib/redux-features/pdf-core/pdf-core-slice";
import { PdfPageDeleterState, initialPdfPageDeleterState } from "@/components/pdf-page-deleter/pdf-page-deleter";
import { PageDeleterValidatorResult, validatePagesToDelete } from "@/components/pdf-page-deleter/page-deleter-validator";

export default function PdfPageDeleter(): ReactElement {
  const dispatch = useAppDispatch();
  const pdfCoreState = useAppSelector((state) => state.pdfCore);

  const [pdfPageDelState, setPdfPageDelState] = useState<PdfPageDeleterState>(initialPdfPageDeleterState);
  const [loading, setLoading] = useState<boolean>(true);
  const [validatorTimer, setValidatorTimer] = useState<NodeJS.Timeout>();

  function refreshApp(): void {
    dispatch(refreshCoreState());
    setPdfPageDelState(initialPdfPageDeleterState);
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
      dispatch(setUploadMessage("Uploading your PDF file... ⏳"));
      dispatch(setIsUploadInitiated(true));

      await delay(1000);

      if (files.item(0) !== null) {
        let processedFile: ProcessedFile = { Id: 1, Content: files.item(0)! };

        if (processedFile.Content.size > pdfPageDelState.MaxSizeAllowed) {
          handleFailedUpload("Max 20 MB size allowed for the PDF file!");
          return;
        }
        if (processedFile.Content.type !== pdfPageDelState.FileTypeAllowed) {
          handleFailedUpload("You can only upload a PDF file!");
          return;
        }

        let totalPages: number = 10;

        if (totalPages === 1) {
          handleFailedUpload("That PDF file has only 1 page, which is not enough! It must have at least 2 pages.");
          return;
        }

        setPdfPageDelState((prev) => ({ ...prev, UploadedFile: processedFile, TotalPages: totalPages }));
        dispatch(setUploadMessage("PDF file uploaded. ✅"));
        dispatch(setIsUploadInitiated(false));
        dispatch(setIsUploadComplete(true));
      }
    }
  }

  function handleFailedUpload(uploadErrorMessage: string): void {
    dispatch(setUploadMessage("Upload failed! ❌"));
    dispatch(setUploadErrorMessage(uploadErrorMessage));
    dispatch(setIsUploadInitiated(false));
    dispatch(setIsUploadFailed(true));
  }

  function removeFile(): void {
    dispatch(setIsUploadComplete(false));
    dispatch(setIsUploadInitiated(false));
    dispatch(setIsUploadFailed(true));
    dispatch(setUploadMessage("PDF file deleted."));
    dispatch(setUploadErrorMessage("You have to upload again."));
    setPdfPageDelState((prev) => ({ ...prev, UploadedFile: null, TotalPages: 0 }));
  }

  function validatePageDeleter(pagesToDelete: string): void {
    let validatorResult: PageDeleterValidatorResult = validatePagesToDelete(pagesToDelete, pdfPageDelState.TotalPages);

    setPdfPageDelState((prev) => ({
      ...prev,
      TotalPagesToDelete: validatorResult[1],
      PagesToDeleteInfo: validatorResult[2],
      PagesToDeleteValidator: validatorResult[0]
    }));
  }

  function startPageDeleterValidator(pagesToDelete: string): void {
    if (validatorTimer !== undefined) {
      clearTimeout(validatorTimer);
    }
    if (pagesToDelete === "") {
      setPdfPageDelState((prev) => ({
        ...prev,
        PagesToDelete: "",
        TotalPagesToDelete: 0,
        PagesToDeleteInfo: initialPdfPageDeleterState.PagesToDeleteInfo,
        PagesToDeleteValidator: "EMPTY"
      }));
    } else {
      setPdfPageDelState((prev) => ({
        ...prev,
        PagesToDelete: pagesToDelete,
        PagesToDeleteValidator: "CHECKING"
      }));
      const timeOutId: NodeJS.Timeout = setTimeout(() => validatePageDeleter(pagesToDelete), 350);
      setValidatorTimer(timeOutId);
    }
  }

  async function submitFile(): Promise<void> {
    let submitMessage: string = "";
    if (pdfPageDelState.TotalPagesToDelete == 1) {
      submitMessage = "Deleting 1 Page from the PDF file... ⏳";
    } else {
      submitMessage = `Deleting ${pdfPageDelState.TotalPagesToDelete} Pages from the PDF file... ⏳`;
    }
    dispatch(setSubmitMessage(submitMessage));
    setPdfPageDelState((prev) => ({ ...prev, IsDeletionInitiated: true }));
    await delay(1500);
    setPdfPageDelState((prev) => ({ ...prev, IsDeletionComplete: true }));
  }

  async function downloadFile(): Promise<void> {}

  if (
    !loading &&
    !pdfCoreState.IsUploadInitiated &&
    !pdfPageDelState.IsDeletionInitiated &&
    !pdfPageDelState.IsDeletionComplete
  ) {
    return (
      <>
        <main className="h-full flex flex-col justify-center items-center">
          <div className="h-[8rem] flex flex-col justify-center items-center text-center mt-14 max-sm:mt-5 mx-8 text-6xl max-sm:text-[2.5rem] font-sans">
            PDF Page Deleter
          </div>
          {!pdfCoreState.IsUploadInitiated && !pdfCoreState.IsUploadComplete && !pdfCoreState.IsUploadFailed && (
            <div>
              <div className="h-[6rem] flex flex-col justify-center items-center mt-14 max-sm:-mt-6 text-[1.7rem] max-sm:text-[1.55rem] font-sans">
                <div>Upload your PDF file</div>
                <div className="mt-4 max-sm:mt-3 text-xl max-sm:text-[1.2rem]">Limit - 1 File / 20 MB</div>
              </div>
              <FilePicker IsMultiple={false} FileType="application/pdf" UploadFiles={uploadFilesInitializer} />
            </div>
          )}
          {pdfCoreState.IsUploadFailed && (
            <div className="flex flex-col justify-center items-center text-center mt-16 mb-8 max-sm:-mt-4 max-sm:mb-7 text-[1.7rem] max-sm:text-[1.55rem] font-sans">
              <div className="mb-14 max-sm:mb-11">
                <p className="px-6">{pdfCoreState.UploadMessage}</p>
                <p className="mt-7 px-6">{pdfCoreState.UploadErrorMessage}</p>
                <p className="mt-3 text-5xl max-sm:text-[2.2rem]">😕</p>
              </div>
              <div className="h-[6rem]">
                <button
                  className="text-3xl max-sm:text-2xl rounded-lg bg-[#05336E] hover:bg-[#04234D] hover:ring hover:ring-[#074DA6] text-gray-200 p-2 h-[4.5rem] w-52 max-sm:h-16 max-sm:w-40"
                  onClick={refreshApp}
                >
                  <i className="fa-solid fa-arrow-rotate-right mr-3"></i>Re-Do
                </button>
              </div>
            </div>
          )}
          {pdfCoreState.IsUploadComplete && (
            <div className="flex flex-col justify-center items-center text-center mt-16 mb-8 max-sm:-mt-4 max-sm:mb-7 text-[1.7rem] max-sm:text-[1.55rem] font-sans">
              <div>
                <div className="mb-8 max-sm:mb-7">
                  <p className="px-6">{pdfCoreState.UploadMessage}</p>
                </div>
                <table className="table-fixed border-collapse mx-auto mb-8 max-sm:mb-7 text-[1.2rem] max-sm:text-[1.1rem]">
                  <tbody>
                    <tr key={pdfPageDelState.UploadedFile!.Id}>
                      <td className="px-4 text-center">
                        <p>{pdfPageDelState.UploadedFile!.Content!.name}</p>
                        <p>{`(${pdfPageDelState.TotalPages} Pages)`}</p>
                        <span
                          className="hover:text-white cursor-pointer fa-solid fa-xmark pt-3"
                          title="Remove File"
                          onClick={removeFile}
                        ></span>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className="h-[9.5rem] mb-12 max-sm:mb-10 text-[1.5rem] max-sm:text-[1.25rem]">
                  <p className="px-6 mb-4">{"Enter the page(s) to delete:"}</p>
                  <input
                    className="mb-4 border border-[#AEAEAE] rounded-lg font-[monospace] h-auto w-32 max-sm:w-28 mx-auto text-center"
                    type="text"
                    value={pdfPageDelState.PagesToDelete}
                    onInput={(e) => startPageDeleterValidator(e.currentTarget.value)}
                    placeholder="Page No."
                  />
                  {pdfPageDelState.PagesToDeleteValidator === "CHECKING" ? (
                    <CircularSpinnerSmall />
                  ) : (
                    <p className="px-6">{pdfPageDelState.PagesToDeleteInfo}</p>
                  )}
                </div>
                <div className="h-[6rem] max-sm:h-[5rem]">
                  <button
                    className="text-3xl max-sm:text-2xl rounded-lg bg-green-900 hover:bg-green-950 disabled:bg-zinc-800 hover:ring hover:ring-green-700 disabled:ring-transparent text-gray-200 disabled:text-zinc-600 p-2 h-[4.5rem] w-52 max-sm:h-16 max-sm:w-40"
                    onClick={submitFile}
                    disabled={pdfPageDelState.PagesToDeleteValidator === "VALID" ? false : true}
                  >
                    <i className="fa-solid fa-circle-check mr-3"></i>Delete
                  </button>
                </div>
              </div>
              <div className="h-[6rem]">
                <button
                  className="text-3xl max-sm:text-2xl rounded-lg bg-[#05336E] hover:bg-[#04234D] hover:ring hover:ring-[#074DA6] text-gray-200 p-2 h-[4.5rem] w-52 max-sm:h-16 max-sm:w-40"
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

  if (pdfCoreState.IsUploadInitiated && !pdfCoreState.IsUploadComplete) {
    return (
      <>
        <main className="h-screen flex flex-col justify-center items-center text-center">
          <div className="mb-8 max-sm:mb-5 mx-12 text-4xl max-sm:text-[1.8rem] font-sans leading-[3.5rem]">
            {pdfCoreState.UploadMessage}
          </div>
          {pdfCoreState.UploadMessage.length > 0 && <CircularSpinnerLarge />}
        </main>
      </>
    );
  }

  if (!loading && pdfPageDelState.IsDeletionInitiated && !pdfPageDelState.IsDeletionComplete) {
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

  if (!loading && pdfPageDelState.IsDeletionComplete) {
    return (
      <>
        <main className="h-full flex flex-col justify-center items-center">
          <div className="h-[8rem] flex flex-col justify-center items-center text-center mt-14 max-sm:mt-5 mx-8 text-6xl max-sm:text-[2.5rem] font-sans">
            PDF Page Deleter
          </div>
          <div className="h-[12rem] px-6 flex flex-col justify-center items-center text-center mb-8 mt-5 max-sm:-mt-11 text-[1.7rem] max-sm:text-[1.55rem] font-sans">
            <div className="mb-5 max-sm:mb-4">
              {pdfPageDelState.TotalPagesToDelete == 1
                ? "Successfully Deleted 1 Page from the PDF File. ✅"
                : `Successfully Deleted ${pdfPageDelState.TotalPagesToDelete} Pages from the PDF File. ✅`}
            </div>
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
