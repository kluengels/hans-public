/* fetch projects of user from DB and render them in cards

each card will show: 
- project title with link to individual projet
- date created 
- date of last edit 
- delete button

*/

"use server";
import { getProjects } from "@/lib/supabase/actions";
import getTime from "@/utils/getTime";
import Link from "next/link";

import { DeleteButton } from "./DelteButton";
import { ToastWrapper } from "@/components/ui/ToastWrapper";

//icons
import { TbClockEdit } from "react-icons/tb";
import { TbClockUp } from "react-icons/tb";

export async function ProjectCards({ userId }: { userId: string }) {
  // get list of projects
  const { data: projectsData, error: errorProjects } =
    await getProjects(userId);

  // show alert if fetch project fails
  if (errorProjects) {
    return <ToastWrapper type="error" message={errorProjects} />;
  }
  if (!projectsData) {
    return <ToastWrapper type="error" message="Failed to fetch projects" />;
  }

  return (
    <>
      {projectsData.map((item, key) => (
        <div
          className="shadow:sm border border-dotted border-action p-4 hover:border-solid hover:shadow-lg"
          key={key}
        >
          <div className="item-center flex justify-between">
            <h2
              className="mb-2 truncate font-semibold hover:text-action"
              key={item.id}
            >
              <Link href={`/projects/${item.id}`} prefetch={false}>
                {item.projectname}
              </Link>
            </h2>
            <DeleteButton projectId={item.id} projectName={item.projectname} />
          </div>
          {item.description && (
            <div className="mb-4 line-clamp-4">{item.description}</div>
          )}

          {item.date_added && (
            <div className="flex items-center gap-1">
              <TbClockUp />
              <span className="truncate text-sm">
                created: {getTime(item.date_added)}{" "}
              </span>
            </div>
          )}
          {item.last_edited && (
            <div className="flex items-center gap-1">
              <TbClockEdit />
              <span className="truncate text-sm">
                last edit: {getTime(item.last_edited)}{" "}
              </span>
            </div>
          )}
        </div>
      ))}
    </>
  );
}
