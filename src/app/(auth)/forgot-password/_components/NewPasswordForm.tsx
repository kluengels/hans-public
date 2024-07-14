// let user set a new password 

"use client";


import { setNewPassword } from "@/lib/supabase/actions";
import { redirectToDashboard } from "@/components/redirectToDashboard";
import toast from "react-hot-toast";

import { UserSchema } from "@/lib/types";
import { PasswordAndRepeatPasswordFields } from "@/components/forms/FormElements";
import SubmitButton from "@/components/forms/SubmitButton";

export default function NewPasswordForm({ email }: { email: string }) {
  return (
    <>
      <div className="w-full">
        <form
          className="flex flex-col"
          action={async (formData) => {
            // check if passwords match
            if (formData.get("password") !== formData.get("repeatpassword")) {
              return toast.error("Passwords do not match");
            }

            // get Password from formData
            const newPassword = formData.get("password");

            // client-side input validation
            const result = UserSchema.shape.username.safeParse(newPassword);
            if (!result.success) {
              // create and display errorMessage
              const errorMessage = result.error.issues[0].message;
              toast.error(errorMessage);
              return;
            }

            // form calls server action, pass in validated values
            const { data, error } = await setNewPassword(result.data);

            if (error) {
              toast.error(error);
            }
            if (data) {
              toast.success(
                "Password has been changed, redirecting to Dashboard",
              );

              // redirect via server action
              await redirectToDashboard();
            }
          }}
        >
          {/* hidden input field for accessibility */}
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

          {/* Button has pending logic included, must be server component */}
          <SubmitButton />
         
        </form>
      </div>
    </>
  );
}
