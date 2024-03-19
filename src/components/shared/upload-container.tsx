import { ReactElement } from "react";
import FilePicker from "./file-picker";

type UploadFileType = "PDF" | "Image";

interface UploadContainerProps {
  UploadType: UploadFileType;
  IsMultipleUpload: boolean;
  UploadFiles: (files: FileList | null) => Promise<void>;
}

export default function UploadContainer(props: UploadContainerProps): ReactElement {
  return (
    <>
      <div>
        <div className="h-[6rem] flex flex-col justify-center items-center mt-14 max-sm:-mt-6 text-[1.7rem] max-sm:text-[1.55rem] font-sans">
          <div className="font-semibold">
            {props.UploadType === "PDF"
              ? props.IsMultipleUpload
                ? "Upload your PDF files"
                : "Upload your PDF file"
              : "Upload your Image"}
          </div>
          <div className="mt-4 max-sm:mt-3 text-xl max-sm:text-[1.2rem]">
            {props.UploadType === "PDF"
              ? props.IsMultipleUpload
                ? "Limit - 20 PDF Files / 20 MB Each"
                : "Limit - 1 PDF File / 20 MB"
              : "Limit - 1 Image / 20 MB"}
          </div>
        </div>

        {props.UploadType === "Image" && (
          <div className="max-sm:-mt-[6px] flex flex-col justify-center items-center text-center text-xl max-sm:text-[1.2rem] font-sans">
            Allowed Formats: PNG, JPG & JPEG
          </div>
        )}

        <FilePicker
          UploadType={props.UploadType}
          IsMultiple={props.IsMultipleUpload}
          FileType={props.UploadType === "PDF" ? "application/pdf" : "image/png,image/jpg,image/jpeg,image/svg+xml"}
          UploadFiles={props.UploadFiles}
        />
      </div>
    </>
  );
}
