import Link from "next/link";
import { ReactElement } from "react";

export default function Home(): ReactElement {
  return (
    <>
      <main className="h-full flex flex-col justify-center items-center">
        <div className="h-[8rem] flex flex-col justify-center items-center text-center mt-14 max-sm:mt-10 mx-12 text-6xl max-sm:text-5xl font-sans">
          Welcome to the PDF Toolkit
        </div>
        <div className="h-[6rem] flex flex-col justify-center items-center mt-9 text-5xl max-sm:text-4xl font-sans">
          Available Tools
        </div>
        <div className="h-[21rem] w-[40rem] max-sm:h-[25.5rem] max-sm:w-[23rem] flex flex-wrap flex-row justify-center items-center mt-6 max-sm:mt-4 text-3xl max-sm:text-2xl font-sans">
          <Link href="/pdf-merger">
            <button className="m-5 max-sm:m-3 rounded-lg bg-[#05336E] hover:bg-[#04234D] hover:ring hover:ring-[#074DA6] text-gray-200 h-32 w-40 max-sm:h-[7rem] max-sm:w-[8.5rem]">
              PDF Merger
            </button>
          </Link>
          <Link href="/pdf-extractor">
            <button className="m-5 max-sm:m-3 rounded-lg bg-[#05336E] hover:bg-[#04234D] hover:ring hover:ring-[#074DA6] text-gray-200 h-32 w-40 max-sm:h-[7rem] max-sm:w-[8.5rem]">
              PDF Page Extractor
            </button>
          </Link>
          <Link href="/pdf-page-deleter">
            <button className="m-5 max-sm:m-3 rounded-lg bg-[#05336E] hover:bg-[#04234D] hover:ring hover:ring-[#074DA6] text-gray-200 h-32 w-40 max-sm:h-[7rem] max-sm:w-[8.5rem]">
              PDF Page Deleter
            </button>
          </Link>
          <Link href="/image-to-pdf">
            <button className="m-5 max-sm:m-3 rounded-lg bg-[#05336E] hover:bg-[#04234D] hover:ring hover:ring-[#074DA6] text-gray-200 h-32 w-40 max-sm:h-[7rem] max-sm:w-[8.5rem]">
              Image To PDF
            </button>
          </Link>
          <Link href="/pdf-encryptor">
            <button className="m-5 max-sm:m-3 rounded-lg bg-[#05336E] hover:bg-[#04234D] hover:ring hover:ring-[#074DA6] text-gray-200 h-32 w-40 max-sm:h-[7rem] max-sm:w-[8.5rem]">
              PDF Encryptor
            </button>
          </Link>
        </div>
      </main>
    </>
  );
}
