// server action for login

"use server";

import { createSupaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

import getErrorMessage from "@/utils/getErrorMessage";
import {
  OpenAiKeySchema,
  OtpSchema,
  ProjectSchema,
  UserSchema,
  createZodErrorMessage,
} from "@/lib/types";
import { revalidatePath } from "next/cache";

import { Database } from "../supabaseTypes";
import * as tus from "tus-js-client";
import { createReadStream } from "fs";
import mime from "mime";
import { SafeParseReturnType } from "zod";

/**
 * Sign user in into supbase
 * @param existingUser object with email and password
 */
export default async function signInUser(existingUser: unknown) {
  try {
    const supabase = createSupaseServerClient();
    // server side validation with zod
    const result = UserSchema.safeParse(existingUser);
    if (!result.success) {
      // create and display errorMessage
      const errorMessage = createZodErrorMessage(result.error);
      throw errorMessage;
    }

    // sign in supabase
    const { error } = await supabase.auth.signInWithPassword({
      email: result.data.email,
      password: result.data.password,
    });
    if (error) {
      throw error;
    }
  } catch (error) {
    console.log(error);
    return {
      error: getErrorMessage(error),
    };
  }

  // redirect to dashboard if login was successfull
  redirect("/projects");
}

/**
 * Signs user up in supabase
 * @param {unknown} newUser User object with email, password, username
 */
export async function signUpUser(newUser: unknown) {
  try {
    const supabase = createSupaseServerClient();
    // server side input validation with zod
    const result = UserSchema.safeParse(newUser);
    if (!result.success) {
      const errorMessage = createZodErrorMessage(result.error);
      throw errorMessage;
    }

    // register user in supabase
    const { data, error } = await supabase.auth.signUp({
      email: result.data.email,
      password: result.data.password,
      options: {
        data: {
          username: result.data.username,
        },
      },
    });
    if (error) throw error;
    if (!data.user) throw "Failes to register new user";
    return { data: data, error: null };
  } catch (error) {
    return { error: getErrorMessage(error), data: null };
  }
}

/**
 * Sign out
 */
export async function signOut(){
  const supabase = createSupaseServerClient();
  await supabase.auth.signOut();
  return redirect("/");
};



/**
 * Resend OTP to user
 * @param email
 * @param type can be "signup" or "email_change"
 * @returns Error message if something went wrong
 */
export async function resendCode(
  email: string,
  type: "signup" | "email_change",
) {
  try {
    const supabase = createSupaseServerClient();
    // sever side validation
    const result = UserSchema.shape.email.safeParse(email);
    if (!result.success) {
      const errorMessage = result.error.issues[0].message;
      throw errorMessage;
    }

    const { error } = await supabase.auth.resend({
      type: type,
      email: email,
    });
    if (error) throw error;
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
  return {};
}

export async function changeEmail(newMail: unknown) {
  try {
    const supabase = createSupaseServerClient();
    // sever side validation
    const result = UserSchema.shape.email.safeParse(newMail);
    if (!result.success) {
      const errorMessage = result.error.issues[0].message;
      throw errorMessage;
    }

    // update user in supabase
    const { data, error } = await supabase.auth.updateUser({
      email: result.data,
    });
    if (data) return { data: data };
    if (error) throw error;
  } catch (error) {
    console.log(error);
    return { error: getErrorMessage(error) };
  }
  revalidatePath("/", "layout");
  redirect("/");
}

/**
 * Check if OTP entered by user is correct
 */
export async function confirmOtp(
  email: unknown,
  otp: unknown,
  type: "email" | "recovery" | "email_change" | "invite",
) {
  try {
    const supabase = createSupaseServerClient();
    // sever side validation of input
    const result = UserSchema.shape.email.safeParse(email);
    if (!result.success) {
      const errorMessage = result.error.issues[0].message;
      throw errorMessage;
    }
    const result2 = OtpSchema.safeParse(otp);
    if (!result2.success) {
      const errorMessage2 = result2.error.issues[0].message;
      throw errorMessage2;
    }

    // verify OTP in supabase
    const { data, error } = await supabase.auth.verifyOtp({
      email: result.data,
      token: result2.data,
      type: type,
    });

    if (!data.session && !data.user) throw "Code not valid";
    if (data) return { data: data, error: null };
    if (error) throw error;
  } catch (error) {
    console.log(error);
    return { error: getErrorMessage(error), data: null };
  }
  return {};
  // revalidatePath("/", "layout");
  // redirect("/");
}

/**
 * Lets user reset password in supabase, user will receive an email with OTP
 * @param email
 */
export async function resetPassword(email: unknown) {
  try {
    const supabase = createSupaseServerClient();
    // sever side validation of input for email address
    const result = UserSchema.shape.email.safeParse(email);
    if (!result.success) {
      const errorMessage = result.error.issues[0].message;
      throw errorMessage;
    }
    // trigger password reset email in supabase
    const { data, error } = await supabase.auth.resetPasswordForEmail(
      result.data,
    );

    if (error) throw error;
    if (!data && !error) throw "Failed to connect to database";
    return { data: data, error: null };
  } catch (error) {
    return { error: getErrorMessage(error), data: null };
  }
}

/**
 * Sets a new password for logged in user in supabase
 * @param newPassword new Password string
 */

export async function setNewPassword(newPassword: unknown) {
  try {
    const supabase = createSupaseServerClient();
    // sever side validation
    const result = UserSchema.shape.password.safeParse(newPassword);
    if (!result.success) {
      const errorMessage = result.error.issues[0].message;
      throw errorMessage;
    }

    // trigger password reset email in supabase
    const { data, error } = await supabase.auth.updateUser({
      password: result.data,
    });
    if (error) throw error;
    if (!data) throw "Failed to change password";
    return { data: data };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}

/**
 * Changes username of authenticated user in supabase
 * @param newUsername new Username
 */
export async function setNewUsername(newUsername: unknown) {
  try {
    const supabase = createSupaseServerClient();
    // sever side validation
    const result = UserSchema.shape.username.safeParse(newUsername);
    if (!result.success) {
      const errorMessage = result.error.issues[0].message;
      throw errorMessage;
    }

    // trigger username update in supabase
    const { data, error } = await supabase.auth.updateUser({
      data: {
        username: result.data,
      },
    });

    if (error) throw error;
    if (!data) throw "Could not find user";
    return { data: data, error: null };
  } catch (error) {
    return { error: getErrorMessage(error), data: null };
  }
}

/**
 * Deletes account of authenticated user via supabase function
 */
export async function deleteAccount() {
  try {
    const supabase = createSupaseServerClient();
    // trigger account deletion in supabase
    const { error } = await supabase.rpc("delete_user");

    if (error) throw error;
    // redicret to home page
    redirect("/");
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}

export async function logOut() {
  try {
    const supabase = createSupaseServerClient();
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    return { error: getErrorMessage(error) };
  }

  revalidatePath("/", "layout");
  redirect("/");
}

/**
 * Gets an array of all user projects from supabase, sorted by
 * last edit date / creation date
 */
export async function getProjects(userId: string) {
  console.log("running get projects");
  try {
    const supabase = createSupaseServerClient();
    const { data: projects, error } = await supabase
      .from("transcripts")
      .select("date_added, last_edited, id, description, projectname")
      .eq("user_id", userId);

    if (error) {
      throw error;
    }
    if (!projects) throw "Failed to fetch projects";

    if (projects.length === 0) {
      return { data: [] };
    }

    // sort by last edit / creation time (last touched projects will appear first)
    projects.sort((a, b) => {
      let dateA = a.last_edited ?? a.date_added;
      let dateB = b.last_edited ?? b.date_added;
      return dateA > dateB ? -1 : dateA < dateB ? 1 : 0;
    });

    return { data: projects };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}

/**
 * delete single project of user from supabase
 */
export async function deleteProject(projectId: string) {
  console.log("running del project");
  try {
    const supabase = createSupaseServerClient();
    const { data, error } = await supabase
      .from("transcripts")
      .delete()
      .eq("id", projectId)
      .select();

    if (error) throw error;
    if (!data || !data[0].projectname) throw "Failed to find project";
    revalidatePath("/projects", "layout");
    return { data: data[0].projectname };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}

/**
 * get a specific project from supabase
 */
export async function getProject(projectId: string) {
  console.log(`getting project with id ${projectId}`);
  try {
    const supabase = createSupaseServerClient();
    const { data, error } = await supabase
      .from("transcripts")
      .select("*")
      .eq("id", projectId);

    if (error) {
      throw error;
    }
    if (!data || !data[0]) throw "Failed to fetch project";
    return { data: data[0] };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}

// get audio file of a project

export async function getAudioFileUrl({
  userId,
  projectId,
  filename,
}: {
  userId: string;
  projectId: string;
  filename: string;
}) {
  console.log("getting audio file");
  try {
    const supabase = createSupaseServerClient();
    const { data, error } = await supabase.storage
      .from("audio")
      .download(`${userId}/${projectId}/${filename}`);

    if (error) {
      throw error;
    }
    console.log("audioRAW", data);
    // const url = URL.createObjectURL(data);

    return { data: data };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}

/**
 * Updates a specific project in supabase
 */
export async function updateProject({
  newTitle,
  newDescription,
  userId,
  projectId,
  edited,
}: {
  newTitle?: string;
  newDescription?: string;
  userId: string;
  projectId: string;
  edited?: string;
}) {
  console.log("updating project in DB ");

  try {
    const supabase = createSupaseServerClient();
    // validate User input
    let result: SafeParseReturnType<string, string> | undefined;
    if (newTitle) {
      result = ProjectSchema.shape.projectname.safeParse(newTitle);
    } else if (newDescription) {
      result = ProjectSchema.shape.description.safeParse(newDescription);
    } else if (edited) {
      result = ProjectSchema.shape.edited.safeParse(edited);
    }
    if (!result) throw "Failed to validate data";
    if (!result.success) {
      const errorMessage = result.error.issues[0].message;
      throw errorMessage;
    }

    let updateParam = {};
    if (newTitle) updateParam = { projectname: result.data };
    if (newDescription) updateParam = { description: result.data };
    if (edited) {
      const date = new Date().toISOString();
      updateParam = { edited: result.data, last_edited: date };
    }

    const { error } = await supabase
      .from("transcripts")
      .update(updateParam)
      .eq("id", projectId)
      .eq("user_id", userId);

    if (error) throw error;
    return;
  } catch (error) {
    return getErrorMessage(error);
  }
}

// export async function uploadFileClient({
//   pathToFile,
//   nameOfFileInSupabase,
//   userId,
//   projectId,
// }: {
//   pathToFile: string;
//   nameOfFileInSupabase: string;
//   userId: string;
//   projectId: string;
// }){
//   try {
//     const { data, error } = await supabase
//   .storage
//   .from('avatars')
//   .upload('public/avatar1.png', avatarFile, {
//     cacheControl: '3600',
//     upsert: false
//   })
//   } catch (error) {

//   }
// }

/**
 * Upload file to  supabase storage using read stream and TUS client
 */
export async function uploadFile({
  pathToFile,
  nameOfFileInSupabase,
  userId,
  projectId,
}: {
  pathToFile: string;
  nameOfFileInSupabase: string;
  userId: string;
  projectId: string;
}) {
  try {
    const supabase = createSupaseServerClient();
    // create stream of file
    const stream = createReadStream(pathToFile);

    // get mime type
    const mimeType = mime.getType(pathToFile);
    if (!mimeType) throw "Could not get mime type";

    // get user session
    const { data: dataUser, error: errorUser } = await supabase.auth.getUser();
    if (errorUser || !dataUser) throw "Failed to verify user";

    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();
    if (error) throw error;
    if (!session) throw "Failed to verify user";

    // TUS client: promised based upload
    return new Promise((resolve, reject) => {
      var upload = new tus.Upload(stream, {
        endpoint: `${process.env.NEXT_SUPABASE_URL!}/storage/v1/upload/resumable`,
        retryDelays: [0, 3000, 5000, 10000, 20000],
        headers: {
          authorization: `Bearer ${session.access_token}`,
          "x-upsert": "true", // optionally set upsert to true to overwrite existing files
        },
        uploadDataDuringCreation: true,
        removeFingerprintOnSuccess: true, // Important if you want to allow re-uploading the same file https://github.com/tus/tus-js-client/blob/main/docs/api.md#removefingerprintonsuccess
        metadata: {
          bucketName: "audio",
          objectName: `${userId}/${projectId}/${nameOfFileInSupabase}`,
          // objectName: nameOfFileInSupabase,
          contentType: mimeType,
          cacheControl: "3600",
        },
        //   chunkSize: 6 * 1024 * 1024, // NOTE: it must be set to 6MB (for now) do not change it
        onError: function (error) {
          console.log("Failed because: " + error);
          reject(error);
        },
        // // progress bar in toast
        // onProgress: function (bytesUploaded, bytesTotal) {
        //   var progress = bytesUploaded / bytesTotal;

        //   var percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
        //   console.log(bytesUploaded, bytesTotal, percentage + "%");
        // },
        onSuccess: function () {
          resolve("success");
        },
      });

      // Check if there are any previous uploads to continue.
      return upload.findPreviousUploads().then(function (previousUploads) {
        // Found previous uploads so we select the first one.
        if (previousUploads.length) {
          upload.resumeFromPreviousUpload(previousUploads[0]);
        }

        // Start the upload
        upload.start();
      });
    });
  } catch (error) {
    throw error;
  }

  // stream.on("data", (chunk) => {
  //   console.log(`Received ${chunk.length} bytes of data.`);
  // });
  // stream.on("end", () => {
  //   console.log("There will be no more data.");
  // });

  // console.log(file);

  // console.log(file.mimetype);
  // console.log(file.filename);
}

export async function createProject(
  params: Database["public"]["Tables"]["transcripts"]["Insert"],
) {
  console.log("creating project in supabase ");

  try {
    const supabase = createSupaseServerClient();
    // verfify user
    const { data: user, error: errorUser } = await supabase.auth.getUser();
    const userIdfromClient = user.user?.id;
    if (errorUser || !userIdfromClient || userIdfromClient !== params.user_id) {
      throw "User could not be validated";
    }
    const { data, error } = await supabase
      .from("transcripts")
      .insert(params)
      .select();

    if (error) {
      throw error;
    }
    // return project id
    return { data: data[0].id };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}

/**
 * get amount of free credits
 */
export async function getCredits(userId: string) {
  console.log("getting number of free credits");
  try {
    const supabase = createSupaseServerClient();
    const { data, error } = await supabase
      .from("balance")
      .select("credits")
      .eq("id", userId);

    if (error) {
      throw error;
    }
    if (!data) throw "Failed to fetch free credits";
    // return credits
    return { data: data[0].credits };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}

/**
 * Save an API-Key for OpenAI for current user in supabase (encryted)
 * @param userId userID string
 * @param openAiKey API key cleartext
 */
export async function setOpenAiKey(openAiKey: string) {
  try {
    const supabase = createSupaseServerClient();
    // get user id
    const { data: dataUser, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    const userId = dataUser.user.id;

    // server side input validation
    const result = OpenAiKeySchema.safeParse(openAiKey);
    if (!result.success) {
      // create and display errorMessage
      const errorMessage = result.error.issues[0].message;
      throw errorMessage;
    }

    // encrypt API key
    const Cryptr = require("cryptr");
    const cryptr = new Cryptr(process.env.NEXT_CRYTR_KEY!);
    const encryptedApiKey = cryptr.encrypt(result.data);

    const { error } = await supabase
      .from("open_ai_keys")
      .upsert({ id: userId, api_key: encryptedApiKey });

    if (error) {
      throw error;
    }
    revalidatePath("/account");
    return {};
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}

/**
 * Let user delete his OpenAI key
 */
export async function deleteOpenAiKey() {
  console.log("deleting OpenAI Key");

  try {
    const supabase = createSupaseServerClient();
    // get user id
    const { data: dataUser, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    const userId = dataUser.user.id;
    const { error } = await supabase
      .from("open_ai_keys")
      .delete()
      .eq("id", userId);
    if (error) throw error;
    return {};
  } catch (error) {
    console.log(error);
    return { error: getErrorMessage(error) };
  }
}

/**
 * Get users own API key from supabase and decrypt it
 */
export async function getOpenAiKey(userId: string) {
  console.log("getting users OpenAi Key");
  try {
    const supabase = createSupaseServerClient();
    const { data, error } = await supabase
      .from("open_ai_keys")
      .select("api_key")
      .eq("id", userId);

    if (error || !data || !data[0].api_key) throw "Failed to fetch OpenAI Key";

    // decrypt API KEY
    const Cryptr = require("cryptr");
    const cryptr = new Cryptr(process.env.NEXT_CRYTR_KEY!);
    const decryptedApiKey = cryptr.decrypt(data[0].api_key) as string;
    return { data: decryptedApiKey };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}

export async function getEmailOfUser() {
  try {
    const supabase = createSupaseServerClient();
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    if (!data) throw "Unable to verify user";
    return { data: data.user.email };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}
