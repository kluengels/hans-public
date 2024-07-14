/* Imprint page with contact form. If user is logged in the email field in contact form 
has a fixed value of users email address */

import PageTitleAnimated from "@/components/ui/PageTitleAnimated";
import ContactForm from "./_components/ContactForm";
import { createSupabaseSeverComponentClient } from "@/lib/supabase/server";

export default async function Imprint() {
  // check if form is called by an registered user
  const supabase = createSupabaseSeverComponentClient();
  const { data } = await supabase.auth.getUser();
  let emailOfUser: string | undefined;
  if (data && data.user?.email) {
    emailOfUser = data.user.email;
  }

  return (
    <>
      <div className="mx-auto max-w-[36rem]">
        <PageTitleAnimated>Imprint 🤙</PageTitleAnimated>
        <section className="mb-8">
          <h2>HANS is a project of:</h2>
          <ul className="mt-2">
            <li>Steffen Ermisch</li>
            <li>Pressebüro JP4</li>
            <li>Richard-Wagner-Str. 10-12 </li>
            <li>50674 Köln, Germany</li>
            <li>
              <span className="before:content-['ch'] after:content-['ail.com']">
                &#101;ckflix2023&#64;gm
              </span>
            </li>
          </ul>
        </section>

        <section className="flex justify-center">
          {/* client component */}
          <ContactForm emailOfUser={emailOfUser} />
        </section>
      </div>
    </>
  );
}
