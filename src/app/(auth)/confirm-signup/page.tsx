// lets user confirm their account if invited via email

import PageTitleAnimated from "@/components/ui/PageTitleAnimated";
import ConfirmSignupForm from "./_components/ConfirmSignupForm";

export default function ConfirmSignup() {
  return (
    <>
      <div className="mx-auto max-w-96 ">
        <PageTitleAnimated>Confirm signup 👇</PageTitleAnimated>
        <div className="flex justify-center">
          <ConfirmSignupForm />
        </div>
      </div>
    </>
  );
}
