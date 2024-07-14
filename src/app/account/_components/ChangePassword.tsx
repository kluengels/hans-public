// Content for Modal if user wants to change password

"use client";
import { useState } from "react";
import DisplayAlert from "@/components/ui/DisplayAlert";
import { setNewPassword } from "@/lib/supabase/actions";
import { UserSchema } from "@/lib/types";
import { ModalButtons } from "../../../components/ui/modals/Modalbuttons";
import toast from "react-hot-toast";
import { PasswordAndRepeatPasswordFields } from "@/components/forms/FormElements";
import { useRouter } from "next/navigation";

export function ChangePassword({ email }: { email: string }) {
  // router allows to close modal
  const router = useRouter();

  // alerts
  const [alert, setAlert] = useState<string>("");

  return (
    <>
      <h2>Set a new password</h2>

      <div className="my-2">
        <DisplayAlert alert={alert} setAlert={setAlert} />
      </div>
      <form
        className="flex flex-col"
        action={async (formData) => {
          const passwordInput = formData.get("repeatpassword");
          // check if passwords match
          if (formData.get("password") !== formData.get("repeatpassword")) {
            return setAlert("Passwords do not match");
          }

          // client-side input validation
          const result = UserSchema.shape.password.safeParse(passwordInput);
          if (!result.success) {
            // create and display errorMessage
            const errorMessage = result.error.issues[0].message;
            setAlert(errorMessage);
            return;
          }

          // form calls server action, pass in validated values
          const { data, error } = await setNewPassword(result.data);

          if (error) {
            setAlert(error);
          }
          if (data) {
            toast.success("Password changed");
            // close modal
            router.back();
          }
        }}
      >
        {/* Hidden field for accessibility */}
        <input
          type="email"
          autoComplete="email"
          hidden
          value={email}
          name="email"
          id="email"
          readOnly={true}
        />
        <PasswordAndRepeatPasswordFields />

        <ModalButtons router={router} />
      </form>
    </>
  );
}
