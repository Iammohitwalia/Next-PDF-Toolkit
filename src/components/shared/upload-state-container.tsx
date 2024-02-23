import { ReactElement } from "react";
import { CircularSpinnerLarge } from "./spinners";

interface UploadStateContainerProps {
  UploadMessage: string;
}

export default function UploadStateContainer(props: UploadStateContainerProps): ReactElement {
  return (
    <>
      <main className="h-screen flex flex-col justify-center items-center text-center">
        <div className="mb-8 max-sm:mb-5 mx-12 text-4xl max-sm:text-[1.8rem] font-sans leading-[3.5rem]">
          {props.UploadMessage}
        </div>
        {props.UploadMessage.length > 0 && <CircularSpinnerLarge />}
      </main>
    </>
  );
}
