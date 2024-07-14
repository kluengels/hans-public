// Welcome message to users that are signed in + Link to settins + logout button

"use client";
import { logOut } from "@/lib/supabase/actions";
import { User } from "@supabase/supabase-js";
import Link from "next/link";
import { Dispatch, SetStateAction } from "react";

// Icons
import { BiLogIn, BiLogOut, BiCog } from "react-icons/bi";

export default function AuthButton({
  user,
  setExpandMenu,
}: {
  user: User | null;
  setExpandMenu?: Dispatch<SetStateAction<boolean>>;
}) {
  return user ? (
    <>
      Hey, {user.user_metadata.username ?? user.email}!
      <button
        className="rounded-md px-3 py-1 no-underline  hover:bg-actionlight "
        title="Settings"
        onClick={() => {
          setExpandMenu && setExpandMenu(false);
        }}
      >
        <Link href="/account" className="flex flex-row items-center gap-3">
          <p className="inline lg:hidden">Settings</p>
          <BiCog />
        </Link>
      </button>
      <button
        className=" flex flex-row items-center gap-3 rounded-md px-3 py-1 no-underline  hover:bg-actionlight "
        title="Log-Out"
        onClick={() => {
          logOut();
          setExpandMenu && setExpandMenu(false);
        }}
      >
        <p className="inline lg:hidden">Log-Out</p>
        <BiLogOut />
      </button>
    </>
  ) : (
    <button className="rounded-md px-3 py-1 no-underline hover:bg-actionlight ">
      <Link
        href="/login"
        className="flex flex-row items-center gap-3"
        onClick={() => {
          setExpandMenu && setExpandMenu(false);
        }}
      >
        <span>Login</span>
        <BiLogIn />
      </Link>
    </button>
  );
}
