// Modal to delete single project

"use client";

import DisplayAlert from "@/components/ui/DisplayAlert";
import { deleteProject } from "@/lib/supabase/actions";
import { Dispatch, SetStateAction, useState } from "react";
import { useRouter } from "next/navigation";
import { BsExclamationTriangle } from "react-icons/bs";
import toast from "react-hot-toast";

export function DeleteProjectModal({
  setShowDeleteModal,
  projectId,
  projectName,
}: {
  setShowDeleteModal: Dispatch<SetStateAction<boolean>>;
  projectId: string;
  projectName: string;
}) {
  // create router
  const router = useRouter();

  // alerts
  const [alert, setAlert] = useState<string>("");

  //  pending state
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit() {
    setIsPending(true);
    const { data, error } = await deleteProject(projectId);
    if (error || !data) {
      setAlert("Failed to delete project");
      setIsPending(false);
    } else {
      toast.success(`Project ${data} deleted`);
      setIsPending(false);
      router.push("/projects");
      setShowDeleteModal(false);
    }
  }

  return (
    <>
      <div className="flex items-center gap-1">
        <BsExclamationTriangle className="h-6 w-6 text-warning " />
        <h2 className="text-text">Delete project</h2>{" "}
      </div>

      <div className="my-2">
        <DisplayAlert alert={alert} setAlert={setAlert} />
      </div>
      <div className="my-2">
        Are you sure that you want to delete your project{" "}
        <span className="font-bold">{projectName}</span>? That can not be
        undone.
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setShowDeleteModal(false)}
          className="w-1/2 rounded-md border border-accent p-2 hover:bg-accent hover:text-white disabled:border-slate-400 disabled:bg-slate-400"
          disabled={isPending}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="flex-auto rounded-md border border-warning p-2 hover:bg-warning hover:text-white disabled:border-slate-400 disabled:bg-slate-400"
          disabled={isPending}
        >
          {isPending ? "Deleting" : "Continue"}
        </button>
      </div>
    </>
  );
}
