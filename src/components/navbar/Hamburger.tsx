"use client";

import { useRef, useState } from "react";
import { BiMenu, BiX } from "react-icons/bi";
import { useOnClickOutside } from "usehooks-ts";
import { MenuItems } from "./MenuItems";
import { User } from "@supabase/supabase-js";
import AuthButton from "./AuthButton";

export default function Hamburger({ user }: { user: User | null }) {
  const [expandMenu, setExpandMenu] = useState(false);
  const ref = useRef(null);
  useOnClickOutside(ref, () => {
    setExpandMenu(false);
  });

  return (
    <>
      {expandMenu ? (
        <div className="flex flex-col">
          <button
            className="h-12 w-12 p-2  hover:text-background "
            // onClick={() => {
            //   setExpandMenu(!expandMenu);
            // }}
          >
            <BiX className="pointer-events-none h-full w-full" />
          </button>

          <div
            ref={ref}
            className={`  absolute inset-x-0 top-[48px]  z-50 my-4 gap-2 bg-accent py-2 text-center`}
          >
            <div className=" mb-2 flex flex-col gap-3 px-4 ">
              <MenuItems setExpandMenu={setExpandMenu} />
            </div>

            <hr />
            <div className=" my-2 flex flex-col items-end gap-2 px-6">
              <AuthButton user={user} setExpandMenu={setExpandMenu} />
            </div>
          </div>
        </div>
      ) : (
        <button
          className="h-12 w-12 p-2  hover:text-background "
          onClick={() => {
            setExpandMenu(!expandMenu);
          }}
        >
          <BiMenu className="pointer-events-none h-full w-full" />
        </button>
      )}
    </>
  );
}
