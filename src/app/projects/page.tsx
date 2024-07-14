/* Page shows cards of existing projects and a button to create a new project */

import { redirect } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { createSupabaseSeverComponentClient } from "@/lib/supabase/server";

import PageTitleAnimated from "@/components/ui/PageTitleAnimated";
import { ProjectCards } from "./_components/ProjectCards";
import { LoadingComponent } from "@/components/ui/LoadingComponent";
import { SiReaddotcv } from "react-icons/si";


export default async function Projects() {
  const supabase = createSupabaseSeverComponentClient();

  // get userId
  const { data: user, error: errorUser } = await supabase.auth.getUser();
 
  const userId = user.user?.id;
  if (errorUser || !userId) {
    redirect("/");
  }

  return (
    <>
      <PageTitleAnimated>Your Projects 🤝</PageTitleAnimated>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 ">
        <div className="p-4 flex items-start justify-center  text-white  max-h-22">

          {/* Start new project */}
          <Link href="/upload" className="hover:underline p-4 rounded-xl hover:shadow-xl bg-action w-full">
          <div className="flex gap-1 items-center"><SiReaddotcv className="w-14 h-14" />
            <h3>Start a new project</h3></div>
          </Link>
    
        </div>

        {/* Project cards */}
        <Suspense fallback={<LoadingComponent text="projects" />}>
          <ProjectCards userId={userId} />
        </Suspense>
      </div>
    </>
  );
}
