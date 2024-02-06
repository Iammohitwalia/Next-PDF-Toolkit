import Link from "next/link";
import { ReactElement } from "react";

export default function NotFound(): ReactElement {
  return (
    <div className="h-screen flex flex-col justify-center items-center text-center font-[sans serif]">
      <h1 className="text-[2rem] max-sm:text-[1.5rem] mb-5 px-10">Sorry, there&apos;s nothing at this address.</h1>
      <p className="text-4xl mb-5">☹️</p>
      <Link href="/">
        <button className="text-3xl max-sm:text-2xl rounded-lg bg-[#05336E] hover:bg-[#04234D] hover:ring hover:ring-[#074DA6] text-gray-200 p-2 h-[4.5rem] w-52 max-sm:h-16 max-sm:w-40">
          Go to Home
        </button>
      </Link>
    </div>
  );
}
