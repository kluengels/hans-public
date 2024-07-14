// Support page with FAQs

import PageTitleAnimated from "@/components/ui/PageTitleAnimated";
import Image from "next/image";
import Link from "next/link";

export default function Support() {
  return (
    <>
      <div className="mx-8">
        <PageTitleAnimated>Support 🛟</PageTitleAnimated>
        <section className="my-4">
          <h2>FAQs</h2>
          <details className="my-2">
            <summary className="text-lg hover:cursor-pointer">
              Which files can be processed by HANS?
            </summary>
            <p className="mt-2">
              HANS is able to process common audio and video file types. Behind
              the scenes video files are converted into audio files and big
              audio files are split into smaller chunks. In case you get an
              error message telling you that the file is still too big, you
              might consider splitting it into smaller chunks by yourself. This
              can be achived with open source tools like the{" "}
              <a
                href="https://www.videolan.org/vlc/"
                className="underline decoration-action"
              >
                VLC media player
              </a>
              .
            </p>
          </details>
          <details className="my-2">
            <summary className="text-lg hover:cursor-pointer">
              How much do you charge for a minute of transcription?
            </summary>
            <p className="mt-2">
              As of now you get credits for ten minutes of transcription for
              free when you sign up for HANS. You might use your own OpenAI API
              key if you would like to continue using the app after you consumed
              your free credits. Last time we looked it up OpenAI charged{" "}
              {process.env.NEXT_PUBLIC_OPENAI_PRICE} US-dollars per minute.
            </p>
          </details>
          <details className="my-2">
            <summary className="text-lg hover:cursor-pointer">
              How do I get an OpenAI API Key?
            </summary>
            <p className="mt-2">
              Super easy! First, create an{" "}
              <a
                href="https://platform.openai.com/signup"
                className="underline decoration-action"
              >
                OpenAI account
              </a>{" "}
              or{" "}
              <a
                href="https://platform.openai.com/login"
                className="underline decoration-action"
              >
                sign in
              </a>
              . Next, navigate to the{" "}
              <a
                href="https://platform.openai.com/account/api-keys"
                className="underline decoration-action"
              >
                API key page
              </a>{" "}
              and `&quot;Create new secret key`&quot;. Make sure to{" "}
              <a
                href="https://platform.openai.com/settings/organization/billing/overview"
                className="underline decoration-action"
              >
                load some credits
              </a>{" "}
              to your account.
            </p>
            <Image
              src="/faq/openaikey.png"
              width={600}
              height={600}
              alt="Screenshot of OpenAI API key site"
              className="my-4"
            />
          </details>
          <details className="my-2">
            <summary className="text-lg hover:cursor-pointer">
              How can I record the audio of a meeting?
            </summary>
            <p className="mt-2">
              Tools like Zoom, Microsoft Teams or Google Meet offer recordings,
              but in most cases that is limited to paid accounts and can only be
              started by the host. You can circumvent that by using a screen
              recorder. We recommend using the open source tool{" "}
              <a
                href="https://obsproject.com/"
                className="underline decoration-action"
              >
                OBS Studio
              </a>
              . Make sure Desktop audio and your microfone are selected in the
              audio mixer.
              <Image
                src="/faq/obsstudio.png"
                width={600}
                height={600}
                alt="Screenshot of OBS Studio"
                className="my-4"
              />
              If you are on a mac you might need to{" "}
              <a
                href="https://guusbaggermans.medium.com/how-to-record-any-meeting-on-your-mac-using-only-free-software-7db340f5db45"
                className="underline decoration-action"
              >
                install an additional plugin
              </a>
              . Please make sure to ask participants for their permission before
              you record a meeting.
            </p>
          </details>
          <details className="my-2">
            <summary className="text-lg hover:cursor-pointer">
              Is HANS safe to use?
            </summary>
            <p className="mt-2">
              We have done our best to make HANS as safe as possible. However
              HANS is still in developement and we recommend not using the app
              for any kind of sensitive, confidential recordings. Our database
              is hosted on a virtual private server located in Germany. The
              text-to-speech-transformation is achieved via an application
              programming interface (API) to OpenAI. The company may use servers
              in the USA or other countries.
            </p>
          </details>
        </section>
        <section className="my-4"></section>
        <h2>Error reporting</h2>
        <p className="my-2">
          As HANS is still in developement, it is very likely that there are
          still bugs hidden in the app. Help us to track them down by reporting
          errors via the Feedback button. Alternatively, you can send us a
          message using the contact form on the{" "}
          <Link href={"/imprint"} className="underline decoration-action">
            imprint page
          </Link>
          .
        </p>
      </div>
    </>
  );
}
