/* allows users to edit Transcript in Rich Text editor
 */

"use client";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { ProjectSchema } from "@/lib/types";
import HtmlModal from "@/components/ui/modals/HtmlModal";
import parse from "html-react-parser";
import { updateProject } from "@/lib/supabase/actions";
import { DeleteProjectModal } from "../../_components/DeleteProjectModal";
import toast from "react-hot-toast";
import { revalidate } from "@/components/revalidate";

// Text editor imports
import { useEditor, EditorContent, BubbleMenu, Editor } from "@tiptap/react";
import Highlight from "@tiptap/extension-highlight";
import TextStyle from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import StarterKit from "@tiptap/starter-kit";

//Icons
import {
  BiUndo,
  BiHighlight,
  BiRedo,
  BiItalic,
  BiBold,
  BiPrinter,
} from "react-icons/bi";
import { LiaUndoAltSolid } from "react-icons/lia";
import { AiOutlineDelete } from "react-icons/ai";
import { LoadingSpinner } from "@/components/ui/LoadingComponent";
import { BsExclamationTriangle } from "react-icons/bs";

// define extension array for TipTAP
const extensions = [StarterKit, Highlight, TextStyle, Color];

type TipTapProps = {
  oldText: string;
  projectId: string;
  userId: string;
  uneditedText: string;
  projectname: string;
};

// tiptap component
const Tiptap = ({
  oldText,
  projectId,
  userId,
  uneditedText,
  projectname,
}: TipTapProps) => {
  // Modal to confirm back-to-unedited-version
  const [showDiscardChangesModal, setShowDiscardChangesModal] = useState(false);

  // Modal to confirm deletion of project
  const [showDeleteProjectModal, setShowDeleteProjectModal] = useState(false);

  // keep trackl of changes
  const [lastText, setLastText] = useState(oldText);

  // initialize editor
  const editor = useEditor({
    extensions,
    content: oldText,
    editorProps: {
      attributes: {
        class: "focus:outline-none focus:ring focus:border-blue-500 p-1",
      },
    },
    onFocus: ({ editor }) => {
      // reset all alerts
      toast.dismiss();
    },
    onDestroy() {
      // reset all alerts
      toast.dismiss();
      // refetch data
      revalidate(`/projects/${projectId}`);
    },
    onBlur: async ({ editor }) => {
      // get current text
      let newText = editor.getHTML();

      // fire only if changes were made
      if (newText === lastText) return;

      // input sanitization
      const result = ProjectSchema.shape.edited.safeParse(newText);

      if (!result.success) {
        const errorMessage = result.error.issues[0].message;
        return toast.error(errorMessage);
      }
      const sanitized = result.data;

      // keep track of changes
      setLastText(result.data);

      const error = await updateProject({
        edited: sanitized,
        userId: userId,
        projectId: projectId,
      });
      if (error) {
        return toast.error("Failed to save. Please make a local copy", {
          position: "bottom-center",
          id: "errorUpdate",
          duration: Infinity,
        });
      }
      toast.success("Changes saved", {
        position: "bottom-center",
        id: "successUpdate",
      });
    },
  });

  // make sure editor starts with latest version from database
  useEffect(() => {
    if (!editor || !oldText) return;
    editor.commands.setContent(oldText);
  }, [editor, oldText]);

  // return latest text while TipTap is loading
  if (!editor) {
    return (
      <div className="flex flex-row">
        {/* Menu bar placeholder*/}
        <div className="fixed z-10 hidden w-10 flex-col sm:inline print:hidden">
          <LoadingSpinner />
        </div>
        <div className="ml-14"> {parse(lastText)}</div>
      </div>
    );
  }

  return (
    <>
      <div className="relative mb-14 flex flex-row">
        {/* Menu bar */}
        <MenuBar
          projectId={projectId}
          projectname={projectname}
          editor={editor}
          setShowDiscardChangesModal={setShowDiscardChangesModal}
          showDiscardChangesModal={showDiscardChangesModal}
          uneditedText={uneditedText}
          setShowDeleteProjectModal={setShowDeleteProjectModal}
          showDeleteProjectModal={showDeleteProjectModal}
        />

        {/* The editor itself */}
        <EditorContent
          editor={editor}
          className={`mb-6 min-h-64 w-full border border-dotted border-accent bg-slate-50 p-1  font-mono sm:ml-14
           print:ml-0 print:border-none `}
        />

        {/* Bubble menu in editor */}
        <div>
          <FloatingMenu editor={editor} />
        </div>
      </div>
    </>
  );
};

interface MenuBarProps {
  editor: Editor;
  setShowDiscardChangesModal: Dispatch<SetStateAction<boolean>>;
  setShowDeleteProjectModal: Dispatch<SetStateAction<boolean>>;
  showDiscardChangesModal: boolean;
  showDeleteProjectModal: boolean;
  projectId: string;
  projectname: string;
  uneditedText: string;
}

function MenuBar({
  editor,
  setShowDiscardChangesModal,
  setShowDeleteProjectModal,
  showDiscardChangesModal,
  showDeleteProjectModal,
  projectId,
  projectname,
  uneditedText,
}: MenuBarProps) {
  return (
    <div className="fixed z-10 hidden flex-col sm:inline print:hidden">
      {/* Undo button */}
      <button
        onClick={() => {
          editor.chain().focus().undo().run();
        }}
        disabled={!editor.can().undo()}
        title="Undo"
        className={`m-1 flex h-8 w-8 items-center justify-center rounded-md border
            border-accent bg-background p-1 text-text
            hover:bg-accent hover:text-white
            disabled:text-gray-400 disabled:hover:bg-background`}
      >
        <BiUndo />
      </button>

      {/* Redo button */}
      <button
        onClick={() => {
          editor.chain().focus().redo().run();
        }}
        disabled={!editor.can().redo()}
        title="Redo"
        className={`m-1 flex h-8 w-8 items-center justify-center rounded-md border
            border-accent bg-background p-1 text-text
            hover:bg-accent hover:text-white
            disabled:text-gray-400 disabled:hover:bg-background`}
      >
        <BiRedo />
      </button>

      {/* Discard-all-edits-button will open modal to confirm */}
      <button
        onClick={() => {
          setShowDiscardChangesModal(true);
          // editor.commands.setContent(uneditedText);
          // editor.chain().focus().run();
        }}
        title="!!! Discard all edits"
        className={`m-1 mt-5 flex h-8 w-8 items-center justify-center rounded-md border
            border-accent bg-background p-1 text-text
            hover:border-warning hover:bg-warning hover:text-white
            disabled:text-gray-400`}
      >
        <LiaUndoAltSolid />
      </button>

      {showDiscardChangesModal && (
        <HtmlModal
          showModal={showDiscardChangesModal}
          setShowModal={() => setShowDiscardChangesModal(false)}
        >
          <div className="flex items-center gap-1">
            <BsExclamationTriangle className="h-6 w-6 text-warning " />
            <h2 className="text-text">Discard all changes</h2>{" "}
          </div>
          <div className="my-2">
            Are you sure that you want to discard all edits and restore the
            original version?{" "}
            <span className="font-bold text-warning">
              That can not be undone.
            </span>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              className="w-1/2 rounded-md border border-accent p-2 hover:bg-accent hover:text-white"
              onClick={() => {
                setShowDiscardChangesModal(false);
              }}
            >
              Cancel
            </button>
            <button
              className="flex-auto rounded-md border border-warning p-2 hover:bg-warning hover:text-white"
              onClick={() => {
                editor.commands.setContent(uneditedText);
                editor.chain().focus().run();
                setShowDiscardChangesModal(false);
              }}
            >
              Continue
            </button>
          </div>
        </HtmlModal>
      )}

      {/* Print view button */}
      <button
        onClick={() => {
          print();
        }}
        title="Print"
        className={`m-1 mt-5 flex h-8 w-8 items-center justify-center rounded-md border border-accent bg-background p-1 hover:bg-accent hover:text-white disabled:text-gray-400`}
      >
        <BiPrinter />
      </button>

      {/* Delete-project-button will open modal to confirm */}
      <button
        onClick={() => {
          setShowDeleteProjectModal(true);
        }}
        title="!!! Delete Project"
        className={`m-1 mt-5 flex h-8 w-8 items-center justify-center rounded-md border
            border-accent bg-background p-1 text-text
            hover:border-warning hover:bg-warning hover:text-white
            disabled:text-gray-400`}
      >
        <AiOutlineDelete />
      </button>
      {showDeleteProjectModal && (
        <HtmlModal
          showModal={showDeleteProjectModal}
          setShowModal={() => setShowDeleteProjectModal(false)}
        >
          <DeleteProjectModal
            setShowDeleteModal={setShowDeleteProjectModal}
            projectId={projectId}
            projectName={projectname}
          />
        </HtmlModal>
      )}
    </div>
  );
}

function FloatingMenu({ editor }: { editor: Editor }) {
  const colorOptions = ["black", "teal", "orange", "blue"];
  return (
    <BubbleMenu
      editor={editor}
      tippyOptions={{ duration: 100 }}
      className="flex flex-row "
    >
      {/* bold button */}
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`m-1 flex h-8 w-8 items-center justify-center rounded-md border  border-black bg-white p-1`}
      >
        <BiBold />
      </button>

      {/* italic button */}
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`m-1 flex h-8 w-8 items-center justify-center rounded-md border  border-black bg-white p-1`}
      >
        {" "}
        <BiItalic />
      </button>

      {/* highlight button */}
      <button
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        className={`m-1 flex h-8 w-8 items-center justify-center rounded-md border border-black bg-yellow-200 p-1`}
      >
        <BiHighlight />
      </button>

      {/* buttons to chage text color */}

      {colorOptions.map((color, index) => (
        <button
          onClick={() => editor.chain().focus().setColor(color).run()}
          key={index}
          className={
            editor.isActive("textStyle", { color: color }) ? "is-active" : ""
          }
        >
          <div
            style={{ backgroundColor: color }}
            className={`m-1 flex h-8 w-8 items-center justify-center rounded-md border border-black p-1`}
          ></div>
        </button>
      ))}
    </BubbleMenu>
  );
}

export default Tiptap;
