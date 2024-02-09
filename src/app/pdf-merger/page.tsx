"use client";

import FilePicker from "@/components/shared/file-picker";
import CircularSpinner from "@/components/shared/spinners";
import { sleep } from "@/components/utils/utils";
import { ReactElement, useState } from "react";

interface ProcessedFile {
  Position: number;
  ProcessedFile: File;
}

export default function PDFMerger(): ReactElement {
  const [uploadedFiles, setUploadedFiles] = useState<ProcessedFile[]>([]);
  const [isUploadComplete, setIsUploadComplete] = useState<boolean>(false);
  const [isUploadInitiated, setIsUploadInitiated] = useState<boolean>(false);
  const [uploadMessage, setUploadMessage] = useState<string>("");
  const [uploadErrorMessage, setUploadErrorMessage] = useState<string>("");

  async function UploadFiles(files: FileList | null): Promise<void> {
    setUploadedFiles([]);
    setIsUploadComplete(false);
    setIsUploadInitiated(true);
    setUploadMessage("");
    setUploadErrorMessage("");

    let processedFiles: ProcessedFile[] = [];
    if (files !== null) {
      for (let i: number = 0; i < files.length; i++) {
        if (files.item(i) !== null) {
          let newFile: File = files.item(i) as File;
          processedFiles = processedFiles.concat({ Position: i + 1, ProcessedFile: newFile });
        }
      }
    }
    await sleep(1500);
    setUploadedFiles(processedFiles);
    if (processedFiles.length > 1) {
      setUploadMessage(`${processedFiles.length} PDF files uploaded. ✅`);
    } else {
      setUploadErrorMessage("Just 1 PDF file uploaded, which is not enough! You have to upload at least 2 files.");
    }
    setIsUploadComplete(true);
  }

  function MoveFileUp(file: ProcessedFile): void {
    const index: number = uploadedFiles.indexOf(file);
    uploadedFiles.splice(index, 1);
    uploadedFiles.splice(index - 1, 0, file);
    setUploadedFiles([...uploadedFiles]);
  }

  function MoveFileDown(file: ProcessedFile): void {
    const index: number = uploadedFiles.indexOf(file);
    uploadedFiles.splice(index, 1);
    uploadedFiles.splice(index + 1, 0, file);
    setUploadedFiles([...uploadedFiles]);
  }

  function RemoveFile(file: ProcessedFile): void {
    const index: number = uploadedFiles.indexOf(file);
    uploadedFiles.splice(index, 1);
    setUploadedFiles([...uploadedFiles]);

    if (uploadedFiles.length > 1) {
      setUploadMessage(`${uploadedFiles.length} PDF files are left. ✅`);
    } else {
      setUploadErrorMessage("Not enough PDF files left! At least 2 files are needed.");
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
        <FilePicker IsMultiple={true} FileType="application/pdf" UploadFiles={UploadFiles} />
        {isUploadInitiated && !isUploadComplete && (
          <div>
            <div className="flex justify-center items-center text-center mt-11 mb-8 max-sm:mt-9 max-sm:mb-7 text-[1.7rem] max-sm:text-[1.55rem] font-[sans-serif]">
              Uploading your file(s)... ⏳
            </div>
            <CircularSpinner />
          </div>
        )}
        {isUploadComplete && (
          <div>
            <div className="flex justify-center items-center text-center mt-11 mb-8 max-sm:mt-9 max-sm:mb-7 text-[1.7rem] max-sm:text-[1.55rem] font-[sans-serif]">
              {uploadedFiles.length > 1 ? (
                <div>
                  <p className="px-10">{uploadMessage}</p>
                </div>
              ) : (
                <div>
                  <p className="px-10">{uploadErrorMessage}</p>
                  <p className="mt-3 text-[3rem] max-sm:text-[2.2rem]">😕</p>
                </div>
              )}
            </div>
            {uploadedFiles.length > 1 && (
              <table className="flex justify-center items-center table-fixed border-collapse mx-14 text-[1.05rem]">
                <tbody>
                  {uploadedFiles.map((file: ProcessedFile) => (
                    <tr key={file.Position}>
                      <td className="pb-[0.8rem] max-sm:pb-[0.65rem] text-center pr-1">{"●"}</td>
                      <td className="pb-[0.8rem] max-sm:pb-[0.65rem] pr-3 max-sm:pr-2">{file.ProcessedFile!.name}</td>
                      <td className="max-sm:w-1/4 pb-[0.8rem] max-sm:pb-[0.65rem] text-center">
                        {uploadedFiles.indexOf(file) > 0 && (
                          <span
                            className="px-2 hover:text-white cursor-pointer fa-solid fa-arrow-up"
                            title="Move File Up"
                            onClick={() => MoveFileUp(file)}
                          ></span>
                        )}
                        {uploadedFiles.indexOf(file) < uploadedFiles.length - 1 && (
                          <span
                            className="px-2 hover:text-white cursor-pointer fa-solid fa-arrow-down"
                            title="Move File Down"
                            onClick={() => MoveFileDown(file)}
                          ></span>
                        )}
                        <span
                          className="px-2 hover:text-white cursor-pointer fa-solid fa-xmark"
                          title="Remove File"
                          onClick={() => RemoveFile(file)}
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
