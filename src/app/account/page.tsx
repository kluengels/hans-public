import PageTitleAnimated from "@/components/ui/PageTitleAnimated";
import Link from "next/link";
import { createSupabaseSeverComponentClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getCredits, getOpenAiKey } from "@/lib/supabase/actions";
import { Suspense } from "react";
import { LoadingComponent } from "@/components/ui/LoadingComponent";
import { BiEdit, BiTrash } from "react-icons/bi";

// Modals
import HtmlModalFromServer from "@/components/ui/modals/ModalFromServer";
import { ChangeEmail } from "./_components/ChangeEmail";
import ConfirmEmailChange from "./_components/ConfirmEmailChange";
import { ChangeUserName } from "./_components/ChangeUserName";
import { ChangePassword } from "./_components/ChangePassword";
import { ChangeApiKey } from "./_components/ChangeApiKey";
import { DeleteAccount } from "./_components/DeleteAccount";
import { DeleteApiKey } from "./_components/DeleteApiKey";

export default async function Account({
  searchParams,
}: {
  searchParams?: { [key: string]: string | undefined };
}) {
  // get url params for opening modals
  const modal = searchParams?.modal;
  const newEmail = searchParams?.newmail;

  // get user from supabase auth
  const supabase = createSupabaseSeverComponentClient();
  const { error, data: user } = await supabase.auth.getUser();
  if (error || !user) redirect("/error");

  // get API key from supabase
  const { data: apiKeyData } = await getOpenAiKey(user.user.id);
  let apiKey = "";
  if (apiKeyData) {
    apiKey = apiKeyData;
  }

  // get number of free credits
  const { data: credits } = await getCredits(user.user.id);

  return (
    <>
      <section className="mx-auto max-w-96 ">
        <PageTitleAnimated>Settings 🤝</PageTitleAnimated>
        <Suspense fallback={<LoadingComponent text="settings" />}>
          <div className="flex justify-center">
            <div className="flex w-full flex-col border-[1px] border-dotted border-accent p-5 shadow-sm">
              <h2 className="mb-2">Your HANS-Account</h2>

              {/* Email */}
              <div className="flex flex-row items-center gap-1">
                <span className="font-bold">E-Mail:</span>
                <span className="">{user.user.email}</span>
                <Link
                  className="rounded-md p-1 hover:bg-actionlight"
                  href={`/account?modal=email`}
                >
                  <BiEdit />
                </Link>

                {modal === "email" && (
                  <HtmlModalFromServer>
                    {newEmail && user.user.email ? (
                      <ConfirmEmailChange
                        oldEmail={user.user.email}
                        newEmail={newEmail}
                      />
                    ) : (
                      <ChangeEmail oldEmail={user.user.email} />
                    )}
                  </HtmlModalFromServer>
                )}
              </div>

              {/* Username */}
              <div className="flex flex-row items-center gap-1">
                <span className="font-bold">Username:</span>
                <span className="">
                  {user.user.user_metadata.username ?? "not set"}
                </span>
                <Link
                  className="rounded-md p-1 hover:bg-actionlight"
                  href={`/account?modal=username`}
                >
                  <BiEdit />
                </Link>
                {modal === "username" && (
                  <HtmlModalFromServer>
                    <ChangeUserName
                      oldUsername={user.user.user_metadata.username}
                    />
                  </HtmlModalFromServer>
                )}
              </div>

              {/* Password */}
              <div className="flex flex-row items-center gap-1">
                <span className="font-bold">Password:</span>
                <span className="">
                  &#183;&#183;&#183;&#183;&#183;&#183;&#183;
                </span>
                <Link
                  className="rounded-md p-1 hover:bg-actionlight"
                  href={`/account?modal=password`}
                >
                  <BiEdit />
                </Link>
                {modal === "password" && user.user.email && (
                  <HtmlModalFromServer>
                    <ChangePassword email={user.user.email} />
                  </HtmlModalFromServer>
                )}
              </div>

              {/* OpenAiKey */}
              <h2 className="mb-2 mt-4">Credits</h2>

              <div className="mb-2">
                As soon as you consumed your free credits you need an{" "}
                <Link href={"/support"} className="underline decoration-action">
                  API-key from OpenAI
                </Link>{" "}
                to fuel Hans&apos; transcription capabilites.
              </div>
              <div className="flex flex-row items-center gap-1">
                <span className="font-bold">Free credits:</span>
                <span>{credits}</span>
              </div>
              <div className="flex flex-row items-center gap-1">
                <span className="font-bold">API-Key:</span>
                <span className="">
                  {apiKey ? (
                    apiKey.slice(0, 5) +
                    "·······················" +
                    apiKey.slice(-5)
                  ) : (
                    <span className="italic"> no key set yet</span>
                  )}
                </span>
                <Link
                  className="rounded-md p-1 hover:bg-actionlight"
                  href={`/account?modal=apikey`}
                >
                  <BiEdit />
                </Link>
                {apiKey.length > 0 && (
                  <Link
                    className="rounded-md p-1 hover:bg-actionlight"
                    href={`/account?modal=deleteapikey`}
                  >
                    {" "}
                    <BiTrash />
                  </Link>
                )}
                {modal === "apikey" && (
                  <HtmlModalFromServer>
                    <ChangeApiKey oldApiKey={apiKey} />
                  </HtmlModalFromServer>
                )}
                {modal === "deleteapikey" && (
                  <HtmlModalFromServer>
                    <DeleteApiKey />
                  </HtmlModalFromServer>
                )}
              </div>

              {/* Delete account button */}
              <div className="mt-6 flex justify-end">
                <Link
                  className="flex flex-row items-center justify-end gap-1 rounded-md p-2 hover:bg-actionlight"
                  href={`/account?modal=delete`}
                >
                  Delete account
                  <BiTrash />
                </Link>
                {modal === "delete" && user.user.email && (
                  <HtmlModalFromServer>
                    <DeleteAccount userEmail={user.user.email} />
                  </HtmlModalFromServer>
                )}
              </div>
            </div>
          </div>
        </Suspense>
      </section>
    </>
  );
}
