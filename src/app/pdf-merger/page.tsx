"use client";

import FilePicker from "@/components/shared/file-picker";
import CircularSpinner from "@/components/shared/spinners";
import { sleep } from "@/components/utils/utils";
import { ReactElement, useState } from "react";
import { ProcessedFile } from "@/components/models/processed-file";
import { useAppDispatch, useAppSelector, useAppStore } from "@/lib/redux-hooks";
import {
  refreshCoreState,
  setIsUploadComplete,
  setIsUploadInitiated,
  setUploadErrorMessage,
  setUploadMessage
} from "@/lib/features/pdf-core/pdf-core-slice";
import { PdfMergerState, initialPdfMergerState } from "@/components/pdf-merger/pdf-merger";

export default function PDFMerger(): ReactElement {
  const store = useAppStore();
  const dispatch = useAppDispatch();
  const pdfCoreState = useAppSelector((state) => state.pdfCore);

  const [pdfMergerState, setPdfMergerState] = useState<PdfMergerState>(initialPdfMergerState);

  async function uploadFilesInitializer(files: FileList | null): Promise<void> {
    setPdfMergerState(initialPdfMergerState);
    dispatch(refreshCoreState());
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
    await sleep(1500);
    setPdfMergerState({ ...pdfMergerState, UploadedFiles: processedFiles });
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
    setPdfMergerState({ ...pdfMergerState, UploadedFiles: newFiles });
  }

  function moveFileDown(file: ProcessedFile): void {
    const index: number = pdfMergerState.UploadedFiles.indexOf(file);
    let newFiles: ProcessedFile[] = [...pdfMergerState.UploadedFiles];
    newFiles.splice(index, 1);
    newFiles.splice(index + 1, 0, file);
    setPdfMergerState({ ...pdfMergerState, UploadedFiles: newFiles });
  }

  function removeFile(file: ProcessedFile): void {
    const index: number = pdfMergerState.UploadedFiles.indexOf(file);
    let newFiles: ProcessedFile[] = [...pdfMergerState.UploadedFiles];
    newFiles.splice(index, 1);
    setPdfMergerState({ ...pdfMergerState, UploadedFiles: newFiles });

    if (newFiles.length > 1) {
      dispatch(setUploadMessage(`${newFiles.length} PDF files are left. ✅`));
    } else {
      dispatch(setUploadErrorMessage("Not enough PDF files left! At least 2 files are needed."));
    }
  }

  return (
    <>
      <main className="h-full flex flex-col justify-center items-center">
        <div className="h-[8rem] flex flex-col justify-center items-center text-center mt-14 max-sm:mt-5 mx-12 text-6xl max-sm:text-[2.5rem] font-[sans-serif]">
          PDF Merger
        </div>
        <div className="h-[6rem] flex flex-col justify-center items-center mt-14 max-sm:-mt-6 text-[1.7rem] max-sm:text-[1.55rem] font-[sans-serif]">
          <div>Upload your PDF files</div>
          <div className="mt-4 max-sm:mt-3 text-xl max-sm:text-[1.2rem]">Limit - 20 Files / 20 MB Each</div>
        </div>
        <FilePicker IsMultiple={true} FileType="application/pdf" UploadFiles={uploadFilesInitializer} />
        {pdfCoreState.IsUploadInitiated && !pdfCoreState.IsUploadComplete && (
          <div>
            <div className="flex justify-center items-center text-center mt-11 mb-8 max-sm:mt-9 max-sm:mb-7 text-[1.7rem] max-sm:text-[1.55rem] font-[sans-serif]">
              Uploading your file(s)... ⏳
            </div>
            <CircularSpinner />
          </div>
        )}
        {pdfCoreState.IsUploadComplete && (
          <div>
            <div className="flex justify-center items-center text-center mt-11 mb-8 max-sm:mt-9 max-sm:mb-7 text-[1.7rem] max-sm:text-[1.55rem] font-[sans-serif]">
              {pdfMergerState.UploadedFiles.length > 1 ? (
                <div>
                  <p className="px-10">{pdfCoreState.UploadMessage}</p>
                </div>
              ) : (
                <div>
                  <p className="px-10">{pdfCoreState.UploadErrorMessage}</p>
                  {pdfCoreState.UploadErrorMessage.length > 0 && <p className="mt-3 text-[3rem] max-sm:text-[2.2rem]">😕</p>}
                </div>
              )}
            </div>
            {pdfMergerState.UploadedFiles.length > 1 && (
              <table className="flex justify-center items-center table-fixed border-collapse mx-14 text-[1.05rem]">
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
            )}
          </div>
        )}
      </main>
    </>
  );
}
