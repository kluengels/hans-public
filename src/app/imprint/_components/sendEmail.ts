"use server";

import { createSupaseServerClient } from "@/lib/supabase/server";
import {
  EmailFormObjectType,
  EmailFormSchema,
  createZodErrorMessage,
} from "@/lib/types";
import getErrorMessage from "@/utils/getErrorMessage";
import { createTransport } from "nodemailer";

export async function sendEmail(emailFormObject: EmailFormObjectType) {
  const supabase = createSupaseServerClient();
  
  // check if is user has answered security question right
  if (emailFormObject.security !== "paris") return { error: "security" };

  // check for honeypot fields (should be empty if no bot filled them)
  if (emailFormObject.phone || emailFormObject.username)
    return { error: "bot alert" };

  // try to get user info (if user is logged in)
  const { data: user, error } = await supabase.auth.getUser();
  let userId: string | undefined;

  if (user && !error) {
    userId = user.user?.id;
  }

  // input validation with zod
  const result = EmailFormSchema.safeParse(emailFormObject);
  if (!result.success) {
    // create and display errorMessage
    const errorMessage = createZodErrorMessage(result.error);
    return { error: errorMessage };
  }

  const validatedFormObject = result.data;

  // initialize node mailer

  const transporter = createTransport({
    host: process.env.NEXT_EMAIL_HOST!,
    port: Number(process.env.NEXT_EMAIL_PORT!),
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: process.env.NEXT_EMAIL_USER!,
      pass: process.env.NEXT_EMAIL_PASS!,
    },
  });

  // Send Mail

  try {
    const info = await transporter.sendMail({
      from: `"HANS" <${process.env.NEXT_EMAIL_USER!}>`, // sender address
      to: process.env.NEXT_EMAIL_TO!, // list of receivers
      replyTo: `"${validatedFormObject.name}" <${validatedFormObject.email}>`, // name and email from form
      subject: "Form Submission for HANS", // Subject line
      text: `${validatedFormObject.name}${userId ? " (UserId: " + userId + ")" : ""} wrote: "${validatedFormObject.message}"`, // plain text body
      html: `<h2>New message from contact form</h2>
        <p><b>Sender name: </b>${validatedFormObject.name} <br>
        <p><b>Sender email: </b>${validatedFormObject.email}</p>
          ${userId ? `<p><b>UserId:</b> ${userId}</p>` : ""}
          <br>
          <p><b>Message: </b>"${validatedFormObject.message}"</p>
        `, // html body
    });

    console.log("Message sent: %s", info.messageId);
    return {};
  } catch (error) {
    console.log(error);
    return { error: getErrorMessage(error) };
  }
}
