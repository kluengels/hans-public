/* Audio player will play back audio file passed from sever as string.
Display text segements of transcript accordingly to audio position
 */
"use client";

import { useEffect, useState } from "react";
import AudioPlayer from "react-h5-audio-player";
import "@/components/ui/audioPlayerStyles.css";
import { TranscriptSchema } from "@/lib/types";

import { BiChevronUp } from "react-icons/bi";
import { BiChevronDown } from "react-icons/bi";

export default function Audio({
  audioBlobBase64,
  type,
  rawTranscript,
}: {
  audioBlobBase64: string;
  type: string;
  rawTranscript: TranscriptSchema["segments"];
}) {
  // create objectURL from Base-64-Data. Objecturl is used as src by player
  const [audioUrl, setAudioUrl] = useState("");
  
  useEffect(() => {
    const audioBlob = new Blob([Buffer.from(audioBlobBase64, "base64")], {
      type: `${type}`,
    });

    const url = URL.createObjectURL(audioBlob);
    setAudioUrl(url);

    // cleanup to prevent memory leaks
    return () => { 
      console.log("clean up")
       URL.revokeObjectURL(url);
       setAudioUrl("");
        };
  }, [audioBlobBase64, type]);

  const [showSegment, setShowSegment] = useState(true);

  /* Handling for audio player */

  // keep track of audio playback position
  const [audioPosition, setAudioPosition] = useState(0);

  // find segment in transcription object that belongs to playback position
  const [segment, setSegment] = useState("");
  useEffect(() => {
    if (!rawTranscript) return;

    // show first Segment when playback has not startet yet
    if (audioPosition === 0) return setSegment(rawTranscript[0].text);

    // find segment based on audio Position
    const actualSegement = rawTranscript.find(
      (segment) =>
        audioPosition > segment.start && audioPosition <= segment.end,
    );
    if (actualSegement) return setSegment(actualSegement.text);
  }, [audioPosition, rawTranscript]);

  if (!audioUrl) {
    return <div>loading</div>;
  }

  return (
    <>
      <AudioPlayer
        autoPlay={false}
        autoPlayAfterSrcChange={false}
        customAdditionalControls={[]}
        timeFormat={"hh:mm:ss"}
        style={{
          width: "100%",
          background: "var(--background-color)",
        }}
        src={audioUrl}
        onListen={(e: any) => setAudioPosition(e.target?.currentTime)}
        className="mt-3"
      />
      {showSegment ? (
        <div className="flex min-h-28 flex-row p-2 lg:min-h-fit">
          <div className="flex-auto">
            <span className="font-bold italic ">OpenAI transcript:</span>{" "}
            {segment}
          </div>

          <button
            className="flex items-end -mb-2 -mr-2"
            onClick={() => setShowSegment(!showSegment)}
            title="Hide"
          >
            <BiChevronUp className=" h-8 w-8 rounded-lg p-1 hover:bg-actionlight" />{" "}
          </button>
        </div>
      ) : (
        <div className="-mt-6 flex flex-row justify-between">
          <button onClick={() => setShowSegment(!showSegment)}>
            <BiChevronDown className="h-8 w-8 rounded-lg p-1 hover:bg-actionlight" />
          </button>
          <button onClick={() => setShowSegment(!showSegment)}>
            <BiChevronDown className="h-8 w-8 rounded-lg p-1 hover:bg-actionlight" />
          </button>
        </div>
      )}
    </>
  );
}
