// HTML standard Modal with dialog-element
"use client";

import { useEffect, useRef } from "react";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import { useOnClickOutside } from "usehooks-ts";
import { BiX } from "react-icons/bi";

type HtmlModalProps = {
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  children: ReactNode;
};

function HtmlModal({ showModal, setShowModal, children }: HtmlModalProps) {
  // helper to open and close modal
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (showModal) {
      ref.current?.showModal();
    } else {
      ref.current?.close();
    }
  }, [showModal]);

  // Close modal when user clicks outside
  const innerModalRef = useRef(null);
  useOnClickOutside(innerModalRef, () => {
    console.log("clicked outside");
    setShowModal(false);
  });

  return (
    <dialog
      ref={ref}
      onCancel={() => setShowModal(true)}
      className=" bg-background shadow-2xl backdrop:bg-black/50 backdrop:backdrop-blur-sm md:w-[500px]"
    >
      <div ref={innerModalRef}>
        <div className=" pr-3 pt-3 text-right">
          <button
            onClick={() => {
              console.log("button clicked");
              setShowModal(false);
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

export default HtmlModal;

/*
EXEMPLE USAGE On A PAGE

<HtmlModal openModal={showModal} closeModal={() => setShowModal(false)}>
          <h2>Are you sure?</h2>
          <div>This can't be undone</div>
          <div className="flex gap-4 mt-5">
            <button
              className="bg-orange-500 p-2 rounded-md"
              onClick={() => {
                setShowModal(false);
              }}
            >
              Cancel
            </button>
            <button
              className="bg-green-500 p-2 rounded-md"
              onClick={() => {
                setDeleteConfirm(true);
                setShowModal(false);
              }}
            >
              Continue
            </button>
          </div>
        </HtmlModal> */
