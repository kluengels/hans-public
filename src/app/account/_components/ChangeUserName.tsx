// Content for Modal if user wants to change username

"use client";
import { useState } from "react";
import DisplayAlert from "@/components/ui/DisplayAlert";
import { setNewUsername } from "@/lib/supabase/actions";
import { UserSchema } from "@/lib/types";
import { ModalButtons } from "../../../components/ui/modals/Modalbuttons";
import toast from "react-hot-toast";
import { UserNameField } from "@/components/forms/FormElements";
import { useRouter } from "next/navigation";

export function ChangeUserName({
  oldUsername,
}: {
  oldUsername: string | undefined;
}) {
  // router allows to close modal
  const router = useRouter();

  // alerts
  const [alert, setAlert] = useState<string>("");

  return (
    <>
      <h2>Change your username</h2>
      <div className="my-2">
        <DisplayAlert alert={alert} setAlert={setAlert} />
      </div>
      <div className="my-2">
        {oldUsername ? (
          <span>
            Your current username is{" "}
            <span className="font-bold">{oldUsername}</span>
          </span>
        ) : (
          "You have no username set yet"
        )}
      </div>
      <form
        className="flex flex-col"
        action={async (formData) => {
          const newUserName = formData.get("username");
          // check if new username is different from old one
          if (oldUsername === newUserName) {
            return setAlert(
              "New username seems to be the same as the old username",
            );
          }

          // client-side input validation
          const result = UserSchema.shape.username.safeParse(newUserName);
          if (!result.success) {
            // create and display errorMessage
            const errorMessage = result.error.issues[0].message;
            setAlert(errorMessage);
            return;
          }

          // form calls server action, pass in validated values
          const { data, error } = await setNewUsername(result.data);

          if (error) {
            setAlert(error);
          }
          if (data) {
            toast.success(`Username changed to ${newUserName}`);
            // close Modal
            router.back();
          }
        }}
      >
        <UserNameField />

        <ModalButtons router={router} />
      </form>
    </>
  );
}
