import { useFormStatus } from "react-dom";

export default function SubmitButton({
  pendingText = "Please wait",
  buttonText = "Submit",
}: {
  pendingText?: string;
  buttonText?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      className={`my-4 rounded-md border-[1px] border-action p-1 text-text ${
        pending
          ? "border-slate-400 bg-slate-400"
          : "bg-actionlight  hover:bg-action hover:text-white"
      }`}
      disabled={pending ? true : false}
    >
      {pending ? pendingText : buttonText}
    </button>
  );
}
