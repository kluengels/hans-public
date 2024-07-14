/* Page will fetch project data based on project id passed in via parameters. 
Renders details of the project, with audioplayer and texteditor,
calls different server and client components to do so.  */

import { getProject } from "@/lib/supabase/actions";
import { createSupabaseSeverComponentClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import getTime from "@/utils/getTime";

// components
import Tiptap from "./_components/Tiptap";
import TipTapSmall from "./_components/TiptapSmall";
import { AudioServer } from "./_components/AudioServer";
import { LoadingComponent } from "@/components/ui/LoadingComponent";

//icons
import { TbClockEdit } from "react-icons/tb";
import { TbClockUp } from "react-icons/tb";

// Types
import { TranscriptSchema } from "@/lib/types";



export default async function Project({
  params,
}: {
  params: { projectId: string };
}) {
  // get projectId from url params
  const projectId = params.projectId;

  // connect to supabase
  const supabase = createSupabaseSeverComponentClient();

  // get userId
  const { data: user, error: errorUser } = await supabase.auth.getUser();
  const userId = user.user?.id;

  // if no user is detected, redirect to login page
  if (errorUser || !userId) {
    redirect("/login");
  }

  // get project details
  const { data: projectData, error: projectError } =
    await getProject(projectId);
  if (projectError || !projectData) {
    redirect("/error");
  }

  // destructure project data
  const projectname = projectData.projectname;
  const filename = projectData.filename;
  let unedited = projectData.text;
  const description = projectData.description || "";
  const edited = projectData.edited;
  let rawTranscript: TranscriptSchema["segments"] | null = null;

  if (projectData.transcript && typeof projectData.transcript === "string") {
    const jsonData = JSON.parse(projectData.transcript) as TranscriptSchema;
    unedited = jsonData.text;
    rawTranscript = jsonData.segments;
  }

  return (
    <>
      {/* Title is editable */}

      <h1>
        <TipTapSmall
          oldText={projectname}
          projectId={projectId}
          userId={user.user.id}
          type={"title"}
        />
      </h1>

      {/* Project details with editable description */}
      <section className="print:hidden">
        <div className="flex flex-col md:flex-row md:gap-1">
          {projectData.date_added && (
            <div className="flex items-center gap-1">
              <TbClockUp />
              <span className="truncate text-sm">
                created: {getTime(projectData.date_added)}{" "}
              </span>
            </div>
          )}
          {projectData.last_edited && (
            <div className="flex items-center gap-1">
              <TbClockEdit />
              <span className="truncate text-sm">
                last edit: {getTime(projectData.last_edited)}{" "}
              </span>
            </div>
          )}
        </div>
        <div className="mt-2 mb-4 flex flex-wrap gap-1">
          <div className="font-bold">Description: </div>

          <TipTapSmall
            oldText={description}
            projectId={projectId}
            userId={user.user.id}
            type={"description"}
          />
        </div>
      </section>

      {/* Sticky audio player and OpenAI-Transcript of segment based on playback position */}

      {userId && projectId && filename && rawTranscript && (
        <>
          <Suspense fallback={<LoadingComponent text="audio"/>}>
            <AudioServer
              userId={userId}
              projectId={projectId}
              filename={filename}
              rawTranscript={rawTranscript}

            />
          </Suspense>
        </>
      )}

      {/* Editable transcript */}

      <h2 className="mt-5 print:hidden">Transcript (edited):</h2>

      <div className="">
        <Tiptap
          oldText={edited || unedited || ""}
          projectId={projectId}
          userId={user.user.id}
          uneditedText={unedited || ""}
          projectname={projectname}
        />
      </div>
    </>
  );
}
