// Step 2 of Email Change Modal: enter OTPs sent to new and old email

"use client";
import { OneTimeCode } from "@/components/forms/OneTimeCode";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function ConfirmEmailChange({
  oldEmail,
  newEmail,
}: {
  oldEmail: string;
  newEmail: string;
}) {
  // router allows to close modal
  const router = useRouter();

  // helper States for OTP confirmation
  const [otpOldEmailConfirmed, setOtpOldEmailConfirmed] =
    useState<boolean>(false);
  const [otpNewEmailConfirmed, setOtpNewEmailConfirmed] =
    useState<boolean>(false);

  // step 3: close modal if both OTPs are confirmed
  useEffect(() => {
    if (!otpNewEmailConfirmed || !otpOldEmailConfirmed) return;
    toast.success("Email address changed");
    console.log("closing modal");

    // close Modal
    router.push("/account");

  }, [otpNewEmailConfirmed, otpOldEmailConfirmed, router]);

  return (
    <>
      <h2>Confirm your request</h2>
      <div className="my-2">
        Hans will send you an email with an one-time-code to confirm your
        request both to you new and your old emailxy address. This may take a
        few minutes. Please check your spam-folder as well.
      </div>
      <div className="font-bold ">Code sent to {oldEmail}</div>
      <OneTimeCode
        email={oldEmail}
        type="email_change"
        setOtpConfirmed={setOtpOldEmailConfirmed}
      />
      <div className="my-4 font-bold">Code sent to {newEmail}</div>
      <OneTimeCode
        email={newEmail}
        type="email_change"
        setOtpConfirmed={setOtpNewEmailConfirmed}
      />
    </>
  );
}
