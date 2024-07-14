// Login form client-side, will call server acion

import PageTitleAnimated from "@/components/ui/PageTitleAnimated";
import RecoverForm from "./_components/RecoverForm";


export default async function Login() {
  return (
    <>
      <div className="max-w-96 mx-auto ">
        <PageTitleAnimated>Change password ✍️</PageTitleAnimated>

        <div className="flex justify-center">
        <RecoverForm />
        </div>
       
      </div>
    </>
  );
}
