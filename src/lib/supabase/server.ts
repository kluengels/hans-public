// will be used in server components, route handler, server actions
// but: server components can not set cookies

import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Database } from "../supabaseTypes";

// used for server actions and route handlers
export function createSupaseServerClient(serverComponent: boolean = false) {
  const cookieStore = cookies();

  return createServerClient<Database>(
    process.env.NEXT_SUPABASE_URL!,
    process.env.NEXT_SUPABASE_ANON_KEY!,
    {
      // get and set cookies
      cookies: {
        get(name: string) {
          // return cookie withe name "name"
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          // servercomponents can not set cookies
          if (serverComponent) return;
          // set the cookie
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          if (serverComponent) return;
          cookieStore.set({ name, value: "", ...options });
        },
      },
    },
  );
}

// used for server components
export function createSupabaseSeverComponentClient() {
  return createSupaseServerClient(true);
}



