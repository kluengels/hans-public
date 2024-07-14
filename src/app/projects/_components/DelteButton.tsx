// Button opens Modal to let user delete a single project

"use client";

import HtmlModal from "@/components/ui/modals/HtmlModal";
import { useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { DeleteProjectModal } from "./DeleteProjectModal";

export function DeleteButton({
  projectId,
  projectName,
}: {
  projectId: string;
  projectName: string;
}) {
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  return (
    <>
      <button
        project-attribute={projectId}
        onClick={() => setShowDeleteModal(true)}
        className="h-8 w-8 rounded-md p-2 hover:bg-actionlight"
      >
        <AiOutlineDelete />
      </button>
      {showDeleteModal && (
        <HtmlModal
          showModal={showDeleteModal}
          setShowModal={setShowDeleteModal}
        >
          <DeleteProjectModal
            setShowDeleteModal={setShowDeleteModal}
            projectId={projectId}
            projectName={projectName}
          />
        </HtmlModal>
      )}
    </>
  );
}
