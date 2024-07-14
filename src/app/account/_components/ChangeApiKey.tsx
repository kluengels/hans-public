// Content for Modal if user wants to change openAI API key

"use client";
import { useState } from "react";
import DisplayAlert from "@/components/ui/DisplayAlert";

import { setOpenAiKey } from "@/lib/supabase/actions";
import { ModalButtons } from "@/components/ui/modals/Modalbuttons";

import { OpenAiKeySchema } from "@/lib/types";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export function ChangeApiKey({ oldApiKey }: { oldApiKey: string | undefined }) {
  // router allows to close modal
  const router = useRouter();

  // alerts
  const [alert, setAlert] = useState<string>("");

  // hide key
  let hiddenKey = "";
  if (oldApiKey)
    hiddenKey =
      oldApiKey.slice(0, 5) + "·······················" + oldApiKey.slice(-5);

  return (
    <>
      <h2>Change your API-Key for OpenAI</h2>

      <div className="my-2">
        <DisplayAlert alert={alert} setAlert={setAlert} />
      </div>
      <div className="my-2">
        After your free credits are exhausted, you need to feed Hans with your
        own API-Key from OpenAI.{" "}
        {oldApiKey ? (
          <span>
            Your current API Key is{" "}
            <span className="bg-actionlight p-1">{hiddenKey}</span>{" "}
          </span>
        ) : (
          "You have set no API Key yet"
        )}
      </div>
      <form
        className="flex flex-col"
        action={async (formData) => {
          const newApiKey = formData.get("apiKey");
          // check if new key is different from old one
          if (oldApiKey === newApiKey) {
            return setAlert(
              "New API key seems to be the same as the old API key",
            );
          }

          // client-side input validation
          const result = OpenAiKeySchema.safeParse(newApiKey);
          if (!result.success) {
            // create and display errorMessage
            const errorMessage = result.error.issues[0].message;
            setAlert(errorMessage);
            return;
          }

          // form calls server action, pass in validated values
          const { error } = await setOpenAiKey(result.data);

          if (error) {
            setAlert(error);
          } else {
            toast.success("API Key changed");
            router.back();
          }
        }}
      >
        <label htmlFor="apiKey" className="my-4 flex flex-col">
          <span className="mb-1 text-sm">Enter your API-Key</span>
          <input
            required
            type="string"
            placeholder="apiKey"
            name="apiKey"
            id="apiKey"
            autoComplete="off"
            minLength={8}
            maxLength={100}
            className="peer bg-gray-50 p-1 invalid:border-solid focus:border-action focus:outline-none focus:ring invalid:[&:not(:placeholder-shown):not(:focus)]:border-2 invalid:[&:not(:placeholder-shown):not(:focus)]:border-warning"
          ></input>
          <span className="mt-2 hidden text-sm text-warning peer-[&:not(:placeholder-shown):not(:focus):invalid]:block">
            Can be between 8 and 100 characters.
          </span>
        </label>
        <ModalButtons router={router} />
      </form>
    </>
  );
}
