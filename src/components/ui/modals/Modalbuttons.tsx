import { useFormStatus } from "react-dom";
import { Dispatch, SetStateAction } from "react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export function ContinueButton() {
  const { pending } = useFormStatus();
  return (
    <button
      className={`flex-1 rounded-md border-[1px] border-action p-1  text-text ${
        pending
          ? "border-slate-400 bg-slate-400"
          : "bg-background  hover:bg-action hover:text-white"
      }`}
      disabled={pending ? true : false}
    >
      {pending ? "Please wait" : "Continue"}
    </button>
  );
}

export function ModalCancelButton({
  setShowModal,
  router
}: {
  setShowModal?: Dispatch<SetStateAction<boolean>>;
  router?: AppRouterInstance;
}) {
  return (
    <button
      type="button"
      onClick={() => {
        if(setShowModal) {
          setShowModal(false)
        } else if(router) {
          router.back()
        }
        
        }}
      className="w-1/2 rounded-md border-2 border-accent p-2 hover:bg-accent hover:text-white"
    >
      Cancel
    </button>
  );
}

export function ModalButtons({
  setShowModal,
  router
}: {
  setShowModal?: Dispatch<SetStateAction<boolean>> 
  router?: AppRouterInstance;
}) {
  return (
    <div className="mt-2 flex flex-wrap gap-2">
      <ModalCancelButton setShowModal={setShowModal} router={router} />

      {/* button checks state of db operation */}
      <ContinueButton />
    </div>
  );
}
