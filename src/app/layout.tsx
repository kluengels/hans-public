// main layout of App

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar/navbar";
import { Toaster } from "react-hot-toast";
import { BiSolidHeart } from "react-icons/bi";
import Link from "next/link";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HANS - AI powered transcription",
  description: "Convert speech to text",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} flex min-h-screen flex-col bg-accent  text-text`}
      >
        {/* show alerts */}
        <Toaster />

        {/* Navbar */}
        <header className="border-b-[1px] border-white bg-accent ">
          <div className="mx-auto max-w-[1280px] bg-accent px-2">
            <Navbar />
          </div>
        </header>

        {/* Main Container */}
        <main className="w-full flex-auto bg-background">
          <div className="mx-auto my-5 w-full max-w-[1280px] bg-background  px-2">
            {children}
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-text py-2 text-white print:hidden">
          <div className="font-background mx-auto flex max-w-[1280px] justify-center gap-1 bg-text px-2 text-center text-sm ">
            made with <BiSolidHeart className="relative top-1 text-action" /> in
            Cologne |{" "}
            <Link
              href={"/imprint"}
              className="hover:text-action hover:underline"
            >
              Imprint / Contact
            </Link>
          </div>
        </footer>
      </body>
      {/* Umami Analytics, loaded after all other ressources has been fetched */}
      <Script
        src={process.env.NEXT_UMAMI_URL!}
        data-website-id={process.env.NEXT_UMAMI_ID!}
        strategy="lazyOnload"
      />
      <Script id="ybug">
        {`(function() {
    window.ybug_settings = {"id":"${process.env.NEXT_YBUG!}"};
    var ybug = document.createElement('script'); ybug.type = 'text/javascript'; ybug.async = true;
    ybug.src = 'https://widget.ybug.io/button/'+window.ybug_settings.id+'.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ybug, s);
})();`}
      </Script>
    </html>
  );
}
