"use client";

import Link from "next/link";
import {
  Checkbox,
  EmailField,
  UserNameField,
} from "@/components/forms/FormElements";

import SubmitButton from "@/components/forms/SubmitButton";
import { sendEmail } from "./sendEmail";
import { EmailFormSchema, createZodErrorMessage } from "@/lib/types";
import toast from "react-hot-toast";
import { useRef } from "react";

export default function ContactForm({
  emailOfUser,
}: {
  emailOfUser?: string | undefined;
}) {
  // ref to reset from
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    const formObject = Object.fromEntries(formData);

    // client-side input validation
    const result = EmailFormSchema.safeParse(formObject);
    if (!result.success) {
      // create and display errorMessage
      const errorMessage = createZodErrorMessage(result.error);
      toast.error(errorMessage);
      return;
    }

    // form calls server action, pass in validated values
    const { error } = await sendEmail(result.data);

    if (error && error !== "security") {
      return toast.error("Failed to send message, please send us an email");
    } else if (error && error === "security") {
      return toast.error("Your answer to the security question is wrong");
    } else {
      formRef?.current?.reset();
      return toast.success("Message sent");
    }
  }

  return (
    <>
      <div className="flex w-full flex-col border-[1px] border-dotted border-accent p-5 shadow-sm">
        <h2>Leave us a message</h2>
        <form className="flex flex-col" action={handleSubmit} ref={formRef}>
          <UserNameField type="name" />
          {/* email field is not editable if user is logged in */}
          <EmailField fixedValue={emailOfUser} />
          {/* message field */}
          <label htmlFor="message" className="mt-4 flex flex-col">
            <span className="mb-1 text-sm">Your message</span>
            <textarea
              required
              className={
                "peer bg-gray-50 p-1 invalid:border-solid focus:border-action focus:outline-none focus:ring invalid:[&:not(:placeholder-shown):not(:focus)]:border-2 invalid:[&:not(:placeholder-shown):not(:focus)]:border-warning"
              }
              name="message"
              placeholder="message (1000 characters max, no special characters)"
              minLength={3}
              maxLength={1000}
              autoComplete="off"
              id="message"
              rows={7}
            />
            <span className="mt-2 hidden text-sm text-warning peer-[&:not(:placeholder-shown):not(:focus):invalid]:block">
              Can be between 3 and 1,000 characters, no special characters.
            </span>
          </label>
          {/* quiz question for spam protection */}
          <label htmlFor="security" className=" my-4 flex flex-col">
            <span className="mb-1 text-sm">
              Spam protection: What is the capital of France?
            </span>
            <input
              required
              type="text"
              placeholder="Your answer"
              name="security"
              id="security"
              minLength={1}
              maxLength={10}
              className="bg-gray-50 p-1 invalid:border-solid focus:border-action focus:outline-none focus:ring invalid:[&:not(:placeholder-shown):not(:focus)]:border-2 invalid:[&:not(:placeholder-shown):not(:focus)]:border-warning"
              autoComplete="off"
            ></input>
          </label>

          <Checkbox>
            <span className="flex-1">
              I am aware that{" "}
              <Link href="/legal" className="hover:text-action ">
                my inputs are transmitted and saved{" "}
              </Link>{" "}
              so that the owner of HANS can respond to my request.{" "}
            </span>
          </Checkbox>
          <input
            type="text"
            name="username"
            placeholder="Your username"
            tabIndex={-1}
            autoComplete="off"
            className="absolute right-[99999999999px]"
          />
          <input
            type="phone"
            name="phone"
            placeholder="Your phone number"
            tabIndex={-1}
            autoComplete="off"
            className="absolute right-[99999999999px]"
          />

          <SubmitButton />
        </form>
      </div>
    </>
  );
}
