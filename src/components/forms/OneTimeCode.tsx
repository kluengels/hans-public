/* Form to enter OTP code for sign-up, password recovery and email change
Offers the possibility to resend a new code,
return a state update to caller function in success case
*/


import { OTPInput, SlotProps } from "input-otp";
import { Dispatch, SetStateAction, useState } from "react";
import { confirmOtp, resendCode, resetPassword } from "@/lib/supabase/actions";
import DisplayAlert from "../ui/DisplayAlert";

export function OneTimeCode({
  email,
  setOtpConfirmed,
  type,
 
}: {
  email: string;
  setOtpConfirmed: Dispatch<SetStateAction<boolean>>;
  type: "email" | "recovery" | "email_change" | "invite";
 
}) {
  

  // helper states
  const [otp, setOtp] = useState<string>("");
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [isRedirecting, setIsRedirecting] = useState<boolean>(false);

  // alert
  const [alert, setAlert] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);


  // Submit will be fired as soon as all six numbers are enterd
  async function onSubmit() {

    setIsValidating(true);
    const { data, error } = await confirmOtp(email, otp, type);
    console.log(data, error)
    if (error) {
      setSuccess(false);
      setAlert(error);
      setOtp("");
      setIsValidating(false);
    }

    if (data) {
      setSuccess(true)
      setAlert("Confirmed")
      setIsValidating(false);
      setIsRedirecting(true);
      setOtpConfirmed(true);
      
    }
  }

  return (
    <>
      <div className="my-2">
        <DisplayAlert alert={alert} setAlert={setAlert} success={success} />
      </div>
      <form className="mx-auto mt-4">
        <OTPInput
          autoFocus
          maxLength={6}
          className="max-w-full"
          containerClassName=" group flex items-center has-[:disabled]:opacity-30 "
          render={({ slots }) => (
            <>
              <div className="flex">
                {slots.map((slot, idx) => (
                  <Slot key={idx} {...slot} />
                ))}
              </div>
            </>
          )}
          onComplete={onSubmit}
          onChange={setOtp}
          value={otp}
          disabled={isRedirecting || isValidating}
        />
      </form>
      {isValidating ? (
        <span className="italic">Validating...</span>
      ) : type !== "invite" && ( 
        <button
          className="text-sm text-action hover:underline hover:decoration-action disabled:invisible"
          disabled={isRedirecting || isValidating}
          onClick={async () => {
            // reset OTP from, right server actions depends on request type parameter
            setOtp("");
            if (type === "email" || type === "email_change") {
              // run server action
              const { error } = await resendCode(
                email,
                type === "email" ? "signup" : "email_change",
              );

              // display error or success toast
              if (error) {
                setSuccess(false);
                setAlert(error);
              } else {
                setSuccess(true);
                setAlert("Code has been resent.");
              }
            } else if (type === "recovery") {
              const { data, error } = await resetPassword(email);
              if (error) {
                setSuccess(false);
                setAlert(error);
              }

              if (data) {
                setSuccess(true);
                setAlert("Code has been resent.");
              }
            }
          }}
        >
          Got no email? Send a new code
        </button>
      )}
    </>
  );
}

/* Styling of OTP form */

// Slots for single digits
function Slot(props: SlotProps) {
  return (
    <div
      className={` group-focus-within:border-accent-foreground/20 outline-accent-foreground/20 relative flex h-14 w-10 items-center justify-center 
      border-y border-r border-actionlight text-[2rem] outline outline-0 transition-all duration-300
    first:rounded-l-md first:border-l last:rounded-r-md group-hover:border-action `}
    >
      {props.char !== null && <div>{props.char}</div>}
      {props.hasFakeCaret && <FakeCaret />}
    </div>
  );
}

// Caret line
function FakeCaret() {
  return (
    <div className="pointer-events-none absolute inset-0 flex animate-caret-blink items-center justify-center">
      <div className="h-8 w-px bg-text" />
    </div>
  );
}
