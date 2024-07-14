// sign up form with input validation, sign-up-process is handeled by server action
// Step 2 show form to confirm enter OTP

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { signUpUser } from "@/lib/supabase/actions";
import { OneTimeCode } from "../../../../components/forms/OneTimeCode";
import { redirectToDashboard } from "@/components/redirectToDashboard";
import toast from "react-hot-toast";
import {
  Checkbox,
  EmailField,
  PasswordAndRepeatPasswordFields,
  UserNameField,
} from "@/components/forms/FormElements";
import SubmitButton from "@/components/forms/SubmitButton";
import { useRouter } from "next/navigation";
import { UserSchema, createZodErrorMessage } from "@/lib/types";
import { useSearchParams } from "next/navigation";

export default function SignUpForm() {
  // router
  const router = useRouter();

  // helper email search params (instead of state)
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  // sucess state for OTP
  const [otpConfirmed, setOtpConfirmed] = useState<boolean>(false);

  // Step 3: redicect user to dashboard after OTP confirmation
  useEffect(() => {
    if (!otpConfirmed) return;
    toast.success("Sign-up-process complete. Redirecting to dashboard");
    redirectToDashboard();
  }, [otpConfirmed]);

  // Step 1: Sign-up-form with input validation
  async function handleSubmit(formData: FormData) {
    // check if passwords match
    if (formData.get("password") !== formData.get("repeatpassword")) {
      return toast.error("Passwords do not macth");
    }

    // constuct new user Object from formData
    const newUser = {
      email: formData.get("email"),
      password: formData.get("password"),
      username: formData.get("username"),
    };

    // client-side input validation
    const result = UserSchema.safeParse(newUser);
    if (!result.success) {
      // create and display errorMessage
      const errorMessage = createZodErrorMessage(result.error);
      toast.error(errorMessage);
      return;
    }

    // form calls server action, pass in validated values
    const { data, error } = await signUpUser(result.data);

    if (error) {
      toast.error(error);
    }
    // prepare Step 2
    if (data && data.user) {
      router.push(`?email=${data.user.email}`);
    }
  }

  // Step 2: Show OTP form
  if (email) {
    return (
      <div className="flex w-full flex-col border-[1px] border-dotted border-accent p-5 shadow-sm">
        <div className="my-2">
          Hans will send you an email with an one-time-code to confirm your
          request. This may take a few minutes. Please check your spam-folder as
          well.
        </div>
        <OneTimeCode
          email={email}
          setOtpConfirmed={setOtpConfirmed}
          type={"email"}
        />
      </div>
    );
  }
  return (
    <>
      <div>
        <div className="flex w-full flex-col border-[1px] border-dotted border-accent p-5 shadow-sm">
          <form className="flex flex-col" action={handleSubmit}>
            <EmailField />
            <UserNameField />
            <PasswordAndRepeatPasswordFields />

            <Checkbox>
              <span className="flex-1 break-after-all">
                I am aware that Hans is a non-commercial demo project and{" "}
                <Link href="/legal" className="underline decoration-action ">
                  should not be used with sensitive data
                </Link>
                .
              </span>
            </Checkbox>

            {/* Button has pending logic included, must be server component */}
            <SubmitButton />
          </form>
        </div>
        <div className="flex flex-col justify-center gap-2">
          {" "}
          <button className="mt-10 text-action hover:underline">
            <Link href="/login">Already signed-up? Login here!</Link>
          </button>
        </div>
      </div>
    </>
  );
}
