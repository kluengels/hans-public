/* Content for Modal if user wants to set his Own Open Ai key */

"use client";
import { useEffect, useRef, useState } from "react";
import DisplayAlert from "@/components/ui/DisplayAlert";
import type { Dispatch, SetStateAction } from "react";
import { setOpenAiKey } from "@/lib/supabase/actions";
import { OpenAiKeySchema } from "@/lib/types";
import { ContinueButton } from "@/components/ui/modals/Modalbuttons";
import toast from "react-hot-toast";
import PricingInfo from "./PricingInfo";

type SetOpenAiKeyModalProps = {
  duration: number;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  setConfirmedModal: Dispatch<SetStateAction<boolean>>;
};

export function SetOpenAiKeyModal({
  duration,
  setShowModal,
  setConfirmedModal,
}: SetOpenAiKeyModalProps) {
  // alerts
  const [alert, setAlert] = useState<string>("");

  // success state
  const [success, setSucces] = useState<boolean>(false);

  // timepout cleanup
  const timer = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const timeOut = timer.current;
    return () => {
      clearTimeout(timeOut);
    };
  }, [timer]);

  return (
    <>
      <h2>Submit your API Key for OpenAI</h2>

      <div className="my-2">
        <DisplayAlert alert={alert} setAlert={setAlert} success={success} />
      </div>
      <div className="my-2">
        The first ten transcription minutes are on us. Afterwards and for longer
        audio files you need your own API-key from OpenAI. It will be saved
        encrypted in our database, so you do not have to re-enter it again.
      </div>
      <PricingInfo duration={duration} />
      <form
        className="flex flex-col"
        action={async (formData) => {
          const openAiKey = formData.get("openAiKey");

          // client-side input validation
          const result = OpenAiKeySchema.safeParse(openAiKey);
          if (!result.success) {
            // create and display errorMessage
            const errorMessage = result.error.issues[0].message;
            setAlert(errorMessage);
            return;
          }

          // form calls server action, pass in validated values
          const resultSupabase = await setOpenAiKey(result.data);

          if (resultSupabase?.error) {
            setAlert(resultSupabase.error);
            return;
          } else {
            toast.success("OpenAi Key saved.");
            setConfirmedModal(true);
            setShowModal(false);
          }
        }}
      >
        <label htmlFor="openAiKey" className="my-4 flex flex-col">
          <span className="mb-1 text-sm">Copy your OpenAI key in here</span>
          <input
            required
            type="string"
            placeholder="Your openAI key"
            name="openAiKey"
            id="openAiKey"
            minLength={3}
            maxLength={100}
            className="peer bg-gray-50 p-1 invalid:border-solid focus:border-action focus:outline-none focus:ring invalid:[&:not(:placeholder-shown):not(:focus)]:border-2 invalid:[&:not(:placeholder-shown):not(:focus)]:border-warning"
          ></input>
          <span className="mt-2 hidden text-sm text-warning peer-[&:not(:placeholder-shown):not(:focus):invalid]:block">
            Can be between 8 and 100 characters.
          </span>
        </label>

        <div className="mt-2 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setShowModal(false)}
            className="w-1/2 rounded-md border-2 border-accent p-2 hover:bg-accent hover:text-white"
          >
            Cancel
          </button>

          {/* button checks state of db operation */}
          <ContinueButton />
        </div>
      </form>
    </>
  );
}
