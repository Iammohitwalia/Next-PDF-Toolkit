import { ReactElement } from "react";

interface DownloadContainerProps {
  ToolName: string;
  DownloadMessage: string;
  DownloadFile: () => Promise<void>;
  RefreshApp: () => void;
}

export default function DownloadContainer(props: DownloadContainerProps): ReactElement {
  return (
    <>
      <main className="h-full flex flex-col justify-center items-center">
        {props.ToolName === "Image To PDF Converter" ? (
          <div className="h-[8rem] flex flex-col justify-center items-center text-center max-sm:mb-6 mt-14 max-sm:mt-5 px-5 text-6xl max-sm:text-[2.5rem] font-sans">
            {props.ToolName}
          </div>
        ) : (
          <div className="h-[8rem] flex flex-col justify-center items-center text-center mt-14 max-sm:mt-5 px-5 text-6xl max-sm:text-[2.5rem] font-sans">
            {props.ToolName}
          </div>
        )}
        <div className="h-[12rem] px-6 flex flex-col justify-center items-center text-center mb-8 mt-5 max-sm:-mt-11 text-[1.7rem] max-sm:text-[1.55rem] font-sans">
          <div className="mb-5 max-sm:mb-4">{props.DownloadMessage}</div>
          <div className="text-5xl max-sm:text-[2.2rem]">🎉 🎊</div>
        </div>
        <div className="h-[6rem] max-sm:h-[5rem]">
          <button
            className="text-3xl max-sm:text-2xl rounded-xl bg-green-900 hover:bg-green-950 hover:ring hover:ring-green-700 text-gray-200 p-2 h-[4.5rem] w-56 max-sm:h-16 max-sm:w-44"
            onClick={props.DownloadFile}
          >
            <i className="fa-solid fa-download mr-3"></i>Download
          </button>
        </div>
        <div className="h-[6rem]">
          <button
            className="text-3xl max-sm:text-2xl rounded-xl bg-[#05336E] hover:bg-[#04234D] hover:ring hover:ring-[#074DA6] text-gray-200 p-2 h-[4.5rem] w-56 max-sm:h-16 max-sm:w-44"
            onClick={props.RefreshApp}
          >
            <i className="fa-solid fa-arrow-rotate-right mr-3"></i>Re-Do
          </button>
        </div>
      </main>
    </>
  );
}
