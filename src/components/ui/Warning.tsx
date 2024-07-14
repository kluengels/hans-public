// Warning indicates that app is still in development
// if hidden by user, a cookie will be set to rember the choice, gets removed when browser is closed

"use client";

import { BiX } from "react-icons/bi";
import { setCookie } from "cookies-next";
import { useState } from "react";

export default function Warning() {
  const [showWarning, setShowWarning] = useState(true);
  if (showWarning) {
    return (
      <>
        <div className="mb-5 flex justify-between bg-warning p-2 font-light text-white shadow-md">
          <span>
            Warning: Though functional, this app is still in development and not
            commercial (yet). Feel free to test HANS, but please don&apos;t use
            the app whith any sensitive data.
          </span>
          <button
            className=" flex justify-start"
            onClick={() => {
              // set cookie to memorize users choise
              setCookie("showWarning", "false");
              setShowWarning(false);
            }}
          >
            {" "}
            <BiX className="ml-5 h-6 w-6" />
          </button>
        </div>
      </>
    );
  }
}
