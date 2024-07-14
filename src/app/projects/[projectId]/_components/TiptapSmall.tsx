/* Small TipTap editor to allow edits of Project Title and Summary */

"use client";
import { useState, useRef, MutableRefObject, useEffect } from "react";
import { updateProject } from "@/lib/supabase/actions";

// TipTap imports
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import { EditorContent, useEditor, Editor } from "@tiptap/react";

// Icons
import { AiFillEdit } from "react-icons/ai";

// Tpyes
import { ProjectSchema } from "@/lib/types";

const TipTapSmall = ({
  oldText,
  userId,
  projectId,
  type,
}: {
  oldText: string;
  userId: string;
  projectId: string;
  type: "description" | "title";
}) => {
  // Alerts
  const [warning, setWarning] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  // keep track of changes
  const [lastText, setLastText] = useState<string>(oldText);

  // helper: allow edits after clicking on Icon
  const [editsAllowed, setEditsAllowed] = useState<boolean>(false);
  const editorRef: MutableRefObject<Editor | null> = useRef(null);

  // user needs to click on icon before edits can be made
  const editIconhandler = () => {
    if (!editor) return;
    setEditsAllowed(true);
    // focus editor
    editor.setEditable(true);
    editorRef.current?.commands.focus();
  };

  const editor = useEditor({
    extensions: [Document, Paragraph, Text],
    editorProps: {
      attributes: {
        class: `focus:outline-none focus:bg-slate-50 focus:ring focus:p-1 ${
          !editsAllowed && "focus:none"
        }`,
      },
    },
    // starts uneditable
    editable: false,

    content: lastText,

    // changes will be saved as soon as user leaves editor
    onBlur: async ({ editor }) => {
      // reset alerts
      setWarning("");
      setSuccess("");

      // get current text
      let newText = editor.getText();

      // sanitize input (is done on database side as well with supabase functions)
      let result;
      if (type === "title") {
        result = ProjectSchema.shape.projectname.safeParse(newText);
      } else {
        result = ProjectSchema.shape.description.safeParse(newText);
      }
      if (!result.success) {
        const errorMessage = result.error.issues[0].message;
        return setWarning(errorMessage);
      }
      const sanitized = result.data;

      // update editor with sanitzed input
      editor.commands.setContent(sanitized);

      // fire only if changes were made
      if (sanitized === lastText) return;

      // Run fucntion to update projectname / description
      if (type === "title") {
        const error = await updateProject({
          userId: userId,
          projectId: projectId,
          newTitle: sanitized,
        });
        if (error) {
          return setWarning(error);
        }
      } else if (type === "description") {
        const error = await updateProject({
          newDescription: sanitized,
          userId: userId,
          projectId: projectId,
        });

        if (error) {
          console.log(error);
          return setWarning(error);
        }
      }

      // set success alert
      setSuccess("Changes saved");
      setTimeout(() => setSuccess(""), 2000);

      // keep track of changes
      setLastText(sanitized);

      // make editor uneditable again
      editor.setEditable(false);
      setEditsAllowed(false);
    },
  });
  // make sure editor starts with latest version from database
  useEffect(() => {
    if (!editor || !oldText) return;
    editor.commands.setContent(oldText);
  }, [editor, oldText]);




  // return plain title / despcription while loading
  if (!editor) {
    return lastText;
  }
  // set ref
  editorRef.current = editor;



  return (
    <div className="flex flex-col">
      <div className="flex flex-row items-start">
        <EditorContent
          editor={editor}
          className={`${warning && "border border-dashed border-warning"}`}
        />
        <button
          className="rounded-md p-1 text-sm hover:bg-actionlight print:hidden"
          onClick={editIconhandler}
        >
          <AiFillEdit className="" />
        </button>
      </div>

      {warning && (
        <div className="fixed bottom-0 left-0 z-30 h-6 w-screen bg-warning text-center text-sm text-white">
          {warning}
        </div>
      )}
      {success && (
        <div className="fixed bottom-0 left-0 z-30 h-6 w-screen bg-green-500 text-center text-sm text-white">
          {success}
        </div>
      )}
    </div>
  );
};

export default TipTapSmall;
