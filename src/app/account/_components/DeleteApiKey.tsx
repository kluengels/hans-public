// Content for modal to delete OpenAI API key

// Content for Modal if user wants to change openAI API key

"use client";
import { useState } from "react";
import DisplayAlert from "@/components/ui/DisplayAlert";
import { deleteOpenAiKey } from "@/lib/supabase/actions";
import { ModalCancelButton } from "@/components/ui/modals/Modalbuttons";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { revalidate } from "@/components/revalidate";

export function DeleteApiKey() {
  // router allows to close modal
  const router = useRouter();

  // pending
  const [isPending, setIsPending] = useState(false);

  // alerts
  const [alert, setAlert] = useState<string>("");

  return (
    <>
      <h2>Delete your API-Key</h2>
      <div className="my-2">
        <DisplayAlert alert={alert} setAlert={setAlert} />
      </div>
      <div className="my-2">
        Are you sure that you want to delete your OpenAI API key? That can not
        be undone.
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        <ModalCancelButton router={router} />

        {/* Confirm button with pending state */}
        <button
          className={`flex-1 rounded-md border-[1px] border-action p-1  text-text ${
            isPending
              ? "border-slate-400 bg-slate-400"
              : "bg-background  hover:bg-action hover:text-white"
          }`}
          disabled={isPending ? true : false}
          onClick={async () => {
            const { error } = await deleteOpenAiKey();
            if (error) {
              setAlert("Failed to delete OpenAI Key");
              setIsPending(false);
            } else {
              setIsPending(false);
              toast.success("Open AI Key deleted");

              // close modal, revalidate data
              revalidate("/account");
              router.push("/account");
            }
          }}
        >
          {isPending ? "Please wait" : "Continue"}
        </button>
      </div>
    </>
  );
}
