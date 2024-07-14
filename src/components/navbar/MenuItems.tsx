// Links shown in Menu
"use client";
import Link from "next/link";
import { Dispatch, SetStateAction } from "react";

const routes = [
  { path: "/", name: "Home" },
  { path: "/projects", name: "Projects" },
  { path: "/upload", name: "Upload" },
  { path: "/support", name: "Support" },
  { path: "/legal", name: "Privacy Policy" },
];
export const MenuItems = ({
  setExpandMenu,
}: {
  setExpandMenu?: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <>
      {routes.map((route: { path: string; name: string }, index: number) => {
        return (
          <Link
            key={index}
            href={route.path}
            className="rounded-xl bg-background px-4 py-1 hover:bg-action hover:text-white"
            onClick={() => setExpandMenu && setExpandMenu(false)}
          >
            {route.name}
          </Link>
        );
      })}
    </>
  );
};
