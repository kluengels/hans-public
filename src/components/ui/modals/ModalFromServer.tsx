// HTML standard Modal with dialog-element, called via url params
"use client";

import { useRouter } from "next/navigation";
import { useLayoutEffect, useRef, type ReactNode } from "react";
import { BiX } from "react-icons/bi";
import { useOnClickOutside } from "usehooks-ts";

type HtmlModalProps = {
  children: ReactNode;
};

function HtmlModalFromServer({ children }: HtmlModalProps) {
  // router allwows to close modal
  const router = useRouter();

  // ref to modal
  const modal = useRef<HTMLDialogElement>(null);
  useLayoutEffect(() => {
    if (!modal.current) return;
    modal.current.showModal();
  }, [modal]);

  // Close modal when user clicks outside
  const innerModalRef = useRef(null);
  useOnClickOutside(innerModalRef, () => router.back());

  return (
    <dialog
      className=" absolute top-20 bg-background shadow-2xl backdrop-blur-md backdrop:bg-black/50 md:w-[500px]"
      ref={modal}
    >
      <div ref={innerModalRef}>
        <div className=" pr-3 pt-3 text-right">
          <button
            onClick={() => {
              router.back();
            }}
            className="p-1 "
          >
            <BiX className="h-6 w-6" />
          </button>
        </div>

        <div className="px-5  pb-6"> {children}</div>
      </div>
    </dialog>
  );
}

export default HtmlModalFromServer;
