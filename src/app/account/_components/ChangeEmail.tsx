// Content for Modal if user wants to change Email, Step 1: Enter new email
"use client";
import { useState } from "react";
import DisplayAlert from "@/components/ui/DisplayAlert";
import { changeEmail } from "@/lib/supabase/actions";
import { UserSchema } from "@/lib/types";
import { ModalButtons } from "../../../components/ui/modals/Modalbuttons";
import { EmailField } from "@/components/forms/FormElements";
import { useRouter } from "next/navigation";

export function ChangeEmail({ oldEmail }: { oldEmail: string | undefined }) {
  //router needed to close modal
  const router = useRouter();

  // alert
  const [alert, setAlert] = useState<string>("");

  // step 1: Enter new email address
  if (oldEmail) {
    return (
      <>
        <h2>Change your email-address</h2>
        <div className="my-2">
          <DisplayAlert alert={alert} setAlert={setAlert} />
        </div>

        <div className="my-2">
          Currently your account is linked to:{" "}
          <span className="font-bold">{oldEmail}</span>
        </div>
        <form
          className="flex flex-col"
          action={async (formData) => {
            if (!formData.get("newemail")) return;

            // get newEmail adress from form Data
            const newEmail = formData.get("newemail");

            // client-side input validation
            const result = UserSchema.shape.email.safeParse(newEmail);
            if (!result.success) {
              // create and display errorMessage
              const errorMessage = result.error.issues[0].message;
              setAlert(errorMessage);
              return;
            }

            // Check if new email differs from old email
            if (result.data === oldEmail)
              return setAlert("Please enter a new email address");

            // form calls server action, pass in validated
            const { data, error } = await changeEmail(result.data);

            if (error) {
              setAlert(error);
            }
            if (data) {
              const params = new URLSearchParams({
                modal: "email",
                newmail: result.data,
              });

              // will open step-2-modal
              router.push("/account?" + params);
            }
          }}
        >
          <EmailField name="newemail" />
          <ModalButtons router={router} />
        </form>
      </>
    );
  }
}
