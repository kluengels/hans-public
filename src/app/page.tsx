// Start page with image, description, feature list and warning banner indicating alpha status of the app

import DeleteCookiesButton from "@/components/DeleteCookiesButton";
import { PageTitleAnimatedXxl } from "@/components/ui/PageTitleAnimated";
import Warning from "@/components/ui/Warning";
import { hasCookie } from "cookies-next";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { BiCheck } from "react-icons/bi";

export default async function Home() {
  // feature list will be rendered in a box, styling and layout depends on screen size
  const featureList = [
    "Fast and high accurancy",
    "Supports video and audio files",
    "Automatic language detection",
    "Starting from $0.006 / minute",
    "Use your own OpenAI account",
    "Edit transcripts right in the app",
    "Access your project from anywhere",
    "Database hosting in Germany",
  ];

  // warning will be shown if no cookie is set
  const warningCookie = hasCookie("showWarning", { cookies });

  return (
    <>
      <DeleteCookiesButton />
      {!warningCookie && <Warning />}
      <PageTitleAnimatedXxl>HANS says hi 👋</PageTitleAnimatedXxl>

      <section className="my-8 flex flex-col gap-2 lg:my-16 lg:flex-row lg:align-middle  ">
        <div className="lg:justify-left flex justify-center lg:w-1/2 ">
          <Image
            src="/hans_dalle.jpg"
            width={500}
            height={500}
            alt="Hans at work (Image by Dall-E)"
            className="rounded-full border-2 border-solid border-action shadow-2xl"
            priority
          />
        </div>

        <div className="mt-4 text-left  lg:flex lg:w-1/2 lg:items-center  lg:text-right">
          <div className="flex flex-col  gap-6 lg:gap-20">
            <h2 className="font-bold sm:text-4xl lg:text-5xl">
              Transcription made easy
            </h2>
            <p className="text-xl sm:text-2xl">
              HANS is an AI powered robot. He will turn your voice recording
              into text - like memos to yourself, podcasts or interviews. HANS
              is very good at it, because he is powered by Whisper. Whisper is a
              machine learning model for speech recognition and transcription,
              created by OpenAI.
            </p>
            <Link
              href={"/signup"}
              className="rounded-3xl bg-action p-2 text-center text-xl  text-white  hover:shadow-2xl"
            >
              Get started for free
            </Link>
          </div>
        </div>
      </section>
      <section className="mb-20 border border-dotted border-accent p-5 md:p-10  ">
        <div className="flex flex-col items-center sm:flex-row sm:justify-between md:flex-col">
          <h2 className="font-bold md:mb-4 lg:text-4xl">Features</h2>
          <ul className="md:grid md:grid-cols-4 md:gap-4 lg:text-2xl">
            {featureList.map((value, index) => (
              <li className="flex items-center md:gap-2" key={index}>
                <BiCheck className="h-8 w-8 text-blue-400 lg:h-16 lg:w-16" />
                {value}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
