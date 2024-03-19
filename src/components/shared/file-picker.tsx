import { ReactElement } from "react";

type UploadFileType = "PDF" | "Image";
type PdfFileType = "application/pdf";
type ImageFileTypes = "image/png,image/jpg,image/jpeg,image/svg+xml";

interface FilePickerProps {
  UploadType: UploadFileType;
  IsMultiple: boolean;
  FileType: PdfFileType | ImageFileTypes;
  UploadFiles: (e: FileList | null) => void;
}

export default function FilePicker(props: FilePickerProps): ReactElement {
  return (
    <>
      <div className="mt-12 max-sm:mt-9 p-12 h-[25rem] max-sm:h-[18rem] w-[60rem] max-sm:w-[22rem] mx-auto rounded-3xl border-4 border-dashed border-[#074DA6] flex items-center justify-center text-center bg-transparent hover:bg-blue-300 dark:hover:bg-blue-950 text-[1.55rem] max-sm:text-[1.4rem] relative shadow-inner font-sans">
        <input
          className="absolute w-full h-full opacity-0 cursor-pointer"
          type="file"
          title=""
          multiple={props.IsMultiple}
          accept={props.FileType}
          onChange={(e) => props.UploadFiles(e.target.files)}
        />
        <div className="flex flex-col justify-center items-center text-center">
          <i className={`text-9xl max-sm:text-8xl mb-8 max-sm:mb-6 fa-solid fa-file-${props.UploadType.toLowerCase()}`}></i>
          <div className="text-[1.5rem] max-sm:text-[1.3rem]">
            <p>Drag & Drop</p>
            <p>OR</p>
            <p>Click To Upload</p>
          </div>
        </div>
      </div>
    </>
  );
}
