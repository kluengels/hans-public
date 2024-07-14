// Login form client-side, will call server acion

import PageTitleAnimated from "@/components/ui/PageTitleAnimated";
import LoginForm from "./_components/form";
import Link from "next/link";

export default async function Login() {
  return (
    <>
      <div className="max-w-96 mx-auto ">
        <PageTitleAnimated>Please login 👇</PageTitleAnimated>
        <div className="flex justify-center">
          <LoginForm />
        </div>
        <div className="flex flex-col justify-center gap-2">
          <button className="mt-10 text-action hover:underline">
            <Link href="/signup">No account yet? Sign up here!</Link>
          </button>
          <button className="text-action hover:underline">
            <Link href="/forgot-password">Forgot your password?</Link>
          </button>
        </div>
      </div>
    </>
  );
}
