import { ReactElement } from "react";
import { useAppSelector } from "@/lib/redux-hooks";

interface UploadFailedContainerProps {
  RefreshApp: () => void;
}

export default function UploadFailedContainer(props: UploadFailedContainerProps): ReactElement {
  const pdfCoreState = useAppSelector((state) => state.pdfCore);

  return (
    <>
      <div className="flex flex-col justify-center items-center text-center mt-16 mb-8 max-sm:-mt-4 max-sm:mb-7 text-[1.7rem] max-sm:text-[1.55rem] font-sans">
        <div className="mb-14 max-sm:mb-11">
          <p className="font-semibold px-6">{pdfCoreState.UploadMessage}</p>
          <p className="mt-7 px-6">{pdfCoreState.UploadErrorMessage}</p>
          <p className="mt-3 text-5xl max-sm:text-[2.2rem]">😕</p>
        </div>
        <div className="h-[6rem]">
          <button
            className="text-3xl max-sm:text-2xl rounded-xl bg-[#074DA6] dark:bg-[#05336E] hover:bg-[#05346e] dark:hover:bg-[#04234D] hover:ring hover:ring-[#0091ff] dark:hover:ring-[#074DA6] text-gray-200 p-2 h-[4.5rem] w-52 max-sm:h-16 max-sm:w-40"
            onClick={props.RefreshApp}
          >
            <i className="fa-solid fa-arrow-rotate-right mr-3"></i>Re-Do
          </button>
        </div>
      </div>
    </>
  );
}
