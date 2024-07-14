/* Modal lets user confirm the API call, estimates how much free credits are used */

"use client";

import type { Dispatch, SetStateAction } from "react";

type FreeCreditsModalProps = {
  credits: number;
  duration: number;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  setConfirmedModal: Dispatch<SetStateAction<boolean>>;
};

export function FreeCreditsModal({
  credits,
  duration,
  setShowModal,
  setConfirmedModal,
}: FreeCreditsModalProps) {
  const consumedCreditsInMinutes = Math.ceil(duration / 60);
  return (
    <>
      <h2>Yippee, this is free!</h2>

      <div className="my-2">
        The first ten minutes of transciption are on us. Right now you have free
        credits for {Math.round(credits / 60)} minutes left. For this project
        Hans will consume credits for{" "}
        {consumedCreditsInMinutes === 1
          ? `${consumedCreditsInMinutes} minute`
          : `${consumedCreditsInMinutes} minutes`}
        .
      </div>
      <div className="flex flex-col">
        <div className="mt-2 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setShowModal(false)}
            className="w-1/2 rounded-md border-2 border-accent p-2 hover:bg-accent hover:text-white"
          >
            Cancel
          </button>

          <button
            className="flex-1 rounded-md border-[1px] border-action bg-background p-1 text-text  hover:bg-action hover:text-white"
            onClick={() => {
              setConfirmedModal(true);
              setShowModal(false);
            }}
          >
            Continue
          </button>
        </div>
      </div>
    </>
  );
}
