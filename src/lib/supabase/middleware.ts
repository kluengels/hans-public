// Middleware can't use simpele server cookies, but needs res, req

import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import { setCookie, getCookie } from "cookies-next";

export function createSupabaseReqResClient(
  req: NextRequest,
  res: NextResponse,
) {
  return createServerClient(
    process.env.NEXT_SUPABASE_URL!,
    process.env.NEXT_SUPABASE_ANON_KEY!,
    {
      // get and set cookies
      cookies: {
        get(name: string) {
          // return cookie with name "name"
          return getCookie(name, { req, res });
        },

        set(name: string, value: string, options: CookieOptions) {
          setCookie(name, value, { req, res, ...options });
        },
        remove(name: string, options: CookieOptions) {
          // set empty cookies
          setCookie(name, "", { req, res, ...options });
        },
      },
    },
  );
}

// export const updateSession = async (request: NextRequest) => {
//   // This `try/catch` block is only here for the interactive tutorial.
//   // Feel free to remove once you have Supabase connected.
//   try {
//     // Create an unmodified response
//     let response = NextResponse.next({
//       request: {
//         headers: request.headers,
//       },
//     });

//     const supabase = createServerClient(
//       process.env.NEXT_SUPABASE_URL!,
//       process.env.NEXT_SUPABASE_ANON_KEY!,
//       {
//         cookies: {
//           get(name: string) {
//             return request.cookies.get(name)?.value;
//           },
//           set(name: string, value: string, options: CookieOptions) {
//             // If the cookie is updated, update the cookies for the request and response
//             request.cookies.set({
//               name,
//               value,
//               ...options,
//             });
//             response = NextResponse.next({
//               request: {
//                 headers: request.headers,
//               },
//             });
//             response.cookies.set({
//               name,
//               value,
//               ...options,
//             });
//           },
//           remove(name: string, options: CookieOptions) {
//             // If the cookie is removed, update the cookies for the request and response
//             request.cookies.set({
//               name,
//               value: "",
//               ...options,
//             });
//             response = NextResponse.next({
//               request: {
//                 headers: request.headers,
//               },
//             });
//             response.cookies.set({
//               name,
//               value: "",
//               ...options,
//             });
//           },
//         },
//       }
//     );

//     // This will refresh session if expired - required for Server Components
//     // https://supabase.com/docs/guides/auth/server-side/nextjs
//     await supabase.auth.getUser();

//     return response;
//   } catch (e) {
//     console.log("Supabase client could not be created")
//     // If you are here, a Supabase client could not be created!
//     // This is likely because you have not set up environment variables.
//     // Check out http://localhost:3000 for Next Steps.
//     return NextResponse.next({
//       request: {
//         headers: request.headers,
//       },
//     });
//   }
// };
