// Informs user about cookie policy. User can decide to delete all cookies

"use client";
import { BiCookie, BiX } from "react-icons/bi";
import { getCookies, deleteCookie } from "cookies-next";
import toast from "react-hot-toast";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useOnClickOutside } from "usehooks-ts";
import { useRouter } from "next/navigation";

export default function DeleteCookiesButton() {
  // router
  const router = useRouter();

  const [showBanner, setShowBanner] = useState(false);
  const [cookiesList, setCookiesList] = useState<string[]>();

  // get list of cookies whenever banner is opened, will be stored in state
  useEffect(() => {
    if (!showBanner) return;
    const cookieObject = getCookies();
    if (cookieObject !== undefined) {
      const cookies = Object.keys(cookieObject);
      setCookiesList(cookies);
    }
  }, [showBanner]);

  // click outside closes cookie banner
  const ref = useRef(null);
  useOnClickOutside(ref, () => setShowBanner(false));

  // delete all cookies
  function handleDelete() {
    if (!cookiesList) return;
    for (const c of cookiesList) {
      deleteCookie(c);
      setShowBanner(false);
    }
    toast.success("All cookies deleted");
    // reload page
    router.push("/", { scroll: false });
  }

  return showBanner ? (
    <div className="fixed bottom-10 z-50 flex flex-row items-end">
      <BiCookie className="h-12 w-12 rounded-full border border-blue-300 bg-blue-400 p-1 text-white hover:cursor-pointer" />

      <div
        className="ml-4 mr-12 flex-1 rounded-xl bg-accent p-4 shadow-md"
        ref={ref}
      >
        <div className="flex justify-end ">
          <button
            onClick={() => {
              setShowBanner(!showBanner);
            }}
          >
            <BiX className="h-6 w-6" />
          </button>
        </div>

        <div className="max-w-[500px]">
          <h3>Cookie info</h3>
          <p>
            This app uses functionality cookies to store login-sessions and user
            preferences.{" "}
            <Link
              className="underline decoration-action hover:text-action"
              href={"/legal#cookies"}
            >
              More details on that can be found here.
            </Link>{" "}
            However, if you experience any issues using this app a cookie reset
            might help.
          </p>
          <button
            className="mt-6 rounded-xl bg-actionlight p-2 hover:bg-action hover:text-white disabled:bg-slate-200 disabled:text-text"
            disabled={cookiesList?.length === 0}
            onClick={handleDelete}
          >
            {cookiesList?.length === 0
              ? "No cookies stored"
              : "Delete all cookies"}
          </button>
        </div>
      </div>
    </div>
  ) : (
    <div className="fixed bottom-10 z-50 flex flex-row items-end">
      <button
        onClick={() => {
          setShowBanner(!showBanner);
        }}
      >
        <BiCookie className="h-12 w-12 rounded-full border border-blue-300 bg-blue-400 p-1 text-white" />
      </button>
    </div>
  );
}
