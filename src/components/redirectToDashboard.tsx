// redirect user to Login page via sever action
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function redirectToDashboard() {
  revalidatePath("/projects", "layout");
  redirect("/projects");
}
