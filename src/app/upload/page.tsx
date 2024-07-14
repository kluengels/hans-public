import PageTitleAnimated from "@/components/ui/PageTitleAnimated";
import UploadForm from "./_components/UploadForm";
import { createSupabaseSeverComponentClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import NoSSRWrapper from "@/utils/NoSSRWrapper";

export default async function Upload() {
  const supabase = createSupabaseSeverComponentClient();

  // check if user is logged in
  const { data: user, error: errorUser } = await supabase.auth.getUser();
  if (errorUser || !user) {
    redirect("/");
  }
  const userId = user.user?.id;

  return (
    <>
      <div className="mx-auto max-w-[50rem]">
        <PageTitleAnimated>Create new project ✌️</PageTitleAnimated>
        <NoSSRWrapper>
            <UploadForm userId={userId}/>
        </NoSSRWrapper>
      </div>
    </>
  );
}
