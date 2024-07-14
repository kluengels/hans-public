// Sign-up form with 2 Steps: 1) Registering 2) Enter OTP

import PageTitleAnimated from "@/components/ui/PageTitleAnimated";
import SignUpForm from "./_components/SignUpForm";

export default function Signup() {
  return (
    <>
      <div className="max-w-96 mx-auto ">
        <PageTitleAnimated>Create an account 🙌</PageTitleAnimated>

        <div className="flex justify-center">
          {/* client component */}
          <SignUpForm />
        </div>
        
      </div>
    </>
  );
}
