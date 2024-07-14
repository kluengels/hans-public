// Content for Modal if user wants to delete account
"use client";
import { useState } from "react";
import DisplayAlert from "@/components/ui/DisplayAlert";

import { deleteAccount } from "@/lib/supabase/actions";
import { UserSchema } from "@/lib/types";
import { ModalButtons } from "../../../components/ui/modals/Modalbuttons";
import toast from "react-hot-toast";
import { BsExclamationTriangle } from "react-icons/bs";
import { EmailField } from "@/components/forms/FormElements";
import { useRouter } from "next/navigation";

export function DeleteAccount({ userEmail }: { userEmail: string }) {
  // router
  const router = useRouter();

  // alert
  const [alert, setAlert] = useState<string>("");

  return (
    <>
      <div className="flex items-center gap-1">
        <BsExclamationTriangle className="h-6 w-6 text-warning " />
        <h2 className="text-text">Delete your account</h2>{" "}
      </div>
      <div className="my-2">
        <DisplayAlert alert={alert} setAlert={setAlert} />
      </div>
      <div className="my-2">
        We are sorry to see you leave. Are you sure you want to delete your
        account and all data associated with it?{" "}
        <span className="font-bold text-warning">This can not be undone.</span>
      </div>
      <form
        className="flex flex-col"
        action={async (formData) => {
          // get email from formdata
          const emailConfirm = formData.get("email");

          // client-side input validation
          const result = UserSchema.shape.email.safeParse(emailConfirm);
          if (!result.success) {
            // create and display errorMessage
            const errorMessage = result.error.issues[0].message;
            setAlert(errorMessage);
            return;
          }

          // check if email from form is equal to email linked to account
          if (emailConfirm !== userEmail) {
            return setAlert("Email addresses do not match");
          }

          // run server action
          const { error } = await deleteAccount();

          if (error) {
            return setAlert(error);
          }
          toast.success("Account deleted");
        }}
      >
        <EmailField />

        <ModalButtons router={router} />
      </form>
    </>
  );
}
