/* Upload form, will check if user has set an API key or sufficient free credits,
will extract audio from video file locally,
triggers server action to fetch transcript
*/

"use client";

import { useState, useCallback, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import UploadButton from "./buttons";
import { ProjectSchema } from "@/lib/types";

// toast
import { toast } from "react-hot-toast";

// Dropzone for upload
import {
  DropzoneInputProps,
  DropzoneRootProps,
  useDropzone,
} from "react-dropzone";

// modals
import HtmlModal from "@/components/ui/modals/HtmlModal";
import { SetOpenAiKeyModal } from "./_modals/SetOpenAiKeyModal";
import { OpenAiPricingModal } from "./_modals/OpenAiPricingModal";
import { FreeCreditsModal } from "./_modals/FreeCreditsModal";

// Icons
import { BiCloudUpload as CloudArrowUpIcon } from "react-icons/bi";

// server acions
import { uploadServerAction } from "./_server/uploadServerAction";
import { getCredits, getOpenAiKey } from "@/lib/supabase/actions";
import { extractAudio } from "./extractAudio";

// size config
const maxInputSize: number =
  Number(process.env.NEXT_PUBLIC_MAX_FILE_SIZE) || 1e9; // 1000 MB ( 1e9) - max file size upload

function UploadForm({ userId }: { userId: string }) {
  // redirect to other routes
  const router = useRouter();

  // error states in form
  const [descriptionWarning, setDescriptionWarning] = useState(false);
  const [projectNameWarning, setProjectNameWarning] = useState(false);

  // state for input file
  const [file, setFile] = useState<File | undefined>();
  const [duration, setDuration] = useState<number>();

  // project-text-input states
  const [descriptionValue, setDescriptionValue] = useState("");
  const [projectameValue, setProjectnameValue] = useState("");

  // user credits
  const [userCredits, setUserCredits] = useState<number>();

  // pending state
  const [pending, setPending] = useState(false);
  const [gettingDuration, setGettingDuration] = useState(false);

  // modals will be shown onSubmit
  const [showOpenAiKeyModal, setShowOpenAiKeyModal] = useState(false);
  const [showOpenAiPricingModal, setShowOpenAiPricingModal] = useState(false);
  const [showFreeCreditsModal, setShowFreeCreditsModal] = useState(false);

  // useEffect(() => {
  //   console.log("showOpenAiKeyModal", showOpenAiKeyModal);
  //   console.log("showOpenAiPricingModal", showOpenAiPricingModal);
  //   console.log("showFreeCreditsModal", showFreeCreditsModal);
  // }, [showOpenAiKeyModal, showOpenAiPricingModal, showFreeCreditsModal]);

  // sate that triggers server action
  const [confirmedModal, setConfirmedModal] = useState(false);

  // Dropzone hook
  const onDrop = useCallback((acceptedFiles: any) => {
    console.log(acceptedFiles[0]);

    // check file size (limit 10000 MB)
    if (
      acceptedFiles[0].size >
      (Number(process.env.NEXT_PUBLIC_MAX_FILE_SIZE) || 1000000000)
    ) {
      toast.error(
        "Sorry, the selected file is too big. Please try another file",
      );
      setFile(undefined);
      return;
    }
    setFile(acceptedFiles[0]);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true,
    accept: acceptedFileTpyes,
    multiple: false,
  });

  // Uuse effect to get duration of file to upload
  useEffect(() => {
    if (!file) return;
    setDuration(undefined);
    // setting state to disable button as long as duration is calculated
    setGettingDuration(true);

    // create Audio object as soon as file exists
    const url = URL.createObjectURL(file);
    const audio = new Audio(url);

    // get Duration
    const getDuration = () => {
      setDuration(audio.duration);
      setGettingDuration(false);
    };

    // wait for loading audio
    audio.addEventListener("durationchange", getDuration, false);

    // cleanup
    return () => {
      audio.removeEventListener("durationchange", getDuration, false);
      URL.revokeObjectURL(url);
      console.log("event listener removed");
      setGettingDuration(false);
    };
  }, [file]);

  // use Effect triggers API call after user confirmed Pricing
  useEffect(() => {
    // define async server Action function
    const runServerAction = async (formData: FormData, file: File) => {
      // prepare Server action
      setPending(true);

      // (video) formats that will be converted
      const videoFormats = [
        "video/mp4",
        "video/quicktime",
        "video/webm",
        "video/x-sgi-movie",
        "video/ogg",
        "video/mpeg",
        "video/x-msvideo",
        "video/x-ms-wmv",
        "video/x-flv",
        "video/x-matroska",
        "audio/x-matroska",
        "video/3gpp",
        "audio/wav",
      ];

      // run local conversion if file is video
      if (videoFormats.includes(file.type)) {
        const convertToast = toast.loading(
          "Converting to MP3. Please wait. This may take a few minutes.",
        );

        // try to convert
        try {
          const converted = await extractAudio(file);

          if (converted.size > maxInputSize) {
            toast.error(
              "The selected file is too large, please try a smaller one",
              {
                id: convertToast,
              },
            );

            // reset states
            setFile(undefined);
            setDuration(undefined);
            setConfirmedModal(false);
            setPending(false);
            return;
          }
          formData.append("file", converted);
          toast.success("Extracted the audio from your file", {
            id: convertToast,
          });
        } catch (error) {
          console.log(error);

          toast.error(
            `Sorry, we could not extract the audio from your video input. Please try again with a different file.`,
            { id: convertToast },
          );

          // reset states
          setFile(undefined);
          setDuration(undefined);
          setConfirmedModal(false);
          setPending(false);
          return;
        }
      } else {
        if (file.size > maxInputSize) {
          toast.error("You're file is too large");
          setConfirmedModal(false);
          setPending(false);
          return;
        }
        formData.append("file", file);
      }

      // create toast for sever action
      const toastId = toast.loading(
        "Getting your transcript. This may take a few minutes...",
      );

      console.log("starting server action");
      //  server action
      const { error, data: projectId } = await uploadServerAction(formData);
      if (error || !projectId) {
        // update toast
        toast.error(error ?? "Something went wrong", { id: toastId });
        // reset states
        setPending(false);
        setConfirmedModal(false);
        return;
      }
      setPending(false);
      //  update toast
      toast.success(`Your project "${projectameValue}" is ready`, {
        id: toastId,
      });
      //redirect user to new project if still on upload page
      if (window.location.pathname === "/upload") {
        router.push(`/projects/${projectId}`);
      }
    };

    if (!confirmedModal || !file || !projectameValue)
      return setConfirmedModal(false);

    // create form data
    const formData = new FormData();

    formData.append("projectname", projectameValue);
    formData.append("description", descriptionValue);

    // run server action function
    runServerAction(formData, file);
  }, [confirmedModal, file, projectameValue, descriptionValue, router]);

  // Button will trigger confirm modals
  async function handleUploadButton(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!file) return toast.error("Please select a file");
    if (!duration)
      return toast.error(
        "Please wait until we calculated the duration of your audio file",
      );

    // validation of projectName
    const resultProjectName =
      ProjectSchema.shape.projectname.safeParse(projectameValue);
    if (!resultProjectName.success) {
      setProjectNameWarning(true);
      return;
    }
    setProjectnameValue(resultProjectName.data);

    // validation of description
    const resultDescription =
      ProjectSchema.shape.description.safeParse(descriptionValue);
    if (!resultDescription.success) {
      // const errorMessage = resultDescription.error.issues[0].message;
      setDescriptionWarning(true);
      return;
    }
    setDescriptionValue(resultDescription.data);

    // **** check if user has enough credits or an API key set (will be done on sever-side as well)
    // get credits
    const { data: credits, error: errorCredits } = await getCredits(userId);
    if (errorCredits || credits === undefined || credits === null) {
      return toast.error("Failed to fetch free credits");
    }
    setUserCredits(credits);

    // get openAiKey
    const { data: openAiKey, error: errorKEy } = await getOpenAiKey(userId);

    // open modal to let user enter his own OpenAi key if free credits are unsufficent and no key is set yet
    if (credits - duration < 0 && (!openAiKey || errorKEy)) {
      setShowOpenAiKeyModal(true);
      // open modal with pricing info if free credits are unsufficent but a key is set
    } else if (credits - duration < 0 && openAiKey) {
      setShowOpenAiPricingModal(true);
      // open modal with info about free credits if they are suffienct
    } else if (credits - duration > 0) {
      setShowFreeCreditsModal(true);
    } else {
      toast.error(
        "Your do not have enough free credits and an API-key for OpenAI could not be found",
      );
    }
    return;
  }

  return (
    <>
      <div className="flex w-full flex-col border-[1px] border-dotted border-accent p-5 shadow-sm">
        {/* Form */}
        <form className="flex flex-col" onSubmit={handleUploadButton}>
          <label htmlFor="projectname" className="mt-4 flex flex-col">
            <div className="mb-1 text-sm">Choose a projectname</div>
            <input
              required
              type="string"
              placeholder="projectname"
              name="projectname"
              id="projectname"
              autoComplete="off"
              minLength={1}
              maxLength={25}
              value={projectameValue}
              onChange={(e) => {
                const projectname = e.target.value;
                setProjectnameValue(projectname);
              }}
              className={`peer bg-gray-50 p-1 focus:border-action focus:outline-none focus:ring ${
                projectNameWarning &&
                "border-solid [&:not(:placeholder-shown):not(:focus)]:border-2 [&:not(:placeholder-shown):not(:focus)]:border-warning"
              } `}
            ></input>
            {projectNameWarning && (
              <span
                className={`mt-2 hidden text-sm text-warning peer-[&:not(:placeholder-shown):not(:focus)]:block`}
              >
                Your projectname can be 1 to 25 characters, please avoid special
                characters.
              </span>
            )}
          </label>

          <label htmlFor="description" className="mt-4 flex flex-col">
            <span className="mb-1 text-sm">Choose a description</span>
            <textarea
              className={`peer bg-gray-50 p-1 focus:border-action focus:outline-none focus:ring ${
                descriptionWarning &&
                "border-solid [&:not(:placeholder-shown):not(:focus)]:border-2 [&:not(:placeholder-shown):not(:focus)]:border-warning"
              } `}
              name="description"
              placeholder="description (300 chararcters max, no special characters)"
              maxLength={300}
              id="description"
              onChange={(e) => {
                setDescriptionValue(e.target.value);
              }}
              value={descriptionValue}
              rows={5}
            />
            {descriptionWarning && (
              <span
                className={`mt-2 hidden text-sm text-warning peer-[&:not(:placeholder-shown):not(:focus)]:block`}
              >
                Your description may be up to 300 chararcters long, please avoid
                special characters.
              </span>
            )}
          </label>
          <div className="flex flex-col gap-1">
            <Dropzone
              getRootProps={getRootProps}
              getInputProps={getInputProps}
              isDragActive={isDragActive}
              file={file}
              duration={duration}
            />
          </div>

          <label htmlFor="checkbox" className="gp-2 mt-4 ">
            <input
              type="checkbox"
              name="checkbox"
              id="checkbox"
              required
              className="peer  bg-gray-50"
            />
            <span className="flex-1 break-after-column">
              {" "}
              I am aware that Hans is a non-commercial demo project and{" "}
              <Link href="/legal" className="underline decoration-action">
                should not be used with sensitive data
              </Link>
              .
            </span>

            <span className=" mt-2  flex text-sm text-warning peer-checked:invisible  ">
              You need to agree before you can continue.
            </span>
          </label>

          <UploadButton pending={pending} gettingDuration={gettingDuration} />
        </form>

        {/* modals  */}
        {showOpenAiKeyModal && duration && (
          <HtmlModal
            showModal={showOpenAiKeyModal}
            setShowModal={setShowOpenAiKeyModal}
          >
            <SetOpenAiKeyModal
              setShowModal={setShowOpenAiKeyModal}
              duration={duration}
              setConfirmedModal={setConfirmedModal}
            />
          </HtmlModal>
        )}
        {showOpenAiPricingModal && duration && (
          <HtmlModal
            showModal={showOpenAiPricingModal}
            setShowModal={setShowOpenAiPricingModal}
          >
            <OpenAiPricingModal
              setShowModal={setShowOpenAiPricingModal}
              duration={duration}
              setConfirmedModal={setConfirmedModal}
            />
          </HtmlModal>
        )}
        {showFreeCreditsModal && duration && userCredits && (
          <HtmlModal
            showModal={showFreeCreditsModal}
            setShowModal={setShowFreeCreditsModal}
          >
            <FreeCreditsModal
              setShowModal={setShowFreeCreditsModal}
              duration={duration}
              credits={userCredits}
              setConfirmedModal={setConfirmedModal}
            />
          </HtmlModal>
        )}
      </div>
    </>
  );
}

export default UploadForm;

interface IDropzoneProps {
  getRootProps: <T extends DropzoneRootProps>(props?: T | undefined) => T;
  getInputProps: <T extends DropzoneInputProps>(props?: T | undefined) => T;
  isDragActive: boolean;
  file: File | undefined;
  duration: number | undefined;
}

// Dropzone UI
const Dropzone = ({
  getRootProps,
  getInputProps,
  isDragActive,
  file,
  duration,
}: IDropzoneProps) => {
  return (
    <>
      <div className="mt-5 flex w-full flex-col items-center justify-center  ">
        <label
          htmlFor="dropzone-file"
          className="dark:hover:bg-bray-800 flex h-64 w-full cursor-pointer flex-col items-center  justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:border-gray-500 dark:hover:bg-gray-600"
        >
          <div {...getRootProps()}>
            <input {...getInputProps()} id="dropzone-file" />
            {isDragActive ? (
              <p className="h-full w-full">Drop the file here ...</p>
            ) : (
              <div className="flex flex-col items-center justify-center pb-6 pt-5">
                <CloudArrowUpIcon className="h-20 text-gray-500" />
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">
                    Click to upload or drag and drop
                  </span>
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Only audio and video-files allowed
                </p>
              </div>
            )}
          </div>
          <aside
            className={`${file ? "visible" : "invisible"}  p-2 font-bold `}
          >
            <span>
              Selected file: {file?.name}, size:{" "}
              {file && Number(file?.size / 1000000).toFixed(2)} MB
              {duration && `, duration: ${formatDuration(duration)}`}
            </span>
          </aside>
        </label>
      </div>
    </>
  );
};

const acceptedFileTpyes = {
  // //Supported audio formats by OpenAI: ['flac', 'm4a', 'mp3', 'mp4', 'mpeg', 'mpga', 'oga', 'ogg', 'wav', 'webm']
  "audio/flac": [".flac"],
  "audio/m4a": [".m4a"],
  "audio/mpeg": [".mp3"],
  "audio/mp4": [".mp4"],
  "audio/mp3": [".mpga"],
  "audio/oga": [".oga"],
  "audio/ogg": [".ogg", ".oga"],
  "audio/wav": [".wav"],
  // Optional: Add Audio file types that can be converted

  // // Video files that can be converted
  "video/mp4": [".mp4", ".m4a", ".m4p", ".m4b", ".m4r", ".m4v"],
  "video/quicktime": [".mov", ".qt"],
  "video/webm": [".webm"],
  "video/x-sgi-movie": [".mv", ".movie", ".sgi"],
  "video/ogg": [".ogg", ".ogv"],
  "video/mpeg": [".mpeg", ".mpg", ".mpe"],
  "video/x-msvideo": [".avi"],
  "video/x-ms-wmv": [".wmv"],
  "video/x-flv": [".flv"],
  "video/x-matroska": [".mkv"],
  "video/3gpp": [".3gp"],
};

function formatDuration(duration: number) {
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration % 3600) / 60);
  const seconds = Math.floor((duration % 3600) % 60);
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")} (hh:mm:ss)`;
}
