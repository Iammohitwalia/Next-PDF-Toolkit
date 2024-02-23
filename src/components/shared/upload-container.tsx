import { ReactElement } from "react";
import FilePicker from "./file-picker";

interface UploadContainerProps {
  IsMultipleUpload: boolean;
  UploadFiles: (files: FileList | null) => Promise<void>;
}

export default function UploadContainer(props: UploadContainerProps): ReactElement {
  return (
    <>
      <div>
        <div className="h-[6rem] flex flex-col justify-center items-center mt-14 max-sm:-mt-6 text-[1.7rem] max-sm:text-[1.55rem] font-sans">
          <div>{props.IsMultipleUpload ? "Upload your PDF files" : "Upload your PDF file"}</div>
          <div className="mt-4 max-sm:mt-3 text-xl max-sm:text-[1.2rem]">
            {props.IsMultipleUpload ? "Limit - 20 Files / 20 MB Each" : "Limit - 1 File / 20 MB"}
          </div>
        </div>
        <FilePicker IsMultiple={props.IsMultipleUpload} FileType="application/pdf" UploadFiles={props.UploadFiles} />
      </div>
    </>
  );
}
