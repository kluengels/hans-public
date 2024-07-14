import { ZodError, z } from "zod";

import { Transcription } from "openai/resources/audio/transcriptions.mjs";

/* User validation */
// password requirments: Minium 6 characters, at least one uppercase letter, one lowercase letter, one number and one special character
export const passwordValidation = new RegExp(
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$/,
);

export const UserSchema = z.object({
  email: z
    .string()
    .trim()
    .email({ message: "Please enter a valid email address" }),

  password: z.string().trim().regex(passwordValidation, {
    message:
      "Must be a least six characters long. Needs at least one uppercase letter, one lowercase letter, one number and one special character",
  }),
  username: z
    .string()
    .trim()
    .min(3, { message: "Must be at least 3 character" })
    .max(20, { message: "Must not be longer than 20 characters" })
    .optional(),
});

/* Project Validation */

// OpenAiResponse type (temporary as OpenAi wants to include correct type in nodejs library soon)
export interface OpenAiResponse extends Transcription {
  task?: string;
  language?: string;
  duration: number;
  text: string;
  segments: {
    id?: number;
    seek?: number;
    start: number;
    end: number;
    text: string;
    tokens?: number[];
    temperature?: number;
    avg_logprob?: number;
    compression_ratio?: number;
    no_speech_prob?: number;
  }[];
}

export type TranscriptSchema = {
  text: string;
  duration: number;
  segments: { start: number; end: number; text: string }[];
};

export const ProjectSchema = z.object({
  description: z
    .string()
    .trim()
    .transform((value) => value.replace(/\s+/g, " ")) // replace multiple white spaces by single space
    .pipe(
      z.string().transform((value) =>
        // remove special characters and line breaks
        value.replace(
          /[^\p{Letter}\p{Mark}\p{Punctuation}\p{Number}\s]|\n/gu,
          "",
        ),
      ),
    )
    .pipe(
      z
        .string()
        .max(300, { message: "Must not be no longer than 300 characters" }),
    ),

  projectname: z
    .string()
    .trim()
    .transform((value) => value.replace(/\s+/g, " ")) // remove multiple white spaces
    .pipe(
      z.string().transform((value) =>
        // remove special characters and line breaks
        value.replace(
          /[^\p{Letter}\p{Mark}\p{Punctuation}\p{Number}\s]|\n/gu,
          "",
        ),
      ),
    )
    .pipe(
      z
        .string()
        .min(1, { message: "Must be at least one character long" })
        .max(25, { message: "Must not be no longer than 25 characters" }),
    ),
  edited: z
    .string()
    .trim()
    .optional()
    .transform((value) =>
      value?.replace(
        /(<\/a>)|(<\/script>)|(<a[^>]*>)|(<script[^>]*>)|(<img[^>]*>)/g,
        "",
      ),
    )
    .pipe(z.string()),
});

// OpenAi Key validation
export const OpenAiKeySchema = z
  .string()
  .trim()
  .min(8, { message: "Must be at least eight characters long" })
  .max(100, { message: "Must not be no longer than 100 characters" });

// OTP Validation
export const otpValidation = new RegExp(/^[0-9]{6}$/);
export const OtpSchema = z
  .string()
  .regex(otpValidation, { message: "Must be six digits" });


/* Validation for contact form */

export const EmailFormSchema = z.object({
  email: z
    .string()
    .trim()
    .email({ message: "Please enter a valid email address" }),

  message: z
    .string()
    .transform((value) =>
      // remove special characters
      value.replace(/[^\p{Letter}\p{Mark}\p{Punctuation}\p{Number}\s]/gu, ""),
    )
    .pipe(
      z
        .string()
        .min(3, { message: "Must be at least three characters long" })
        .max(1000, { message: "Must not be no longer than 1000 characters" }),
    ),
  security: z
    .string()
    .trim()
    .transform((value) =>
      // remove special characters
      value.replace(/[^\p{Letter}\p{Mark}\p{Punctuation}\p{Number}\s]/gu, ""),
    )
    .pipe(z.string().toLowerCase().min(1, { message: "May not be empty" })),

  name: z
    .string()
    .transform((value) =>
      // remove special characters
      value.replace(/[^\p{Letter}\p{Mark}\p{Punctuation}\p{Number}\s]/gu, ""),
    )
    .pipe(
      z
        .string()
        .min(3, { message: "Must be at least three characters long" })
        .max(30, { message: "Must not be no longer than 30 characters" }),
    ),
  checkbox: z.string().optional(),
  // honeypot fields
  phone: z.string().optional(),
  username: z.string().optional(),
});

// typescript Type from zod schema
export type EmailFormObjectType = z.infer<typeof EmailFormSchema>;

/* Custom Error message */
export function createZodErrorMessage(error: ZodError): string {
  let errorMessage = "";
  error.issues.forEach((issue) => {
    errorMessage += issue.path + ": " + issue.message + ". ";
  });

  return errorMessage;
}


// good blog article for composting schmeas: https://www.turing.com/blog/data-integrity-through-zod-validation/
