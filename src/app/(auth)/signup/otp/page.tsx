"use client"

import { OneTimeCode } from "@/components/forms/OneTimeCode";

export default function Otp() {



//     // Step 3: redicect user to dashboard
//   useEffect(() => {
//     if (!otpConfirmed) return;
//     toast.success("Sign-up-process complete. Redirecting to dashboard");
//     redirectToDashboard();
//   }, [otpConfirmed]);

  // Step 2: Enter OTP
  
    return (
      <div className="flex w-full flex-col border-[1px] border-dotted border-accent p-5 shadow-sm">
        <div className="my-2">
          Hans will send you an email with an one-time-code to confirm your
          request. This may take a few minutes. Please check your spam-folder as
          well.
        </div>
        {/* <OneTimeCode
          email={email}
          setOtpConfirmed={setOtpConfirmed}
          type={"email"}
        /> */}
      </div>
    );


}