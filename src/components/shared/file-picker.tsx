import { ReactElement } from "react";

type PDF_FILE_TYPE = "application/pdf";
type IMAGE_FILE_TYPE = "image/png,image/jpg,image/jpeg,image/svg+xml";

interface FilePickerProps {
  IsMultiple: boolean;
  FileType: PDF_FILE_TYPE | IMAGE_FILE_TYPE;
  UploadFiles: (e: FileList | null) => void;
}

export default function FilePicker(props: FilePickerProps): ReactElement {
  return (
    <>
      <div className="mt-8 p-12 h-[25rem] max-sm:h-[18rem] w-[60rem] max-sm:w-[22rem] mx-auto rounded-3xl border-4 border-dashed border-[#074DA6] flex items-center justify-center text-center bg-transparent hover:bg-blue-950 text-[1.55rem] max-sm:text-[1.4rem] relative shadow-inner font-sans">
        <input
          className="absolute w-full h-full opacity-0 cursor-pointer"
          type="file"
          title=""
          multiple={props.IsMultiple}
          accept={props.FileType}
          onChange={(e) => props.UploadFiles(e.target.files)}
        />
        <div className="flex flex-col justify-center items-center text-center">
          <i className="text-8xl max-sm:text-6xl mb-6 max-sm:mb-4 fa-solid fa-file-pdf"></i>
          <p>Drag & Drop OR Click To Upload</p>
        </div>
      </div>
    </>
  );
}
