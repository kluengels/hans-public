/* Modal lets user confirm the API call, estimates costs */

"use client";

import type { Dispatch, SetStateAction } from "react";
import PricingInfo from "./PricingInfo";

type OpenAiPricingModalProps = {
  duration: number;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  setConfirmedModal: Dispatch<SetStateAction<boolean>>;
};

export function OpenAiPricingModal({
  duration,
  setShowModal,
  setConfirmedModal,
}: OpenAiPricingModalProps) {
  console.log("duration", duration);

  return (
    <>
      <h2>Confirm API call</h2>
      {duration && <PricingInfo duration={duration} />}
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
