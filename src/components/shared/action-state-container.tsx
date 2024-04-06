import { ReactElement } from "react";
import { CircularSpinnerLarge } from "./spinners";
import { useAppSelector } from "@/lib/redux-hooks";

export default function ActionStateContainer(): ReactElement {
  const pdfCoreState = useAppSelector((state) => state.pdfCore);

  return (
    <>
      <main className="h-screen flex flex-col justify-center items-center text-center">
        <div className="font-semibold mb-8 max-sm:mb-5 mx-12 text-4xl max-sm:text-[1.8rem] font-sans leading-[3.5rem]">
          {pdfCoreState.SubmitMessage}
        </div>
        {pdfCoreState.SubmitMessage.length > 0 && <CircularSpinnerLarge />}
      </main>
    </>
  );
}
