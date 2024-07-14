// dynamically render favicon

import { ImageResponse } from "next/og";
import { BsRobot } from "react-icons/bs";

// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      // ImageResponse JSX element

      <div 
        style={{
          fontSize: 24,
        //   background: "#9dc5bbff",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#d72638ff",
          borderRadius: "0.75rem",
        }}
      >
        <BsRobot />
      </div>
    ),
    // ImageResponse options
    {
      // For convenience, we can re-use the exported icons size metadata
      // config to also set the ImageResponse's width and height.
      ...size,
    },
  );
}
