import { getAudioFileUrl } from "@/lib/supabase/actions";
import Audio from "./Audio";
import { TranscriptSchema } from "@/lib/types";

export async function AudioServer({
  userId,
  projectId,
  filename,
  rawTranscript,
}: {
  userId: string;
  projectId: string;
  filename: string;
  rawTranscript: TranscriptSchema["segments"];
}) {
  // get audio file
  const { data: audioBlob, error: audioError } = await getAudioFileUrl({
    userId: userId,
    projectId: projectId,
    filename: filename,
  });

  // Convert the blob to a base64 string
  let audioBlobBase64 = "";
  let type = "";
  if (audioBlob) {
    try {
      type = audioBlob.type;
      const arrayBuffer = await audioBlob.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      audioBlobBase64 = buffer.toString("base64");
    } catch (error) {
      console.log(error);
    }
  }

  if (!audioBlob || audioError) {
    return (
      <>
        <div className="italic text-warning">No audio file found</div>
      </>
    );
  }

  // pass audio data as string to client component for interactivity
  return (
    <>
      <div className="sticky top-0 z-10 border border-accent bg-background shadow-lg print:hidden">
        <Audio
          audioBlobBase64={audioBlobBase64}
          rawTranscript={rawTranscript}
          type={type}
        />
      </div>
    </>
  );
}
