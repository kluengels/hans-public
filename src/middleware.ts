// middleware to protect routes -> check if user is authenticated &update session

import {type NextRequest, NextResponse} from "next/server";
import { createSupabaseReqResClient} from "@/lib/supabase/middleware";

export async function middleware(req: NextRequest) {
 
  // return await updateSession(req);
 
  // console.log("running middleware");

  const res = NextResponse.next();

  // check if user is logged in // update session for user that are logged in
  const supabase = createSupabaseReqResClient(req, res);
  
  const {
    data: {user},
  } = await supabase.auth.getUser();

  // redirect unknown user to login page if he tries to access a protected route
  if (!user) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  return res;
}

export const config = {
  // define protected routes
  matcher: [
    "/projects/:path*",
    "/upload",
    "/transcript/:path*",
    "/logout",
    "/account/:path*",
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    // "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
