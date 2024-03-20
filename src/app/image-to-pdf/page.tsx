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
import UploadContainer from "@/components/shared/upload-container";
import UploadFailedContainer from "@/components/shared/upload-failed-container";
import UploadStateContainer from "@/components/shared/upload-state-container";
import ActionStateContainer from "@/components/shared/action-state-container";
import DownloadContainer from "@/components/shared/download-container";
import { ImageOrientations, ImageToPdfState, initialImageToPdfState } from "@/components/image-to-pdf/image-to-pdf";
import Image from "next/image";
import { getImageOrientation } from "@/components/image-to-pdf/image-to-pdf-utils";
import { convertImageToPdf } from "@/components/image-to-pdf/image-to-pdf-core";

export default function ImageToPdf(): ReactElement {
  const dispatch = useAppDispatch();
  const pdfCoreState = useAppSelector((state) => state.pdfCore);

  const [imageToPdfState, setImageToPdfState] = useState<ImageToPdfState>(initialImageToPdfState);
  const [loading, setLoading] = useState<boolean>(true);

  function refreshApp(): void {
    dispatch(refreshCoreState());
    setImageToPdfState(initialImageToPdfState);
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
      dispatch(setUploadMessage("Uploading your Image... ⏳"));
      dispatch(setIsUploadInitiated(true));

      await delay(1000);

      if (files.item(0) !== null) {
        let processedFile: ProcessedFile = { Id: 1, Content: files.item(0)! };

        if (processedFile.Content.size > imageToPdfState.MaxSizeAllowed) {
          handleFailedUpload("Max 20 MB size allowed for the Image!");
          return;
        }
        if (!imageToPdfState.FileTypesAllowed.includes(processedFile.Content.type)) {
          handleFailedUpload("You can only upload an Image!");
          return;
        }

        let imageOrientation: ImageOrientations = await getImageOrientation(processedFile.Content);

        setImageToPdfState((prev) => ({
          ...prev,
          UploadedFile: processedFile,
          ImageOrientation: imageOrientation,
          PreviewImageUrl: URL.createObjectURL(processedFile.Content)
        }));
        dispatch(setUploadMessage("Image uploaded. ✅"));
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

  function removeImage(): void {
    dispatch(setIsUploadComplete(false));
    dispatch(setIsUploadFailed(true));
    dispatch(setUploadMessage("Image deleted."));
    dispatch(setUploadErrorMessage("You have to upload again."));
    setImageToPdfState((prev) => ({ ...prev, UploadedFile: null }));
  }

  async function submitImage(): Promise<void> {
    let submitMessage: string = "Converting the Image to a PDF file... ⏳";
    dispatch(setSubmitMessage(submitMessage));
    setImageToPdfState((prev) => ({ ...prev, IsConversionInitiated: true }));

    const pdfWithImageUrl: string | null = await convertImageToPdf(imageToPdfState.UploadedFile!);
    const fileName: string = imageToPdfState.UploadedFile!.Content.name;
    const finalPdfFileName: string = `${fileName.substring(0, fileName.lastIndexOf("."))} (PDF)`;
    await delay(1000);

    if (pdfWithImageUrl !== null) {
      dispatch(setFinalPdfUrl({ PdfFilename: finalPdfFileName, PdfUrl: pdfWithImageUrl }));
      setImageToPdfState((prev) => ({ ...prev, IsConversionComplete: true }));
    } else {
      dispatch(setIsUploadComplete(false));
      dispatch(setIsUploadFailed(true));
      dispatch(setUploadMessage("Something went wrong! ❌"));
      dispatch(setUploadErrorMessage("Please upload the image again."));
      setImageToPdfState((prev) => ({ ...prev, IsConversionInitiated: false, UploadedFile: null }));
    }
  }

  if (
    !loading &&
    !pdfCoreState.IsUploadInitiated &&
    !imageToPdfState.IsConversionInitiated &&
    !imageToPdfState.IsConversionComplete
  ) {
    return (
      <>
        <main className="h-full flex flex-col justify-center items-center">
          <div className="font-bold tracking-wide h-[8rem] flex flex-col justify-center items-center text-center max-sm:mb-5 mt-14 max-sm:mt-5 px-10 text-6xl max-sm:text-[2.5rem] font-sans">
            Image To PDF Converter
          </div>
          {!pdfCoreState.IsUploadInitiated && !pdfCoreState.IsUploadComplete && !pdfCoreState.IsUploadFailed && (
            <UploadContainer UploadType="Image" IsMultipleUpload={false} UploadFiles={uploadFilesInitializer} />
          )}
          {pdfCoreState.IsUploadFailed && (
            <UploadFailedContainer
              UploadMessage={pdfCoreState.UploadMessage}
              UploadErrorMessage={pdfCoreState.UploadErrorMessage}
              RefreshApp={refreshApp}
            />
          )}
          {pdfCoreState.IsUploadComplete && (
            <div className="flex flex-row max-sm:flex-col justify-center items-center text-center mt-16 max-sm:-mt-4 mb-14 text-[1.7rem] max-sm:text-[1.55rem] font-sans">
              <div className="mx-12 max-sm:mb-8">
                <p className="font-semibold px-6 mb-5">{pdfCoreState.UploadMessage}</p>
                <div className="flex justify-center items-center text-center mb-5">
                  <Image
                    src={imageToPdfState.PreviewImageUrl}
                    alt={imageToPdfState.UploadedFile!.Content.name}
                    width={800}
                    height={800}
                    quality={20}
                    loading="eager"
                    priority={true}
                    className={`rounded-3xl shadow-lg shadow-[#404756] dark:shadow-none dark:border-2 dark:border-[#ffffffa6] ${
                      imageToPdfState.ImageOrientation === "Landscape" ? "w-[600px] max-sm:w-64" : "w-80 max-sm:w-32"
                    }`}
                  ></Image>
                </div>
                <p className="text-[1.3rem] max-sm:text-[1.1rem]">{imageToPdfState.UploadedFile!.Content.name}</p>
                <span
                  className="hover:bg-white dark:hover:bg-black hover:text-black dark:hover:text-white rounded-md hover:shadow hover:shadow-[#404756] dark:hover:shadow-[#ffffffa6] p-1 cursor-pointer fa-solid fa-xmark text-[1.5rem] max-sm:text-[1.3rem] mt-1"
                  title="Remove Image"
                  onClick={removeImage}
                ></span>
              </div>
              <div className="flex-col mx-12 max-sm:mx-0">
                <div className="h-[6rem] max-sm:h-[5rem]">
                  <button
                    className="text-3xl max-sm:text-2xl rounded-xl bg-green-700 dark:bg-green-900 hover:bg-green-900 dark:hover:bg-green-950 disabled:bg-zinc-400 dark:disabled:bg-zinc-800 hover:ring hover:ring-green-500 dark:hover:ring-green-700 disabled:ring-transparent dark:disabled:ring-transparent text-gray-200 disabled:text-zinc-300 dark:disabled:text-zinc-600 p-2 h-[4.5rem] w-52 max-sm:h-16 max-sm:w-40"
                    onClick={submitImage}
                  >
                    <i className="fa-solid fa-circle-check mr-3"></i>Convert
                  </button>
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

  if (!loading && imageToPdfState.IsConversionInitiated && !imageToPdfState.IsConversionComplete) {
    return (
      <>
        <ActionStateContainer SubmitMessage={pdfCoreState.SubmitMessage} />
      </>
    );
  }

  if (!loading && imageToPdfState.IsConversionComplete) {
    return (
      <>
        <DownloadContainer
          ToolName="Image To PDF Converter"
          DownloadMessage="Successfully Converted the Image to a PDF File. ✅"
          RefreshApp={refreshApp}
        />
      </>
    );
  }

  return <></>;
}
