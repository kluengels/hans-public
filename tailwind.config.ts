import type {Config} from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        "caret-blink": {
          "0%,70%,100%": {opacity: "1"},
          "20%,50%": {opacity: "0"},
        },
        typing: {
          "0%": {
            width: "0%",
            visibility: "hidden",
          },
          "100%": {
            width: "100%",
          },
        },
        blink: {
          "50%": {
            borderColor: "transparent",
          },
          "100%": {
            borderColor: "gray",
          },
        },
      },
      animation: {
        typing: "typing 2s steps(20) alternate, blink 0.9s infinite ",
        "caret-blink": "caret-blink 1.2s ease-out infinite",
      },
      colors: {
        background: "var(--background-color)",
        text: "var(--text-color)",
        accent: "var(--accent-color)",
        action: "var(--action-color)",
        warning: "var(--warning-color)",
        actionlight: "var(--actionlight-color)",
      },
    },
  },
  plugins: [],
};
export default config;
