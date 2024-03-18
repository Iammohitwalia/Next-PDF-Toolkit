import { ReactElement } from "react";
import { CircularSpinnerLarge } from "./spinners";

interface ActionStateContainerProps {
  SubmitMessage: string;
}

export default function ActionStateContainer(props: ActionStateContainerProps): ReactElement {
  return (
    <>
      <main className="h-screen flex flex-col justify-center items-center text-center">
        <div className="font-semibold mb-8 max-sm:mb-5 mx-12 text-4xl max-sm:text-[1.8rem] font-sans leading-[3.5rem]">
          {props.SubmitMessage}
        </div>
        {props.SubmitMessage.length > 0 && <CircularSpinnerLarge />}
      </main>
    </>
  );
}
