"use client";

import FilePicker from "@/components/shared/file-picker";
import { ReactElement } from "react";

export default function PdfPageExtractor(): ReactElement {
  function uploadFileInitializer(e: FileList | null): void {
    console.log(e);
  }

  return (
    <>
      <FilePicker IsMultiple={false} FileType="application/pdf" UploadFiles={uploadFileInitializer} />
    </>
  );
}
