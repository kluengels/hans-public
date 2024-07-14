/* renders a toast alert, can be called from server component */

"use client";


import { ReactNode, useEffect } from "react";
import toast from "react-hot-toast";

export function ToastWrapper({
  type,
  message,
}: {
  type: "error" | "success" | "promise";
  message: string;
}) : ReactNode {
  useEffect(() => {
    if (type === "error") {
        toast.error(message)
    } else if (type === "success") {
        toast.success(message)
    } else {
        return;
    }



  }, [type, message]);
  return;
}
